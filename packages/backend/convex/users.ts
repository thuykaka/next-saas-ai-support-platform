import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getMany = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    return users;
  }
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string()
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert('users', args);
    return { id };
  }
});
