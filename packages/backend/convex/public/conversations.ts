import { ConvexError, v } from 'convex/values';
import { mutation, query } from '../_generated/server';

export const getOne = query({
  args: {
    id: v.id('conversations'),
    contactSessionId: v.id('contactSessions')
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session'
      });
    }

    const conversation = await ctx.db.get(args.id);
    if (!conversation) return null;

    return {
      id: conversation._id,
      threadId: conversation.threadId,
      status: conversation.status
    };
  }
});

export const create = mutation({
  args: {
    orgId: v.string(),
    contactSessionId: v.id('contactSessions')
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.contactSessionId);

    if (!session || session.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session'
      });
    }

    let id = await ctx.db.insert('conversations', {
      threadId: crypto.randomUUID(),
      orgId: args.orgId,
      contactSessionId: session._id,
      status: 'unresolved'
    });

    return { id };
  }
});
