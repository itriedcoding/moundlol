import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const trackProfileView = mutation({
  args: {
    username: v.string(),
    referrer: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const username = args.username.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (!user) return;

    await ctx.db.insert("analytics", {
      userId: user._id,
      type: "profile_view",
      timestamp: Date.now(),
      referrer: args.referrer,
    });
  },
});

export const getAnalytics = query({
  args: {
    range: v.optional(v.string()), // "7d", "30d", "all"
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    if (!user) return null;

    const range = args.range || "7d";
    let startTime = 0;

    if (range === "7d") {
      startTime = Date.now() - 7 * 24 * 60 * 60 * 1000;
    } else if (range === "30d") {
      startTime = Date.now() - 30 * 24 * 60 * 60 * 1000;
    }

    const analytics = await ctx.db
      .query("analytics")
      .withIndex("by_user_and_timestamp", (q) =>
        q.eq("userId", user._id).gte("timestamp", startTime)
      )
      .collect();

    const profileViews = analytics.filter((a) => a.type === "profile_view").length;
    const linkClicks = analytics.filter((a) => a.type === "link_click").length;

    // Get click counts per link
    const linkClickCounts: Record<string, number> = {};
    for (const event of analytics) {
      if (event.type === "link_click" && event.linkId) {
        const linkId = event.linkId;
        linkClickCounts[linkId] = (linkClickCounts[linkId] || 0) + 1;
      }
    }

    return {
      profileViews,
      linkClicks,
      totalViews: user.viewCount,
      linkClickCounts,
      analytics,
    };
  },
});
