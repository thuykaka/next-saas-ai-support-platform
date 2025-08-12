import { saveMessage } from '@convex-dev/agent';
import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';
import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { components } from '../_generated/api';
import { action, mutation, query } from '../_generated/server';
import { OPERATOR_MESSAGE_ENHANCEMENT_PROMPT } from '../constants';
import supportAgent from '../system/ai/agents/supportAgent';

export const getMany = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const conversation = await ctx.db
      .query('conversations')
      .withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
      .unique();

    if (!conversation) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Conversation not found'
      });
    }

    if (conversation.orgId !== identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const paginated = await supportAgent.listMessages(ctx, {
      threadId: args.threadId,
      paginationOpts: args.paginationOpts
    });

    return paginated;
  }
});

export const create = mutation({
  args: {
    prompt: v.string(),
    conversationId: v.id('conversations')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const conversation = await ctx.db.get(args.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Conversation not found'
      });
    }

    if (conversation.orgId !== identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    if (conversation.status === 'resolved') {
      throw new ConvexError({
        code: 'BAD_REQUEST',
        message: 'Conversation is resolved'
      });
    }

    await saveMessage(ctx, components.agent, {
      threadId: conversation.threadId,
      agentName: identity.familyName,
      message: {
        role: 'assistant',
        content: args.prompt
      }
    });

    return {
      success: true
    };
  }
});

export const enhanceResponse = action({
  args: {
    prompt: v.string(),
    threadId: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const response = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: OPERATOR_MESSAGE_ENHANCEMENT_PROMPT
        },
        {
          role: 'user',
          content: args.prompt
        }
      ]
    });

    return response.text;
  }
});
