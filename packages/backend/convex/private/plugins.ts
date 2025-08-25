import { ConvexError, v } from 'convex/values';
import { mutation, query } from '../_generated/server';

export const getOne = query({
  args: {
    service: v.union(v.literal('vapi'))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const plugin = await ctx.db
      .query('plugins')
      .withIndex('by_org_id_and_service', (q) =>
        q.eq('orgId', identity.orgId as string).eq('service', args.service)
      )
      .unique();

    return plugin;
  }
});

export const remove = mutation({
  args: {
    service: v.union(v.literal('vapi'))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const existingPlugin = await ctx.db
      .query('plugins')
      .withIndex('by_org_id_and_service', (q) =>
        q.eq('orgId', identity.orgId as string).eq('service', args.service)
      )
      .unique();

    if (!existingPlugin) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Plugin not found'
      });
    }

    await ctx.db.delete(existingPlugin._id);
  }
});
