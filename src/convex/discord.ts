"use node";
import { action, internalAction, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions";
import { api, internal } from "./_generated/api";

// Environment variables should be set in the dashboard
// DISCORD_PUBLIC_KEY, DISCORD_CLIENT_ID, DISCORD_BOT_TOKEN, DISCORD_CLIENT_SECRET

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

    // Handle Ping
    if (interaction.type === InteractionType.PING) {
      return {
        status: 200,
        body: JSON.stringify({ type: InteractionResponseType.PONG }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Handle Slash Commands
    if (interaction.type === InteractionType.APPLICATION_COMMAND) {
      const { name, options } = interaction.data;

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
           const stats: any = await ctx.runQuery(api.status.get);
           
           return {
            status: 200,
            body: JSON.stringify({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                embeds: [
                    {
                        title: "BioLink Hub Status",
                        color: 0xff1493, // Hot Pink
                        fields: [
                            { name: "Status", value: "🟢 Operational", inline: true },
                            { name: "Users", value: stats?.stats?.users?.toString() || "0", inline: true },
                            { name: "Links", value: stats?.stats?.links?.toString() || "0", inline: true },
                        ],
                        timestamp: new Date().toISOString(),
                        footer: { text: "mound.lol System Status" }
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

      if (name === "assignbadge") {
        // Options: user (string username), badge (string name), icon (string url), description (string)
        const usernameOption = options?.find((o: any) => o.name === "username");
        const badgeOption = options?.find((o: any) => o.name === "badge");
        const iconOption = options?.find((o: any) => o.name === "icon");
        const descOption = options?.find((o: any) => o.name === "description");

        if (!usernameOption || !badgeOption || !iconOption) {
             return {
                status: 200,
                body: JSON.stringify({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: "Missing required options: username, badge, icon" },
                }),
                headers: { "Content-Type": "application/json" },
            };
        }

        try {
            await ctx.runMutation(internal.badges.assignBadge, {
                username: usernameOption.value,
                badgeName: badgeOption.value,
                badgeIcon: iconOption.value,
                badgeDescription: descOption?.value || "Awarded via Discord",
                rarity: "common"
            });

            return {
                status: 200,
                body: JSON.stringify({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: `✅ Badge **${badgeOption.value}** assigned to **${usernameOption.value}**!` },
                }),
                headers: { "Content-Type": "application/json" },
            };
        } catch (e: any) {
             return {
                status: 200,
                body: JSON.stringify({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: `Error assigning badge: ${e.message}` },
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
    const clientId = process.env.DISCORD_CLIENT_ID || "1458362723959181435";

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

// OAuth Handler
export const discordAuth = action({
    args: { code: v.string(), redirectUri: v.string() },
    handler: async (ctx, args) => {
        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;

        if (!clientId || !clientSecret) throw new Error("Missing Discord OAuth credentials in environment variables");

        // Exchange code for token
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: "authorization_code",
                code: args.code,
                redirect_uri: args.redirectUri,
            }),
        });

        if (!tokenResponse.ok) {
            const text = await tokenResponse.text();
            console.error("Discord OAuth Error:", text);
            
            let errorMessage = `Failed to exchange code: ${text}`;
            try {
                const errorData = JSON.parse(text);
                if (errorData.error === 'invalid_client') {
                    errorMessage = "Configuration Error: Invalid Discord Client ID or Client Secret. Please update your Environment Variables in the Integrations or API Keys tab.";
                } else if (errorData.error === 'invalid_grant') {
                    errorMessage = "Authorization Error: Invalid or expired code. Please try again.";
                } else if (errorData.error === 'redirect_uri_mismatch') {
                    errorMessage = `Configuration Error: Redirect URI mismatch. Ensure '${args.redirectUri}' is added to your Discord Developer Portal.`;
                }
            } catch (e) {
                // ignore
            }
            throw new Error(errorMessage);
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Get User Info
        const userResponse = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userResponse.ok) throw new Error("Failed to fetch user info");

        const userData = await userResponse.json();

        // Save/Update user in DB
        // We need to link this to the current session or create a new one
        // For now, we'll return the discord data and let the client handle the linking via a mutation
        // Or better, we call an internal mutation here to link it if we pass the session token
        
        return {
            discordId: userData.id,
            username: userData.username,
            avatar: userData.avatar 
                ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                : null,
            discriminator: userData.discriminator
        };
    }
});