import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const trackProfileView = mutation({
  args: {
    username: v.string(),
    referrer: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
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
      utmSource: args.utmSource,
      utmMedium: args.utmMedium,
      utmCampaign: args.utmCampaign,
    });
  },
});

export const getAnalytics = query({
  args: {
    sessionToken: v.string(),
    range: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
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

    const linkClickCounts: Record<string, number> = {};
    for (const event of analytics) {
      if (event.type === "link_click" && event.linkId) {
        const linkId = event.linkId;
        linkClickCounts[linkId] = (linkClickCounts[linkId] || 0) + 1;
      }
    }

    // UTM analytics
    const utmSources: Record<string, number> = {};
    analytics.forEach((a) => {
      if (a.utmSource) {
        utmSources[a.utmSource] = (utmSources[a.utmSource] || 0) + 1;
      }
    });

    return {
      profileViews,
      linkClicks,
      totalViews: user.viewCount,
      linkClickCounts,
      utmSources,
      analytics,
    };
  },
});

export const addEmailSubscriber = mutation({
  args: {
    username: v.string(),
    email: v.string(),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) throw new Error("User not found");

    // Check if email already subscribed
    const existing = await ctx.db
      .query("emailSubscribers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existing) {
      throw new Error("Email already subscribed");
    }

    await ctx.db.insert("emailSubscribers", {
      userId: user._id,
      email: args.email,
      subscribedAt: Date.now(),
      source: args.source,
    });

    return { success: true };
  },
});

export const getEmailSubscribers = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .unique();

    if (!user) return [];

    const subscribers = await ctx.db
      .query("emailSubscribers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return subscribers;
  },
});
