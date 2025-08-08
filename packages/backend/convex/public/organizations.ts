import { v } from 'convex/values';
import { createClerkClient } from '@clerk/backend';
import { action } from '../_generated/server';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!
});

export const validate = action({
  args: {
    id: v.string()
  },
  handler: async (_, args) => {
    const org = await clerk.organizations.getOrganization({
      organizationId: args.id
    });

    if (!org) {
      return { valid: false, message: 'BACKEND_ERROR: Organization not found' };
    }

    return { valid: true };
  }
});
