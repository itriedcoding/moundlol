import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

    const now = Date.now();
    return links
      .filter((link) => {
        if (!link.isVisible) return false;
        if (link.scheduledStart && link.scheduledStart > now) return false;
        if (link.scheduledEnd && link.scheduledEnd < now) return false;
        if (link.expiresAt && link.expiresAt < now) return false;
        return true;
      })
      .sort((a, b) => {
        if (a.isPriority && !b.isPriority) return -1;
        if (!a.isPriority && b.isPriority) return 1;
        return a.order - b.order;
      });
  },
});

export const getMyLinks = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
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
    sessionToken: v.string(),
    platform: v.string(),
    title: v.string(),
    url: v.string(),
    icon: v.optional(v.string()),
    category: v.optional(v.string()),
    followerCount: v.optional(v.string()),
    isPriority: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
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
      category: args.category,
      followerCount: args.followerCount,
      isPriority: args.isPriority || false,
    });

    return linkId;
  },
});

export const updateLink = mutation({
  args: {
    sessionToken: v.string(),
    linkId: v.id("links"),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    isVisible: v.optional(v.boolean()),
    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    category: v.optional(v.string()),
    followerCount: v.optional(v.string()),
    isPriority: v.optional(v.boolean()),
    thumbnail: v.optional(v.string()),
    animation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
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
    if (args.scheduledStart !== undefined) updates.scheduledStart = args.scheduledStart;
    if (args.scheduledEnd !== undefined) updates.scheduledEnd = args.scheduledEnd;
    if (args.expiresAt !== undefined) updates.expiresAt = args.expiresAt;
    if (args.category !== undefined) updates.category = args.category;
    if (args.followerCount !== undefined) updates.followerCount = args.followerCount;
    if (args.isPriority !== undefined) updates.isPriority = args.isPriority;
    if (args.thumbnail !== undefined) updates.thumbnail = args.thumbnail;
    if (args.animation !== undefined) updates.animation = args.animation;

    await ctx.db.patch(args.linkId, updates);

    return { success: true };
  },
});

export const deleteLink = mutation({
  args: {
    sessionToken: v.string(),
    linkId: v.id("links")
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
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
    sessionToken: v.string(),
    linkIds: v.array(v.id("links")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
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

    await ctx.db.insert("analytics", {
      userId: link.userId,
      linkId: args.linkId,
      type: "link_click",
      timestamp: Date.now(),
    });
  },
});

export const getLinksByCategory = query({
  args: {
    sessionToken: v.string(),
    category: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .unique();

    if (!user) return [];

    if (!args.category) {
      return await ctx.db
        .query("links")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .collect();
    }

    return await ctx.db
      .query("links")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", user._id).eq("category", args.category)
      )
      .collect();
  },
});
