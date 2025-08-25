import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { internalAction } from '../_generated/server';
import { upsertSecretValue } from '../lib/awsSecrets';

export const upsert = internalAction({
  args: {
    orgId: v.string(),
    service: v.union(v.literal('vapi')),
    value: v.any()
  },
  async handler(ctx, args) {
    const secretName = `tenant/${args.orgId}/service/${args.service}`;

    // save to aws secrets manager
    await upsertSecretValue(secretName, args.value);

    // save to convex
    await ctx.runMutation(internal.system.plugins.upsert, {
      orgId: args.orgId,
      service: args.service,
      secretName
    });

    return { status: 'success' };
  }
});
