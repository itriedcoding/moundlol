import { internalMutation } from "./_generated/server";

export const clearAllLinks = internalMutation({
  handler: async (ctx) => {
    // Delete all links
    const links = await ctx.db.query("links").collect();
    for (const link of links) {
      await ctx.db.delete(link._id);
    }
    
    // Reset view counts for all users
    const users = await ctx.db.query("users").collect();
    for (const user of users) {
        await ctx.db.patch(user._id, { viewCount: 0 });
    }
  },
});
