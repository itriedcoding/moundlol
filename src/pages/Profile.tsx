import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLATFORM_COLORS: Record<string, string> = {
  tiktok: "from-[#000000] to-[#00f2ea]",
  instagram: "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
  twitter: "from-[#1DA1F2] to-[#1a8cd8]",
  youtube: "from-[#FF0000] to-[#cc0000]",
  twitch: "from-[#9146FF] to-[#772ce8]",
  onlyfans: "from-[#00AFF0] to-[#0088cc]",
  whatsapp: "from-[#25D366] to-[#1da851]",
  telegram: "from-[#0088cc] to-[#006699]",
  discord: "from-[#5865F2] to-[#4752c4]",
  spotify: "from-[#1DB954] to-[#17a345]",
  soundcloud: "from-[#ff8800] to-[#ff5500]",
  patreon: "from-[#FF424D] to-[#cc353d]",
  linkedin: "from-[#0077b5] to-[#005885]",
  facebook: "from-[#1877F2] to-[#0d5dbf]",
  snapchat: "from-[#FFFC00] to-[#ccca00]",
  reddit: "from-[#FF4500] to-[#cc3700]",
  github: "from-[#333333] to-[#1a1a1a]",
  website: "from-primary to-primary/80",
  email: "from-primary to-primary/80",
  custom: "from-primary to-primary/80",
};

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const user = useQuery(api.users.getUserByUsername, {
    username: username || "",
  });
  const links = useQuery(api.links.getLinks, { username: username || "" });
  const incrementView = useMutation(api.users.incrementViewCount);
  const incrementClick = useMutation(api.links.incrementClickCount);
  const trackView = useMutation(api.analytics.trackProfileView);

  useEffect(() => {
    if (user && username) {
      incrementView({ username });
      trackView({ username });
    }
  }, [user, username]);

  if (user === undefined || links === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user || !user.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-3xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This username doesn't exist or the profile is not published yet.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleLinkClick = async (linkId: string, url: string) => {
    await incrementClick({ linkId: linkId as any });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,20,147,0.15),transparent_50%)]" />

      {/* Floating blobs */}
      <motion.div
        className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            {/* Profile Picture */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center glow-pink-lg"
            >
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-5xl font-bold text-white">
                  {user.username[0].toUpperCase()}
                </span>
              )}
            </motion.div>

            {/* Username */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold mb-2">
                {user.title || `@${user.username}`}
              </h1>
              {user.title && (
                <p className="text-muted-foreground mb-2">@{user.username}</p>
              )}
            </motion.div>

            {/* Bio */}
            {user.bio && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-muted-foreground max-w-md mx-auto mt-4"
              >
                {user.bio}
              </motion.p>
            )}
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            {links && links.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No links added yet</p>
              </div>
            )}

            {links?.map((link, index) => {
              const gradientClass =
                PLATFORM_COLORS[link.platform] || PLATFORM_COLORS.custom;

              return (
                <motion.button
                  key={link._id}
                  initial={{ y: 20, opacity: 0, scale: 0.95 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.5 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLinkClick(link._id, link.url)}
                  className={`w-full p-5 rounded-2xl bg-gradient-to-r ${gradientClass} text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between group relative overflow-hidden`}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

                  <div className="flex items-center gap-4 relative z-10">
                    {link.icon && (
                      <span className="text-3xl">{link.icon}</span>
                    )}
                    <span className="text-left">{link.title}</span>
                  </div>
                  <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity relative z-10" />
                </motion.button>
              );
            })}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12 pt-8 border-t border-border"
          >
            <button
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-primary transition-colors text-sm inline-flex items-center gap-2"
            >
              Create your own{" "}
              <span className="text-gradient-pink font-semibold">
                mound.lol
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
