import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const checkUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const username = args.username.toLowerCase().trim();
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();
    return { available: !existing };
  },
});

export const claimUsername = mutation({
  args: {
    username: v.string(),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const username = args.username.toLowerCase().trim();

    // Check if username is available
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existing) {
      throw new Error("Username already taken");
    }

    // Check if user already has a username
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    if (existingUser) {
      throw new Error("User already has a username");
    }

    // Create user
    const newUserId = await ctx.db.insert("users", {
      username,
      email: args.email,
      tokenIdentifier: userId,
      isPublished: true,
      viewCount: 0,
    });

    return { userId: newUserId, username };
  },
});

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    return user;
  },
});

export const getUserByUsername = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const username = args.username.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    return user;
  },
});

export const updateProfile = mutation({
  args: {
    bio: v.optional(v.string()),
    title: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      bio: args.bio,
      title: args.title,
      profilePicture: args.profilePicture,
    });

    return { success: true };
  },
});

export const togglePublish = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", userId))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      isPublished: !user.isPublished,
    });

    return { isPublished: !user.isPublished };
  },
});

export const incrementViewCount = mutation({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const username = args.username.toLowerCase().trim();
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (!user) return;

    await ctx.db.patch(user._id, {
      viewCount: user.viewCount + 1,
    });
  },
});
