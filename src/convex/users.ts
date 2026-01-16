import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to generate session token
function generateSessionToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

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
    const username = args.username.toLowerCase().trim();

    // Check if username is available
    const existing = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", username))
      .unique();

    if (existing) {
      throw new Error("Username already taken");
    }

    // Create user with session token
    const sessionToken = generateSessionToken();
    const newUserId = await ctx.db.insert("users", {
      username,
      email: args.email,
      sessionToken,
      isPublished: true,
      viewCount: 0,
    });

    return { userId: newUserId, username, sessionToken };
  },
});

export const getUserBySession = query({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
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
    sessionToken: v.string(),
    bio: v.optional(v.string()),
    title: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    email: v.optional(v.string()),
    customDomain: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    backgroundType: v.optional(v.string()),
    backgroundValue: v.optional(v.string()),
    buttonStyle: v.optional(v.string()),
    font: v.optional(v.string()),
    showSocialProof: v.optional(v.boolean()),
    customCss: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .unique();

    if (!user) throw new Error("User not found");

    const updates: any = {};
    if (args.bio !== undefined) updates.bio = args.bio;
    if (args.title !== undefined) updates.title = args.title;
    if (args.profilePicture !== undefined) updates.profilePicture = args.profilePicture;
    if (args.email !== undefined) updates.email = args.email;
    if (args.customDomain !== undefined) updates.customDomain = args.customDomain;
    if (args.seoTitle !== undefined) updates.seoTitle = args.seoTitle;
    if (args.seoDescription !== undefined) updates.seoDescription = args.seoDescription;
    if (args.backgroundType !== undefined) updates.backgroundType = args.backgroundType;
    if (args.backgroundValue !== undefined) updates.backgroundValue = args.backgroundValue;
    if (args.buttonStyle !== undefined) updates.buttonStyle = args.buttonStyle;
    if (args.font !== undefined) updates.font = args.font;
    if (args.showSocialProof !== undefined) updates.showSocialProof = args.showSocialProof;
    if (args.customCss !== undefined) updates.customCss = args.customCss;

    await ctx.db.patch(user._id, updates);

    return { success: true };
  },
});

export const togglePublish = mutation({
  args: { sessionToken: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
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

export const setPassword = mutation({
  args: {
    sessionToken: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .unique();

    if (!user) throw new Error("User not found");

    // Simple password storage (in production, use proper hashing)
    await ctx.db.patch(user._id, {
      password: args.password,
    });

    return { success: true };
  },
});

export const verifyPassword = query({
  args: {
    username: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user || !user.password) return { valid: false };

    return { valid: user.password === args.password };
  },
});

export const generateQRCode = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const url = `https://mound.lol/${args.username}`;
    return { url };
  },
});

export const updateCustomColors = mutation({
  args: {
    sessionToken: v.string(),
    background: v.string(),
    text: v.string(),
    accent: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      customColors: {
        background: args.background,
        text: args.text,
        accent: args.accent,
      },
    });

    return { success: true };
  },
});
