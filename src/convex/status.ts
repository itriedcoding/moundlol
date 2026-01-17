import { query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const links = await ctx.db.query("links").collect();

    const totalViews = users.reduce((acc, user) => acc + (user.viewCount || 0), 0);
    const totalClicks = links.reduce((acc, link) => acc + (link.clickCount || 0), 0);

    return {
      status: "operational",
      timestamp: Date.now(),
      stats: {
        users: users.length,
        links: links.length,
        views: totalViews,
        clicks: totalClicks,
      },
      services: {
        api: "operational",
        database: "operational",
        discordBot: "operational", // In a real app, we'd check a heartbeat
        redirects: "operational",
      }
    };
  },
});