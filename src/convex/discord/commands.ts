"use node";
import { action } from "../_generated/server";

export const register = action({
  args: {},
  handler: async (ctx) => {
    const token = process.env.DISCORD_BOT_TOKEN;
    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!token || !clientId) {
      throw new Error("Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID in environment variables.");
    }

    const commands = [
      {
        name: "ping",
        description: "Check if the bot is alive",
      },
      {
        name: "stats",
        description: "Get current website statistics",
      },
      {
        name: "profile",
        description: "Look up a user profile",
        options: [
            {
                name: "username",
                description: "The username to look up",
                type: 3, // STRING
                required: true
            }
        ]
      },
      {
        name: "assignbadge",
        description: "Assign a badge to a user",
        options: [
            {
                name: "username",
                description: "The username on mound.lol",
                type: 3, // STRING
                required: true
            },
            {
                name: "badge",
                description: "Name of the badge",
                type: 3, // STRING
                required: true
            },
            {
                name: "icon",
                description: "Emoji or URL for the badge icon",
                type: 3, // STRING
                required: true
            },
            {
                name: "description",
                description: "Description of the badge",
                type: 3, // STRING
                required: false
            }
        ]
      }
    ];

    const response = await fetch(
      `https://discord.com/api/v10/applications/${clientId}/commands`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bot ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commands),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to register commands: ${text}`);
    }

    return { success: true, message: "Commands registered successfully" };
  },
});
