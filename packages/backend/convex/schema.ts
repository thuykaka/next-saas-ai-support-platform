import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    password: v.string()
  }),

  contactSessions: defineTable({
    name: v.string(),
    email: v.string(),
    orgId: v.string(),
    expiresAt: v.number(),
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
  })
    .index('by_org_id', ['orgId'])
    .index('by_expires_at', ['expiresAt']),

  conversations: defineTable({
    threadId: v.string(),
    orgId: v.string(),
    contactSessionId: v.id('contactSessions'),
    status: v.union(
      v.literal('unresolved'),
      v.literal('escalated'),
      v.literal('resolved')
    )
  })
    .index('by_org_id', ['orgId'])
    .index('by_contact_session_id', ['contactSessionId'])
    .index('by_status_and_org_id', ['status', 'orgId'])
    .index('by_thread_id', ['threadId']),

  plugins: defineTable({
    orgId: v.string(),
    service: v.union(v.literal('vapi')),
    secretName: v.string()
  })
    .index('by_org_id', ['orgId'])
    .index('by_org_id_and_service', ['orgId', 'service'])
});
