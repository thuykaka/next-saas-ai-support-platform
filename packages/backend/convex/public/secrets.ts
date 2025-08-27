import { v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { getSecretValue, parseSecretFromString } from '../lib/awsSecrets';

export const getVAPISecrets = action({
  args: {
    orgId: v.string()
  },
  async handler(ctx, args) {
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrgIdAndService,
      {
        orgId: args.orgId,
        service: 'vapi'
      }
    );

    if (!plugin) {
      return null;
    }

    const secretString = await getSecretValue(plugin.secretName);

    const secretData = parseSecretFromString<{
      publicKey: string;
      privateKey: string;
    }>(secretString);

    if (!secretData?.publicKey || !secretData?.privateKey) {
      return null;
    }

    return { publicKey: secretData.publicKey };
  }
});
