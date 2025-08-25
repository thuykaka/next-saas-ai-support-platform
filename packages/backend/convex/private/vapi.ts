import { GenericActionCtx } from 'convex/server';
import { ConvexError } from 'convex/values';
import { Vapi, VapiClient } from '@vapi-ai/server-sdk';
import { internal } from '../_generated/api';
import { DataModel } from '../_generated/dataModel';
import { action } from '../_generated/server';
import { getSecretValue, parseSecretFromString } from '../lib/awsSecrets';

const getVapiClient = async (ctx: GenericActionCtx<DataModel>) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity || !identity.orgId) {
    throw new ConvexError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized'
    });
  }

  const plugin = await ctx.runQuery(
    internal.system.plugins.getByOrgIdAndService,
    {
      orgId: identity.orgId as string,
      service: 'vapi'
    }
  );

  if (!plugin) {
    throw new ConvexError({
      code: 'NOT_FOUND',
      message: 'Plugin not found'
    });
  }

  const secret = await getSecretValue(plugin.secretName);
  const secretData = parseSecretFromString<{
    privateKey: string;
    publicKey: string;
  }>(secret);

  if (!secretData || !secretData.privateKey || !secretData.publicKey) {
    throw new ConvexError({
      code: 'NOT_FOUND',
      message: 'Secret not found'
    });
  }

  const vapiClient = new VapiClient({
    token: secretData.privateKey
  });

  return vapiClient;
};

export const getPhoneNumbers = action({
  args: {},
  handler: async (ctx, args): Promise<Vapi.PhoneNumbersListResponseItem[]> => {
    const vapiClient = await getVapiClient(ctx);

    const phoneNumbers = await vapiClient.phoneNumbers.list();

    return phoneNumbers;
  }
});

export const getAssistants = action({
  args: {},
  handler: async (ctx, args): Promise<Vapi.Assistant[]> => {
    const vapiClient = await getVapiClient(ctx);

    const assistants = await vapiClient.assistants.list();

    return assistants;
  }
});
