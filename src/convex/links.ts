import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getLinks = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const username = args.username.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (!user) return [];

    const links = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Filter by visibility and schedule
    const now = Date.now();
    return links
      .filter((link) => {
        if (!link.isVisible) return false;
        if (link.scheduledStart && link.scheduledStart > now) return false;
        if (link.scheduledEnd && link.scheduledEnd < now) return false;
        return true;
      })
      .sort((a, b) => a.order - b.order);
  },
});

export const getMyLinks = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    if (!user) return [];

    const links = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return links.sort((a, b) => a.order - b.order);
  },
});

export const addLink = mutation({
  args: {
    platform: v.string(),
    title: v.string(),
    url: v.string(),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    if (!user) throw new Error("User not found");

    const existingLinks = await ctx.db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const newOrder = existingLinks.length;

    const linkId = await ctx.db.insert("links", {
      userId: user._id,
      platform: args.platform,
      title: args.title,
      url: args.url,
      icon: args.icon,
      isVisible: true,
      order: newOrder,
      clickCount: 0,
    });

    return linkId;
  },
});

export const updateLink = mutation({
  args: {
    linkId: v.id("links"),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    isVisible: v.optional(v.boolean()),
    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    if (!user) throw new Error("User not found");

    const link = await ctx.db.get(args.linkId);
    if (!link || link.userId !== user._id) {
      throw new Error("Link not found or unauthorized");
    }

    const updates: Record<string, any> = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.url !== undefined) updates.url = args.url;
    if (args.isVisible !== undefined) updates.isVisible = args.isVisible;
    if (args.scheduledStart !== undefined)
      updates.scheduledStart = args.scheduledStart;
    if (args.scheduledEnd !== undefined) updates.scheduledEnd = args.scheduledEnd;

    await ctx.db.patch(args.linkId, updates);

    return { success: true };
  },
});

export const deleteLink = mutation({
  args: { linkId: v.id("links") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    if (!user) throw new Error("User not found");

    const link = await ctx.db.get(args.linkId);
    if (!link || link.userId !== user._id) {
      throw new Error("Link not found or unauthorized");
    }

    await ctx.db.delete(args.linkId);

    return { success: true };
  },
});

export const reorderLinks = mutation({
  args: {
    linkIds: v.array(v.id("links")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    if (!user) throw new Error("User not found");

    for (let i = 0; i < args.linkIds.length; i++) {
      const link = await ctx.db.get(args.linkIds[i]);
      if (link && link.userId === user._id) {
        await ctx.db.patch(args.linkIds[i], { order: i });
      }
    }

    return { success: true };
  },
});

export const incrementClickCount = mutation({
  args: { linkId: v.id("links") },
  handler: async (ctx, args) => {
    const link = await ctx.db.get(args.linkId);
    if (!link) return;

    await ctx.db.patch(args.linkId, {
      clickCount: link.clickCount + 1,
    });

    // Track analytics
    await ctx.db.insert("analytics", {
      userId: link.userId,
      linkId: args.linkId,
      type: "link_click",
      timestamp: Date.now(),
    });
  },
});
