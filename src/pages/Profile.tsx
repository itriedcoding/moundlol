import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Check, Sparkles, Play, Pause, Volume2, VolumeX, ArrowLeft, Eye, ShieldAlert, Mail } from "lucide-react";
import { toast } from "sonner";
import { setSessionToken } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileLinks } from "@/components/profile/ProfileLinks";
import { Helmet } from "react-helmet";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showSensitiveWarning, setShowSensitiveWarning] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const user = useQuery(api.users.getUserByUsername, {
    username: username || "",
  });
  const links = useQuery(api.links.getLinks, { username: username || "" });
  const badges = useQuery(api.badges.getUserBadges, user ? { userId: user._id } : "skip");
  
  const claimUsername = useMutation(api.users.claimUsername);
  const incrementView = useMutation(api.users.incrementViewCount);
  const incrementClick = useMutation(api.links.incrementClickCount);
  const trackView = useMutation(api.analytics.trackProfileView);
  const subscribe = useMutation(api.analytics.addEmailSubscriber);

  const handleClaimUsername = async () => {
    if (!username) return;

    setIsClaiming(true);
    try {
      const result = await claimUsername({
        username: username.toLowerCase().trim(),
      });

      setSessionToken(result.sessionToken);
      toast.success(`🎉 Username claimed! Welcome @${username}`);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || "Failed to claim username");
      setIsClaiming(false);
    }
  };

  useEffect(() => {
    if (user && username) {
      incrementView({ username });
      trackView({ username });
      if (user.sensitiveContent) {
        setShowSensitiveWarning(true);
      }
    }
  }, [user, username]);

  useEffect(() => {
    if (user?.audioUrl && audioRef.current) {
      audioRef.current.volume = 0.5;
      if (user.audioAutoPlay) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          // Autoplay blocked
          setIsPlaying(false);
        });
      }
    }
  }, [user?.audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username) return;
    
    setIsSubscribing(true);
    try {
      await subscribe({ username, email, source: "profile_page" });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubscribing(false);
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden p-4">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-primary/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.15),transparent_50%)]" />

        {/* Floating blobs */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center max-w-md w-full bg-card border border-primary/30 rounded-3xl p-8 glow-pink"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center glow-pink-lg"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient-pink">@{username}</span> is available!
          </h1>
          <p className="text-muted-foreground mb-6">
            Claim this username and create your bio link page in seconds.
          </p>

          <div className="space-y-4 mb-6">
            <Button
              onClick={handleClaimUsername}
              disabled={isClaiming}
              className="w-full bg-primary hover:bg-primary/90 text-white text-lg py-6"
            >
              {isClaiming ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Claiming...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Claim @{username}
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>No credit card</span>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mt-6 text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleLinkClick = async (linkId: string, url: string) => {
    await incrementClick({ linkId: linkId as any });
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Helper to get background style
  const getBackgroundStyle = () => {
    if (!user) return {};
    if (user.backgroundType === "image" && user.backgroundValue) {
      return { backgroundImage: `url(${user.backgroundValue})`, backgroundSize: "cover", backgroundPosition: "center" };
    }
    if (user.backgroundType === "gradient" && user.backgroundValue) {
      return { background: user.backgroundValue };
    }
    if (user.backgroundType === "solid" && user.backgroundValue) {
      return { backgroundColor: user.backgroundValue };
    }
    return {}; // Default handled by CSS
  };

  // Animation effects
  const renderAnimation = () => {
    if (user.animationEffect === "snow") {
      return (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full opacity-70"
              initial={{ y: -10, x: Math.random() * window.innerWidth }}
              animate={{ y: window.innerHeight + 10 }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
              style={{
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                left: Math.random() * 100 + "%"
              }}
            />
          ))}
        </div>
      );
    }
    if (user.animationEffect === "rain") {
      return (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-400/50 w-[1px] h-4"
              initial={{ y: -20, x: Math.random() * window.innerWidth }}
              animate={{ y: window.innerHeight + 20 }}
              transition={{
                duration: Math.random() * 1 + 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "linear"
              }}
              style={{ left: Math.random() * 100 + "%" }}
            />
          ))}
        </div>
      );
    }
    if (user.animationEffect === "sparkles") {
        return (
            <div className="fixed inset-0 pointer-events-none z-0">
                {[...Array(30)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ 
                            opacity: [0, 1, 0], 
                            scale: [0, 1, 0],
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    >
                        <Sparkles className="w-4 h-4 text-yellow-200" />
                    </motion.div>
                ))}
            </div>
        );
    }
    return null;
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
      <AnimatePresence>
        {showSensitiveWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          >
            <div className="max-w-md w-full bg-card border border-red-500/30 rounded-3xl p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
                <ShieldAlert className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Sensitive Content</h2>
              <p className="text-muted-foreground mb-8">
                This profile may contain content that is not suitable for all audiences.
                Are you over 18 and wish to proceed?
              </p>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate("/")}
                >
                  Go Back
                </Button>
                <Button 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                  onClick={() => setShowSensitiveWarning(false)}
                >
                  I'm 18+
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={`min-h-screen bg-background relative overflow-x-hidden transition-colors duration-500 font-${user.font || 'sans'}`}
        style={getBackgroundStyle()}
      >
        {/* Overlay for readability if image background */}
        {user.backgroundType === "image" && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        )}

        {renderAnimation()}

        {/* Audio Player */}
        {user.audioUrl && (
          <div className="fixed bottom-6 right-6 z-50 flex gap-2">
            <audio ref={audioRef} src={user.audioUrl} loop />
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full w-12 h-12 shadow-lg bg-background/80 backdrop-blur-md border border-white/10"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full w-12 h-12 shadow-lg bg-background/80 backdrop-blur-md border border-white/10"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        )}

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
            {user.newsletterActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl text-center"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{user.newsletterHeading}</h3>
                <p className="text-white/60 mb-6">{user.newsletterDescription}</p>
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    required
                  />
                  <Button type="submit" disabled={isSubscribing}>
                    {isSubscribing ? "..." : "Join"}
                  </Button>
                </form>
              </motion.div>
            )}

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