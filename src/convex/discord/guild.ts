"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";

export const getWidget = action({
  args: { guildId: v.string() },
  handler: async (ctx, args) => {
    if (!args.guildId) return null;

    try {
      const response = await fetch(`https://discord.com/api/guilds/${args.guildId}/widget.json`);
      if (!response.ok) {
        console.error(`Failed to fetch widget for guild ${args.guildId}: ${response.statusText}`);
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching guild widget:", error);
      return null;
    }
  },
});

export const getMember = action({
  args: { guildId: v.string(), userId: v.string() },
  handler: async (ctx, args) => {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
        console.error("Missing DISCORD_BOT_TOKEN");
        return null;
    }

    try {
      const response = await fetch(`https://discord.com/api/v10/guilds/${args.guildId}/members/${args.userId}`, {
        headers: {
          Authorization: `Bot ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null; // User not in guild
        console.error(`Failed to fetch member: ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching guild member:", error);
      return null;
    }
  },
});
