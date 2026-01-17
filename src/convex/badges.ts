import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// Public query to get a user's badges
export const getUserBadges = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userBadges = await ctx.db
      .query("userBadges")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    const badges = await Promise.all(
      userBadges.map(async (ub) => {
        const badge = await ctx.db.get(ub.badgeId);
        return badge ? { ...badge, assignedAt: ub.assignedAt } : null;
      })
    );

    return badges.filter((b) => b !== null);
  },
});

// Internal mutation to add a badge to a user (called by HTTP action)
export const assignBadge = internalMutation({
  args: {
    username: v.string(),
    badgeName: v.string(),
    badgeIcon: v.string(),
    badgeDescription: v.string(),
    rarity: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .unique();

    if (!user) throw new Error("User not found");

    // Find or create badge
    let badge = await ctx.db
      .query("badges")
      .withIndex("by_name", (q) => q.eq("name", args.badgeName))
      .unique();

    if (!badge) {
      const badgeId = await ctx.db.insert("badges", {
        name: args.badgeName,
        icon: args.badgeIcon,
        description: args.badgeDescription,
        rarity: args.rarity || "common",
      });
      badge = await ctx.db.get(badgeId);
    }

    if (!badge) throw new Error("Failed to create/find badge");

    // Check if user already has badge
    const existing = await ctx.db
      .query("userBadges")
      .withIndex("by_user_and_badge", (q) =>
        q.eq("userId", user._id).eq("badgeId", badge!._id)
      )
      .unique();

    if (!existing) {
      await ctx.db.insert("userBadges", {
        userId: user._id,
        badgeId: badge._id,
        assignedAt: Date.now(),
      });
    }

    return { success: true, badge };
  },
});
