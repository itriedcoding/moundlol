"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";
import { cleanEnv } from "./utils";

export const callback = action({
    args: { code: v.string(), redirectUri: v.string() },
    handler: async (ctx, args) => {
        const clientId = cleanEnv(process.env.DISCORD_CLIENT_ID);
        const clientSecret = cleanEnv(process.env.DISCORD_CLIENT_SECRET);

        if (!clientId || !clientSecret) {
            throw new Error("Configuration Error: Missing DISCORD_CLIENT_ID or DISCORD_CLIENT_SECRET in Convex Dashboard.");
        }

        console.log(`[Discord Auth] Exchanging code...`);

        // Exchange code for token
        // Use Basic Auth for better compatibility and to avoid body parsing issues
        const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
        const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { 
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${credentials}`
            },
            body: new URLSearchParams({
                grant_type: "authorization_code",
                code: args.code,
                redirect_uri: args.redirectUri,
            }),
        });

        if (!tokenResponse.ok) {
            const text = await tokenResponse.text();
            console.error("Discord OAuth Error Response:", text);
            
            let errorMessage = `Failed to exchange code: ${text}`;
            try {
                const errorData = JSON.parse(text);
                if (errorData.error === 'invalid_client') {
                    errorMessage = `Configuration Error: Discord rejected the Client Credentials.\n\n` +
                        `Please check your DISCORD_CLIENT_ID and DISCORD_CLIENT_SECRET in the Convex Dashboard.\n` +
                        `Ensure they match exactly what is in the Discord Developer Portal.`;
                } else if (errorData.error === 'invalid_grant') {
                    errorMessage = "Authorization Error: The code is invalid or expired. Please try logging in again.";
                } else if (errorData.error === 'redirect_uri_mismatch') {
                    errorMessage = `Configuration Error: Redirect URI mismatch.\n` +
                        `Expected: ${args.redirectUri}\n` +
                        `Action: Add this EXACT URL to 'Redirects' in Discord Dev Portal > OAuth2.`;
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

        return {
            discordId: userData.id,
            username: userData.username,
            global_name: userData.global_name,
            avatar: userData.avatar 
                ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                : null,
            banner: userData.banner
                ? `https://cdn.discordapp.com/banners/${userData.id}/${userData.banner}.png?size=600`
                : null,
            accent_color: userData.accent_color,
            discriminator: userData.discriminator,
            public_flags: userData.public_flags,
            premium_type: userData.premium_type,
            avatar_decoration: userData.avatar_decoration_data 
                ? `https://cdn.discordapp.com/avatar-decoration-presets/${userData.avatar_decoration_data.asset}.png`
                : null,
        };
    }
});