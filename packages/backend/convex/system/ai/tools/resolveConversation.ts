import { z } from 'zod/v3';
import { createTool } from '@convex-dev/agent';
import { internal } from '../../../_generated/api';
import supportAgent from '../agents/supportAgent';

export const resolveConversationTool = createTool({
  description: 'Resolve a conversation',
  args: z.object({}),
  handler: async (ctx, args) => {
    const threadId = ctx.threadId;

    if (!threadId) {
      return 'No thread found';
    }

    await ctx.runMutation(internal.system.conversations.resolve, { threadId });

    await supportAgent.saveMessage(ctx, {
      threadId,
      message: {
        role: 'assistant',
        content: 'Conversation resolved. Thank you for your patience.'
      }
    });

    return 'Conversation resolved';
  }
});
