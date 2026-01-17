import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ExternalLink, ArrowLeft, Check, Sparkles, BadgeCheck, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { 
  FaTiktok, FaInstagram, FaTwitter, FaYoutube, FaTwitch,
  FaWhatsapp, FaTelegram, FaDiscord, FaSpotify, FaLinkedin,
  FaFacebook, FaSnapchat, FaReddit, FaGithub, FaPatreon,
  FaPinterest, FaTumblr, FaVimeo, FaMedium, FaPaypal
} from "react-icons/fa";
import { 
  SiOnlyfans, SiSoundcloud, SiCashapp, SiVenmo, SiKofi,
  SiBuymeacoffee, SiSubstack, SiX
} from "react-icons/si";
import { Globe, Mail, Link as LinkIcon } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import { setSessionToken } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PLATFORM_COLORS: Record<string, string> = {
  tiktok: "from-[#000000] to-[#00f2ea]",
  instagram: "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]",
  twitter: "from-[#1DA1F2] to-[#1a8cd8]",
  youtube: "from-[#FF0000] to-[#cc0000]",
  twitch: "from-[#9146FF] to-[#772ce8]",
  onlyfans: "from-[#00AFF0] to-[#0088cc]",
  fansly: "from-[#2BDEAC] to-[#1fb589]",
  whatsapp: "from-[#25D366] to-[#1da851]",
  telegram: "from-[#0088cc] to-[#006699]",
  discord: "from-[#5865F2] to-[#4752c4]",
  spotify: "from-[#1DB954] to-[#17a345]",
  soundcloud: "from-[#ff8800] to-[#ff5500]",
  patreon: "from-[#FF424D] to-[#cc353d]",
  kofi: "from-[#FF5E5B] to-[#e04845]",
  buymeacoffee: "from-[#FFDD00] to-[#e6c700]",
  linkedin: "from-[#0077b5] to-[#005885]",
  facebook: "from-[#1877F2] to-[#0d5dbf]",
  snapchat: "from-[#FFFC00] to-[#ccca00]",
  reddit: "from-[#FF4500] to-[#cc3700]",
  github: "from-[#333333] to-[#1a1a1a]",
  pinterest: "from-[#E60023] to-[#bd001c]",
  medium: "from-[#000000] to-[#1a1a1a]",
  substack: "from-[#FF6719] to-[#e65505]",
  vimeo: "from-[#1ab7ea] to-[#1596c9]",
  tumblr: "from-[#35465c] to-[#2a3849]",
  paypal: "from-[#00457C] to-[#003366]",
  cashapp: "from-[#00C244] to-[#00a038]",
  venmo: "from-[#008CFF] to-[#0073d1]",
  website: "from-primary to-primary/80",
  email: "from-primary to-primary/80",
  custom: "from-primary to-primary/80",
};

const PLATFORM_ICONS: Record<string, any> = {
  tiktok: FaTiktok,
  instagram: FaInstagram,
  twitter: SiX,
  youtube: FaYoutube,
  twitch: FaTwitch,
  onlyfans: SiOnlyfans,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
  discord: FaDiscord,
  spotify: FaSpotify,
  soundcloud: SiSoundcloud,
  patreon: FaPatreon,
  kofi: SiKofi,
  buymeacoffee: SiBuymeacoffee,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  snapchat: FaSnapchat,
  reddit: FaReddit,
  github: FaGithub,
  pinterest: FaPinterest,
  medium: FaMedium,
  substack: SiSubstack,
  vimeo: FaVimeo,
  tumblr: FaTumblr,
  paypal: FaPaypal,
  cashapp: SiCashapp,
  venmo: SiVenmo,
  website: Globe,
  email: Mail,
  custom: LinkIcon,
};

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
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

  const handleClaimUsername = async () => {
    if (!username) return;

    setIsClaiming(true);
    try {
      const result = await claimUsername({
        username: username.toLowerCase().trim(),
        email: email || undefined,
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
            <div className="text-left">
              <Label htmlFor="email" className="text-sm text-muted-foreground mb-2 block">
                Email (optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="bg-background/50 border-primary/30 focus:border-primary"
              />
            </div>

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

  const getButtonStyle = (platform: string) => {
    const base = "w-full p-4 flex items-center justify-between transition-all duration-300 group relative overflow-hidden";
    const shape = user.buttonStyle === "square" ? "rounded-none" : 
                 user.buttonStyle === "pill" ? "rounded-full" : 
                 "rounded-2xl"; // Default rounded
    
    const gradientClass = PLATFORM_COLORS[platform] || PLATFORM_COLORS.custom;
    
    if (user.buttonStyle === "neumorphic") {
      return `${base} ${shape} bg-background shadow-[5px_5px_10px_#0a0a0a,-5px_-5px_10px_#262626] hover:shadow-[inset_5px_5px_10px_#0a0a0a,inset_-5px_-5px_10px_#262626] text-foreground border border-white/5`;
    }
    
    if (user.buttonStyle === "glass") {
      return `${base} ${shape} bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white`;
    }

    return `${base} ${shape} bg-gradient-to-r ${gradientClass} text-white shadow-lg hover:shadow-xl hover:-translate-y-1`;
  };

  return (
    <div 
      className="min-h-screen bg-background relative overflow-x-hidden transition-colors duration-500"
      style={getBackgroundStyle()}
    >
      {/* Overlay for readability if image background */}
      {user.backgroundType === "image" && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      )}

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
              className="w-32 h-32 mx-auto mb-6 rounded-full p-1 bg-gradient-to-br from-primary to-primary/50 glow-pink-lg relative"
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-background">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted text-5xl font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              {user.verified && (
                <div className="absolute bottom-0 right-0 bg-background rounded-full p-1 text-primary shadow-lg">
                  <BadgeCheck className="w-6 h-6 fill-primary text-background" />
                </div>
              )}
            </motion.div>

            {/* Username & Badges */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <h1 className="text-3xl font-bold flex items-center gap-2 text-white drop-shadow-md">
                {user.title || `@${user.username}`}
              </h1>
              
              {/* Badges */}
              {badges && badges.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {badges.map((badge) => (
                    <div 
                      key={badge._id} 
                      className="group relative"
                      title={badge.name}
                    >
                      <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-lg cursor-help transition-transform hover:scale-110">
                        {badge.icon.startsWith("http") ? (
                          <img src={badge.icon} alt={badge.name} className="w-5 h-5 object-contain" />
                        ) : (
                          <span>{badge.icon}</span>
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                        <p className="font-bold">{badge.name}</p>
                        <p className="text-gray-300">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {user.title && (
                <p className="text-white/80 font-medium drop-shadow-sm">@{user.username}</p>
              )}
            </motion.div>

            {/* Bio */}
            {user.bio && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 max-w-md mx-auto mt-4 font-medium drop-shadow-sm"
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
              <div className="text-center py-12 text-white/60 bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
                <p>No links added yet</p>
              </div>
            )}

            {links?.map((link, index) => {
              const Icon = PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.custom;

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
                  className={getButtonStyle(link.platform)}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

                  <div className="flex items-center gap-4 relative z-10">
                    <div className="text-2xl">
                      <Icon />
                    </div>
                    <span className="text-left font-semibold">{link.title}</span>
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
  );
}