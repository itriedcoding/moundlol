import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
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

const PLATFORM_ICON_COLORS: Record<string, string> = {
  tiktok: "#000000",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  youtube: "#FF0000",
  twitch: "#9146FF",
  onlyfans: "#00AFF0",
  whatsapp: "#25D366",
  telegram: "#0088cc",
  discord: "#5865F2",
  spotify: "#1DB954",
  soundcloud: "#ff8800",
  patreon: "#FF424D",
  kofi: "#FF5E5B",
  buymeacoffee: "#FFDD00",
  linkedin: "#0077b5",
  facebook: "#1877F2",
  snapchat: "#FFFC00",
  reddit: "#FF4500",
  github: "#333333",
  pinterest: "#E60023",
  medium: "#000000",
  substack: "#FF6719",
  vimeo: "#1ab7ea",
  tumblr: "#35465c",
  paypal: "#00457C",
  cashapp: "#00C244",
  venmo: "#008CFF",
  website: "#ff1493",
  email: "#ff1493",
  custom: "#ff1493",
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

interface ProfileLinksProps {
  links: any[];
  user: any;
  onLinkClick: (linkId: string, url: string) => void;
}

export function ProfileLinks({ links, user, onLinkClick }: ProfileLinksProps) {
  const getButtonStyle = (platform: string) => {
    const base = "w-full p-4 flex items-center justify-between transition-all duration-300 group relative overflow-hidden";
    const shape = user.buttonStyle === "square" ? "rounded-none" : 
                 user.buttonStyle === "pill" ? "rounded-full" : 
                 "rounded-2xl"; // Default rounded
    
    const gradientClass = PLATFORM_COLORS[platform] || PLATFORM_COLORS.custom;
    
    // For styles where we want the colored icon
    if (user.buttonStyle === "neumorphic") {
      return {
        className: `${base} ${shape} bg-background shadow-[5px_5px_10px_#0a0a0a,-5px_-5px_10px_#262626] hover:shadow-[inset_5px_5px_10px_#0a0a0a,inset_-5px_-5px_10px_#262626] text-foreground border border-white/5`,
        iconColor: PLATFORM_ICON_COLORS[platform] || "#ffffff"
      };
    }
    
    if (user.buttonStyle === "glass") {
      return {
        className: `${base} ${shape} bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white`,
        iconColor: PLATFORM_ICON_COLORS[platform] || "#ffffff"
      };
    }

    // Default gradient style - keep icon white for contrast
    return {
        className: `${base} ${shape} bg-gradient-to-r ${gradientClass} text-white shadow-lg hover:shadow-xl hover:-translate-y-1`,
        iconColor: "#ffffff"
    };
  };

  return (
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
        const style = getButtonStyle(link.platform);

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
            onClick={() => onLinkClick(link._id, link.url)}
            className={style.className}
          >
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />

            <div className="flex items-center gap-4 relative z-10">
              <div className="text-2xl" style={{ color: style.iconColor }}>
                <Icon />
              </div>
              <span className="text-left font-semibold">{link.title}</span>
            </div>
            <ExternalLink className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity relative z-10" />
          </motion.button>
        );
      })}
    </motion.div>
  );
}
