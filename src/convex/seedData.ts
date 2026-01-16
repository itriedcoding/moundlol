import { internalMutation } from "./_generated/server";

export const seedTestData = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Create a test user
    const userId = await ctx.db.insert("users", {
      username: "demo",
      email: "demo@mound.lol",
      title: "Demo User",
      bio: "This is a demo profile showcasing all the features of mound.lol!",
      sessionToken: "test_session_demo_user",
      isPublished: true,
      viewCount: 42,
    });

    // Add some test links
    const links = [
      {
        platform: "tiktok",
        title: "Follow me on TikTok",
        url: "https://tiktok.com/@demo",
        icon: "🎵",
      },
      {
        platform: "instagram",
        title: "Instagram",
        url: "https://instagram.com/demo",
        icon: "📷",
      },
      {
        platform: "youtube",
        title: "YouTube Channel",
        url: "https://youtube.com/@demo",
        icon: "▶️",
      },
      {
        platform: "twitter",
        title: "Twitter/X",
        url: "https://twitter.com/demo",
        icon: "🐦",
      },
      {
        platform: "twitch",
        title: "Twitch Stream",
        url: "https://twitch.tv/demo",
        icon: "🎮",
      },
      {
        platform: "spotify",
        title: "My Spotify",
        url: "https://open.spotify.com/artist/demo",
        icon: "🎵",
      },
      {
        platform: "website",
        title: "Personal Website",
        url: "https://demo.com",
        icon: "🌐",
      },
    ];

    for (let i = 0; i < links.length; i++) {
      await ctx.db.insert("links", {
        userId,
        platform: links[i].platform,
        title: links[i].title,
        url: links[i].url,
        icon: links[i].icon,
        isVisible: true,
        order: i,
        clickCount: Math.floor(Math.random() * 50),
      });
    }

    // Add some analytics data
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    for (let i = 0; i < 30; i++) {
      await ctx.db.insert("analytics", {
        userId,
        type: "profile_view",
        timestamp: now - i * dayInMs,
      });
    }

    return { success: true, message: "Test data seeded successfully!" };
  },
});
