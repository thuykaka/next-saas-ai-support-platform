import { v } from 'convex/values';
import { internalQuery } from '../_generated/server';

export const getByThreadId = internalQuery({
  args: {
    threadId: v.string()
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db
      .query('conversations')
      .withIndex('by_thread_id', (q) => q.eq('threadId', args.threadId))
      .unique();
    return conversation;
  }
});
