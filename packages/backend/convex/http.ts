import { httpRouter } from 'convex/server';
import { type WebhookEvent, createClerkClient } from '@clerk/backend';
import { Webhook } from 'svix';
import { internal } from './_generated/api';
import { httpAction } from './_generated/server';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!
});

const router = httpRouter();

type SubscriptionUpdatedEventData = {
  status: string;
  payer?: {
    organization_id?: string;
  };
};

router.route({
  path: '/clerk-webhook',
  method: 'POST',
  handler: httpAction(async (ctx, req) => {
    const event = await validateWebhook(req);
    if (!event) {
      return new Response('Invalid webhook', { status: 400 });
    }

    switch (event.type) {
      case 'subscription.updated':
        const subscription = event.data as SubscriptionUpdatedEventData;
        const orgId = subscription.payer?.organization_id;
        if (!orgId)
          return new Response('No organization ID found', { status: 400 });

        // Upgrade the organization to has 5 members
        const maxAllowedMemberships = subscription.status === 'active' ? 5 : 1;
        await clerkClient.organizations.updateOrganization(orgId, {
          maxAllowedMemberships
        });

        // Save to our database
        await ctx.runMutation(internal.system.subscriptions.upsert, {
          orgId,
          status: subscription.status
        });

        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response('OK', { status: 200 });
  })
});

const validateWebhook = async (req: Request): Promise<WebhookEvent | null> => {
  const payloadText = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id') || '',
    'svix-timestamp': req.headers.get('svix-timestamp') || '',
    'svix-signature': req.headers.get('svix-signature') || ''
  };

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    const event = wh.verify(
      payloadText,
      svixHeaders
    ) as unknown as WebhookEvent;
    return event;
  } catch (error) {
    console.error(`Error verifying webhook: ${error}`);
    return null;
  }
};

export default router;
