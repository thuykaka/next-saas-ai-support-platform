import { ConvexError, v } from 'convex/values';
import { mutation, query } from '../_generated/server';

export const getOne = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const widgetSettings = await ctx.db
      .query('widgetSettings')
      .withIndex('by_org_id', (q) => q.eq('orgId', identity.orgId as string))
      .unique();

    return widgetSettings;
  }
});

export const upsert = mutation({
  args: {
    greetingMessage: v.string(),
    defaultSuggestions: v.object({
      suggestion1: v.optional(v.string()),
      suggestion2: v.optional(v.string()),
      suggestion3: v.optional(v.string())
    }),
    vapiSettings: v.object({
      phoneNumber: v.optional(v.string()),
      assistantId: v.optional(v.string())
    })
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity || !identity.orgId) {
      throw new ConvexError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized'
      });
    }

    const existingWidgetSettings = await ctx.db
      .query('widgetSettings')
      .withIndex('by_org_id', (q) => q.eq('orgId', identity.orgId as string))
      .unique();

    if (existingWidgetSettings) {
      await ctx.db.patch(existingWidgetSettings._id, {
        greetingMessage: args.greetingMessage,
        defaultSuggestions: args.defaultSuggestions,
        vapiSettings: args.vapiSettings
      });
    } else {
      await ctx.db.insert('widgetSettings', {
        orgId: identity.orgId as string,
        greetingMessage: args.greetingMessage,
        defaultSuggestions: args.defaultSuggestions,
        vapiSettings: args.vapiSettings
      });
    }
  }
});
