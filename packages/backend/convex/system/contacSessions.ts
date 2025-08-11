import { v } from 'convex/values';
import { internalQuery } from '../_generated/server';

export const getOne = internalQuery({
  args: {
    contactSessionId: v.id('contactSessions')
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    return contactSession;
  }
});
