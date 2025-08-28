import { ConvexError, v } from 'convex/values';
import { internalMutation, internalQuery } from '../_generated/server';
import {
  AUTO_REFRESH_THRESHOLD_MS,
  SESSION_DURATION_TIME_MS
} from '../constants';

export const getOne = internalQuery({
  args: {
    contactSessionId: v.id('contactSessions')
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    return contactSession;
  }
});

export const refresh = internalMutation({
  args: {
    contactSessionId: v.id('contactSessions')
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);
    if (!contactSession) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Contact session not found'
      });
    }

    if (contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: 'BAD_REQUEST',
        message: 'Contact session expired'
      });
    }

    const timeRemaining = contactSession.expiresAt - Date.now();

    if (timeRemaining < AUTO_REFRESH_THRESHOLD_MS) {
      const newExpiresAt = Date.now() + SESSION_DURATION_TIME_MS;
      await ctx.db.patch(args.contactSessionId, {
        expiresAt: newExpiresAt
      });

      return {
        ...contactSession,
        expiresAt: newExpiresAt
      };
    }

    return contactSession;
  }
});
