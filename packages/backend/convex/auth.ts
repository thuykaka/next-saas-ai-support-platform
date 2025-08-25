import { query } from './_generated/server';

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error('Unauthenticated');
    }
    return identity;
  }
});
