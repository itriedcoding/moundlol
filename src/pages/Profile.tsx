import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Eye } from "lucide-react";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileLinks } from "@/components/profile/ProfileLinks";
import { ProfileClaim } from "@/components/profile/ProfileClaim";
import { ProfileBackground } from "@/components/profile/ProfileBackground";
import { ProfileAudio } from "@/components/profile/ProfileAudio";
import { ProfileSensitive } from "@/components/profile/ProfileSensitive";
import { ProfileNewsletter } from "@/components/profile/ProfileNewsletter";
import { Helmet } from "react-helmet";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const user = useQuery(api.users.getUserByUsername, {
    username: username || "",
  });
  const links = useQuery(api.links.getLinks, { username: username || "" });
  const badges = useQuery(api.badges.getUserBadges, user ? { userId: user._id } : "skip");
  
  const incrementView = useMutation(api.users.incrementViewCount);
  const incrementClick = useMutation(api.links.incrementClickCount);
  const trackView = useMutation(api.analytics.trackProfileView);

  const lastTrackedUser = useRef<string | null>(null);

  useEffect(() => {
    if (user && username && lastTrackedUser.current !== username) {
      lastTrackedUser.current = username;
      incrementView({ username });
      trackView({ username });
    }
  }, [user, username, incrementView, trackView]);

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
    return <ProfileClaim username={username || ""} />;
  }

  const handleLinkClick = async (linkId: string, url: string) => {
    await incrementClick({ linkId: linkId as any });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>{user.seoTitle || `${user.title || user.username} | mound.lol`}</title>
        <meta name="description" content={user.seoDescription || user.bio || `Check out ${user.username}'s links on mound.lol`} />
        {user.customCss && <style>{user.customCss}</style>}
      </Helmet>

      {/* Sensitive Content Warning */}
      <ProfileSensitive sensitiveContent={user.sensitiveContent} />

      <div className={`min-h-screen bg-background relative overflow-x-hidden font-${user.font || 'sans'}`}>
        
        {/* Background & Animations */}
        <ProfileBackground user={user} />

        {/* Audio Player */}
        <ProfileAudio audioUrl={user.audioUrl} autoPlay={user.audioAutoPlay} />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <ProfileHeader user={user} badges={badges || []} />
            
            {/* Social Proof */}
            {user.showSocialProof && (
              <div className="flex justify-center gap-6 mb-8 text-sm text-white/60 font-medium">
                <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/5">
                  <Eye className="w-4 h-4" />
                  {user.viewCount} views
                </div>
              </div>
            )}

            <ProfileLinks links={links || []} user={user} onLinkClick={handleLinkClick} />

            {/* Newsletter */}
            <ProfileNewsletter user={user} username={username || ""} />

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12 pt-8"
            >
              <button
                onClick={() => navigate("/")}
                className="text-white/60 hover:text-white transition-colors text-sm inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-black/40"
              >
                Create your own{" "}
                <span className="text-primary font-bold">
                  mound.lol
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}