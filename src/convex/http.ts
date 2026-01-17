import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

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

export default http;
