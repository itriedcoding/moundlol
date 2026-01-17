import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const links = await ctx.db.query("links").collect();
    
    return {
      status: "operational",
      timestamp: Date.now(),
      stats: {
        users: users.length,
        links: links.length,
      }
    };
  },
});