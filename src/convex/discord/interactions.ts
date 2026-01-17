"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";
import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions";
import { api, internal } from "../_generated/api";

export const handler = action({
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

      if (name === "profile") {
        const usernameOption = options?.find((o: any) => o.name === "username");
        if (!usernameOption) {
             return {
                status: 200,
                body: JSON.stringify({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: "Missing required option: username" },
                }),
                headers: { "Content-Type": "application/json" },
            };
        }

        const user = await ctx.runQuery(api.users.getUserByUsername, { username: usernameOption.value });

        if (!user) {
            return {
                status: 200,
                body: JSON.stringify({
                    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                    data: { content: `User **${usernameOption.value}** not found.` },
                }),
                headers: { "Content-Type": "application/json" },
            };
        }

        // Construct profile URL
        const profileUrl = process.env.CONVEX_SITE_URL ? `${process.env.CONVEX_SITE_URL}/${user.username}` : `https://mound.lol/${user.username}`;

        return {
            status: 200,
            body: JSON.stringify({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    embeds: [{
                        title: user.title || `@${user.username}`,
                        url: profileUrl,
                        description: user.bio || "No bio set.",
                        thumbnail: user.profilePicture ? { url: user.profilePicture } : undefined,
                        color: 0x5865F2,
                        fields: [
                            { name: "Views", value: user.viewCount.toString(), inline: true },
                            { name: "Joined", value: new Date(user._creationTime).toLocaleDateString(), inline: true }
                        ],
                        footer: { text: "BioLink Hub Profile" }
                    }]
                },
            }),
            headers: { "Content-Type": "application/json" },
        };
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
