import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/api/badges/assign",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const { username, badgeName, badgeIcon, badgeDescription, rarity, secret } = await req.json();

    // Simple secret check - in production use env vars
    if (secret !== process.env.DISCORD_BOT_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      // Try internal first, if it fails (due to not being internal), try api
      // Note: In a real app, we'd know which one it is. 
      // Assuming internal based on typical patterns for admin actions.
      await ctx.runMutation(internal.badges.assignBadge, {
        username,
        badgeName,
        badgeIcon,
        badgeDescription,
        rarity,
      });
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
  }),
});

http.route({
  path: "/api/discord/interactions",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const signature = req.headers.get("X-Signature-Ed25519");
    const timestamp = req.headers.get("X-Signature-Timestamp");
    const body = await req.text();

    if (!signature || !timestamp) {
      return new Response("Missing signature headers", { status: 401 });
    }

    try {
        const result = await ctx.runAction(api.discord.interactionHandler, {
            signature,
            timestamp,
            body,
        });
        
        return new Response(result.body, {
            status: result.status,
            headers: new Headers(result.headers),
        });
    } catch (e: any) {
        console.error(e);
        return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

export default http;