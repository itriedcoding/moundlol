import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    profilePicture: v.optional(v.string()),
    bio: v.optional(v.string()),
    title: v.optional(v.string()),
    theme: v.optional(v.string()),
    customColors: v.optional(
      v.object({
        background: v.string(),
        text: v.string(),
        accent: v.string(),
      })
    ),
    isPublished: v.boolean(),
    viewCount: v.number(),
    sessionToken: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()),
    customDomain: v.optional(v.string()),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    customCss: v.optional(v.string()),
    backgroundType: v.optional(v.string()),
    backgroundValue: v.optional(v.string()),
    buttonStyle: v.optional(v.string()),
    font: v.optional(v.string()),
    showSocialProof: v.optional(v.boolean()),
    verified: v.optional(v.boolean()),
    audioUrl: v.optional(v.string()),
    audioAutoPlay: v.optional(v.boolean()),
    // Discord Integration
    discordId: v.optional(v.string()),
    discordUsername: v.optional(v.string()),
    discordGlobalName: v.optional(v.string()),
    discordAvatar: v.optional(v.string()),
    discordBanner: v.optional(v.string()),
    discordBannerColor: v.optional(v.string()),
    discordAccentColor: v.optional(v.string()),
    discordPublicFlags: v.optional(v.number()),
    discordPremiumType: v.optional(v.number()), // 0: None, 1: Nitro Classic, 2: Nitro, 3: Nitro Basic
    discordAvatarDecoration: v.optional(v.string()), // URL to decoration
    discordGuildId: v.optional(v.string()), // For real-time status via Widget
    showDiscordPresence: v.optional(v.boolean()),
    email: v.optional(v.string()),
    // New Features
    sensitiveContent: v.optional(v.boolean()),
    animationEffect: v.optional(v.string()), // "none", "snow", "rain", "sparkles", "stars"
    newsletterActive: v.optional(v.boolean()),
    newsletterHeading: v.optional(v.string()),
    newsletterDescription: v.optional(v.string()),
  })
    .index("by_username", ["username"])
    .index("by_session", ["sessionToken"])
    .index("by_domain", ["customDomain"])
    .index("by_discord_id", ["discordId"]),

  links: defineTable({
    userId: v.id("users"),
    platform: v.string(),
    title: v.string(),
    url: v.string(),
    icon: v.optional(v.string()),
    isVisible: v.boolean(),
    order: v.number(),
    clickCount: v.number(),
    customIcon: v.optional(v.string()),
    scheduledStart: v.optional(v.number()),
    scheduledEnd: v.optional(v.number()),
    thumbnail: v.optional(v.string()),
    isPriority: v.optional(v.boolean()),
    expiresAt: v.optional(v.number()),
    category: v.optional(v.string()),
    followerCount: v.optional(v.string()),
    animation: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_order", ["userId", "order"])
    .index("by_user_and_category", ["userId", "category"]),

  badges: defineTable({
    name: v.string(),
    icon: v.string(), // URL or icon name
    description: v.string(),
    rarity: v.optional(v.string()), // "common", "rare", "epic", "legendary"
  }).index("by_name", ["name"]),

  userBadges: defineTable({
    userId: v.id("users"),
    badgeId: v.id("badges"),
    assignedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_badge", ["badgeId"])
    .index("by_user_and_badge", ["userId", "badgeId"]),

  analytics: defineTable({
    userId: v.id("users"),
    linkId: v.optional(v.id("links")),
    type: v.string(), // "profile_view" or "link_click"
    timestamp: v.number(),
    referrer: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_timestamp", ["userId", "timestamp"])
    .index("by_link", ["linkId"]),

  themes: defineTable({
    userId: v.id("users"),
    name: v.string(),
    background: v.string(),
    text: v.string(),
    accent: v.string(),
    buttonStyle: v.string(),
    font: v.optional(v.string()),
    isActive: v.boolean(),
  }).index("by_user_and_active", ["userId", "isActive"]),

  emailSubscribers: defineTable({
    userId: v.id("users"),
    email: v.string(),
    subscribedAt: v.number(),
    source: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"]),
});