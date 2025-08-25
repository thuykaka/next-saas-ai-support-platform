import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import { mutation } from '../_generated/server';

export const upsert = mutation({
  args: {
    service: v.union(v.literal('vapi')),
    value: v.any()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    // must use scheduler to call internal action in mutation
    await ctx.scheduler.runAfter(0, internal.system.secrets.upsert, {
      orgId: identity.orgId as string,
      service: args.service,
      value: args.value
    });
  }
});
