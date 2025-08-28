import { v } from 'convex/values';
import { internalMutation, internalQuery } from '../_generated/server';

export const upsert = internalMutation({
  args: {
    orgId: v.string(),
    status: v.string()
  },
  handler: async (ctx, args) => {
    const existingSubscription = await ctx.db
      .query('subscriptionPlans')
      .withIndex('by_org_id', (q) => q.eq('orgId', args.orgId))
      .unique();

    if (existingSubscription) {
      await ctx.db.patch(existingSubscription._id, {
        status: args.status
      });
    } else {
      await ctx.db.insert('subscriptionPlans', {
        orgId: args.orgId,
        status: args.status
      });
    }
  }
});

export const getByOrgId = internalQuery({
  args: {
    orgId: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('subscriptionPlans')
      .withIndex('by_org_id', (q) => q.eq('orgId', args.orgId))
      .unique();
  }
});
