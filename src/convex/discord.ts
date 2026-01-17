"use node";
import { action, internalAction } from "./_generated/server";
import { v } from "convex/values";
import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions";
import { api, internal } from "./_generated/api";

// Environment variables should be set in the dashboard
// DISCORD_PUBLIC_KEY, DISCORD_CLIENT_ID, DISCORD_BOT_TOKEN

export const interactionHandler = action({
  args: {
    signature: v.string(),
    timestamp: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    const publicKey = process.env.DISCORD_PUBLIC_KEY;
    if (!publicKey) {
      return {
        status: 500,
        body: "Missing DISCORD_PUBLIC_KEY",
        headers: { "Content-Type": "text/plain" },
      };
    }

    const isValidRequest = verifyKey(
      args.body,
      args.signature,
      args.timestamp,
      publicKey
    );

    if (!isValidRequest) {
      return {
        status: 401,
        body: "Bad request signature",
        headers: { "Content-Type": "text/plain" },
      };
    }

    const interaction = JSON.parse(args.body);

    // Handle Ping (required for verification)
    if (interaction.type === InteractionType.PING) {
      return {
        status: 200,
        body: JSON.stringify({ type: InteractionResponseType.PONG }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Handle Slash Commands
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      const { name } = interaction.data;

      if (name === "ping") {
        return {
          status: 200,
          body: JSON.stringify({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: "Pong! 🏓 The bot is running 24/7 via Convex functions.",
            },
          }),
          headers: { "Content-Type": "application/json" },
        };
      }

      if (name === "stats") {
        try {
           // Explicitly cast the query result to avoid circular inference issues
           const stats: any = await ctx.runQuery(api.status.get);
           
           return {
            status: 200,
            body: JSON.stringify({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                embeds: [
                    {
                        title: "BioLink Hub Status",
                        color: 0x00ff00,
                        fields: [
                            { name: "Status", value: "🟢 Operational", inline: true },
                            { name: "Users", value: stats?.stats?.users?.toString() || "0", inline: true },
                            { name: "Links", value: stats?.stats?.links?.toString() || "0", inline: true },
                        ],
                        timestamp: new Date().toISOString()
                    }
                ]
              },
            }),
            headers: { "Content-Type": "application/json" },
          };
        } catch (e) {
            return {
            status: 200,
            body: JSON.stringify({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: "Failed to fetch stats. System might be busy.",
              },
            }),
            headers: { "Content-Type": "application/json" },
          };
        }
      }
    }

    return {
      status: 400,
      body: "Unknown command",
      headers: { "Content-Type": "text/plain" },
    };
  },
});

export const registerCommands = internalAction({
  args: {},
  handler: async (ctx) => {
    const token = process.env.DISCORD_BOT_TOKEN;
    const clientId = process.env.DISCORD_CLIENT_ID;

    if (!token || !clientId) {
      throw new Error("Missing DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID");
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