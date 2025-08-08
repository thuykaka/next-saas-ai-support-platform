import { v } from 'convex/values';
import { query, mutation } from '../_generated/server';

const SESSION_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 1; // 1 days

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    orgId: v.string(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        ipAddress: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.array(v.string())),
        platform: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(
          v.object({
            width: v.number(),
            height: v.number()
          })
        ),
        viewportSize: v.optional(
          v.object({
            width: v.number(),
            height: v.number()
          })
        ),
        timezone: v.optional(v.string()),
        timezoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string())
      })
    )
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('contactSessions', {
      ...args,
      expiresAt: Date.now() + SESSION_EXPIRATION_TIME
    });

    return { id };
  }
});

export const validate = mutation({
  args: {
    id: v.id('contactSessions')
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.id);

    if (!contactSession) {
      return { valid: false, message: 'Contact session not found' };
    }

    if (contactSession.expiresAt < Date.now()) {
      return { valid: false, message: 'Contact session expired' };
    }

    return { valid: true, contactSession };
  }
});
