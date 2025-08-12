import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import { action, query } from '../_generated/server';
import supportAgent from '../system/ai/agents/supportAgent';

// Only can internal functions with action https://docs.convex.dev/functions/internal-functions
export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id('contactSessions')
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId
      }
    );

    // Check session is valid and not expired
    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session'
      });
    }

    // Get conversation by threadId
    const conversation = await ctx.runQuery(
      internal.system.conversations.getByThreadId,
      {
        threadId: args.threadId
      }
    );

    // Check conversation is valid
    if (!conversation) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Conversation not found'
      });
    }

    // Check conversation is from the same session
    if (conversation.contactSessionId !== contactSession._id) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session'
      });
    }

    if (conversation.status === 'resolved') {
      throw new ConvexError({
        code: 'BAD_REQUEST',
        message: 'Conversation is resolved'
      });
    }

    await supportAgent.generateText(
      ctx,
      {
        threadId: args.threadId
      },
      {
        prompt: args.prompt
      }
    );

    return {
      success: true
    };
  }
});

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    contactSessionId: v.id('contactSessions')
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession || contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Invalid session'
      });
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts
    });

    return paginated;
  }
});
