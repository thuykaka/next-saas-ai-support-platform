import { MessageDoc, saveMessage } from '@convex-dev/agent';
import { paginationOptsValidator } from 'convex/server';
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

export const getMany = query({
  args: {
    contactSessionId: v.id('contactSessions'),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session'
      });
    }

    const conversations = await ctx.db
      .query('conversations')
      .withIndex('by_contact_session_id', (q) =>
        q.eq('contactSessionId', args.contactSessionId)
      )
      .order('desc')
      .paginate(args.paginationOpts);

    const conversationsWithLastMessage = await Promise.all(
      conversations.page.map(async (conversation) => {
        let lastMessage: MessageDoc | null = null;

        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: { numItems: 1, cursor: null } // last message
        });

        if (messages.page.length > 0) {
          lastMessage = messages.page[0] ?? null;
        }

        return {
          _id: conversation._id,
          _creationTime: conversation._creationTime,
          status: conversation.status,
          orgId: conversation.orgId,
          threadId: conversation.threadId,
          lastMessage: lastMessage
        };
      })
    );

    return {
      ...conversations,
      page: conversationsWithLastMessage
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
