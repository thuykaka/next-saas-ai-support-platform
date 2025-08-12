import { z } from 'zod';
import { createTool } from '@convex-dev/agent';
import { internal } from '../../../_generated/api';
import supportAgent from '../agents/supportAgent';

export const escalateConversationTool = createTool({
  description: 'Escalate a conversation to a human operator',
  args: z.object({}),
  handler: async (ctx) => {
    const threadId = ctx.threadId;

    if (!threadId) {
      return 'No thread found';
    }

    await ctx.runMutation(internal.system.conversations.escalate, { threadId });

    await supportAgent.saveMessage(ctx, {
      threadId,
      message: {
        role: 'assistant',
        content:
          'Conversation escalated to a human operator. Thank you for your patience.'
      }
    });

    return 'Conversation escalated to a human operator';
  }
});
