import { saveMessage } from '@convex-dev/agent';
import { ConvexError, v } from 'convex/values';
import { components } from '../_generated/api';
import { mutation, query } from '../_generated/server';
import supportAgent from '../system/ai/agents/supportAgent';

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
    if (!conversation) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Conversation not found'
      });
    }

    if (conversation.contactSessionId !== args.contactSessionId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session'
      });
    }

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

    const { threadId } = await supportAgent.createThread(ctx, {
      userId: args.orgId
    });

    // Initialize the thread with a welcome message
    await saveMessage(ctx, components.agent, {
      threadId,
      message: {
        role: 'assistant',
        content: 'Hello, how can I help you today?'
      }
    });

    const id = await ctx.db.insert('conversations', {
      threadId,
      orgId: args.orgId,
      contactSessionId: session._id,
      status: 'unresolved'
    });

    return { id };
  }
});
