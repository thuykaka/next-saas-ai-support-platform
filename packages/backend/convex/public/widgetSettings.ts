import { v } from 'convex/values';
import { query } from '../_generated/server';

export const getOne = query({
  args: {
    orgId: v.string()
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('widgetSettings')
      .withIndex('by_org_id', (q) => q.eq('orgId', args.orgId))
      .unique();
  }
});
