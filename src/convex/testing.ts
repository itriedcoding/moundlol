import { action, internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";

export const testUnlinkFlow = action({
  args: {},
  handler: async (ctx) => {
    console.log("Starting unlink test...");
    
    // 1. Setup
    const { userId, sessionToken } = await ctx.runMutation(internal.testing.setupTestUser);
    console.log("Test user created:", userId);
    
    // 2. Verify setup
    let user = await ctx.runQuery(internal.testing.getUser, { userId });
    if (!user?.discordId) throw new Error("Setup failed: discordId missing");

    // 3. Call unlink
    console.log("Calling unlinkDiscordAccount...");
    await ctx.runMutation(api.users.unlinkDiscordAccount, { sessionToken });

    // 4. Verify unlink
    user = await ctx.runQuery(internal.testing.getUser, { userId });
    
    // Check if fields are undefined or null (removed)
    if (user?.discordId !== undefined) console.error("discordId is:", user?.discordId);
    if (user?.discordUsername !== undefined) console.error("discordUsername is:", user?.discordUsername);
    
    if (user?.discordId) throw new Error("Unlink failed: discordId still present");
    if (user?.discordUsername) throw new Error("Unlink failed: discordUsername still present");
    
    console.log("Unlink test passed!");
    
    // 5. Cleanup
    await ctx.runMutation(internal.testing.cleanupUser, { userId });
    console.log("Test user cleaned up");
    
    return "Success";
  }
});

export const setupTestUser = internalMutation({
  args: {},
  handler: async (ctx) => {
    const sessionToken = "test-" + Math.random().toString(36).substring(7);
    const userId = await ctx.db.insert("users", {
      username: "testuser_" + Date.now(),
      sessionToken,
      isPublished: true,
      viewCount: 0,
      discordId: "123456789",
      discordUsername: "TestUser",
      discordAvatar: "avatar_hash",
      showDiscordPresence: true,
    });
    return { userId, sessionToken };
  }
});

export const getUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  }
});

export const cleanupUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  }
});
