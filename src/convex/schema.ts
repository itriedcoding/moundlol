import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    email: v.optional(v.string()),
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
    tokenIdentifier: v.string(),
  })
    .index("by_username", ["username"])
    .index("by_token", ["tokenIdentifier"]),

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
  })
    .index("by_user", ["userId"])
    .index("by_user_and_order", ["userId", "order"]),

  analytics: defineTable({
    userId: v.id("users"),
    linkId: v.optional(v.id("links")),
    type: v.string(), // "profile_view" or "link_click"
    timestamp: v.number(),
    referrer: v.optional(v.string()),
    country: v.optional(v.string()),
    device: v.optional(v.string()),
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
});
