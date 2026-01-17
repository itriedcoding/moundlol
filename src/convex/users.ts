import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to generate session token
function generateSessionToken() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export const getDiscordClientId = query({
  args: {},
  handler: async () => {
    return process.env.DISCORD_CLIENT_ID;
  },
});

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
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    profilePicture: v.optional(v.string()),
    backgroundType: v.optional(v.string()),
    backgroundValue: v.optional(v.string()),
    buttonStyle: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    audioAutoPlay: v.optional(v.boolean()),
    theme: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .unique();

    if (!user) throw new Error("Unauthorized");

    await ctx.db.patch(user._id, {
      title: args.title,
      bio: args.bio,
      profilePicture: args.profilePicture,
      backgroundType: args.backgroundType,
      backgroundValue: args.backgroundValue,
      buttonStyle: args.buttonStyle,
      audioUrl: args.audioUrl,
      audioAutoPlay: args.audioAutoPlay,
      theme: args.theme,
    });
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

export const loginWithDiscord = mutation({
  args: {
    discordId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_discord_id", (q) => q.eq("discordId", args.discordId))
      .unique();

    if (!user) {
      throw new Error("No account linked to this Discord user");
    }

    return { sessionToken: user.sessionToken };
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

export const linkDiscordAccount = mutation({
  args: {
    sessionToken: v.string(),
    discordId: v.string(),
    discordUsername: v.string(),
    discordAvatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
      .unique();

    if (!user) throw new Error("Unauthorized");

    // Check if discord ID is already used by another user
    const existing = await ctx.db
        .query("users")
        .withIndex("by_discord_id", (q) => q.eq("discordId", args.discordId))
        .unique();
    
    if (existing && existing._id !== user._id) {
        throw new Error("This Discord account is already linked to another user.");
    }

    await ctx.db.patch(user._id, {
      discordId: args.discordId,
      discordUsername: args.discordUsername,
      discordAvatar: args.discordAvatar,
      showDiscordPresence: true, // Default to true
    });

    return { success: true };
  },
});

export const unlinkDiscordAccount = mutation({
    args: { sessionToken: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_session", (q) => q.eq("sessionToken", args.sessionToken))
            .unique();

        if (!user) throw new Error("Unauthorized");

        await ctx.db.patch(user._id, {
            discordId: undefined,
            discordUsername: undefined,
            discordAvatar: undefined,
            showDiscordPresence: undefined,
        });
    }
});