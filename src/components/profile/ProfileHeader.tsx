import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ProfileHeaderProps {
  user: any;
  badges: any[];
}

// Discord Badge Flags (Updated for 2026 Standards)
const DISCORD_FLAGS = {
  STAFF: 1 << 0,
  PARTNER: 1 << 1,
  HYPESQUAD: 1 << 2,
  BUG_HUNTER_LEVEL_1: 1 << 3,
  HYPESQUAD_ONLINE_HOUSE_1: 1 << 6, // Bravery
  HYPESQUAD_ONLINE_HOUSE_2: 1 << 7, // Brilliance
  HYPESQUAD_ONLINE_HOUSE_3: 1 << 8, // Balance
  PREMIUM_EARLY_SUPPORTER: 1 << 9,
  TEAM_PSEUDO_USER: 1 << 10,
  BUG_HUNTER_LEVEL_2: 1 << 14,
  VERIFIED_BOT: 1 << 16,
  VERIFIED_DEVELOPER: 1 << 17,
  CERTIFIED_MODERATOR: 1 << 18,
  BOT_HTTP_INTERACTIONS: 1 << 19,
  ACTIVE_DEVELOPER: 1 << 22,
};

const getDiscordBadges = (flags: number, premiumType?: number) => {
  const badges = [];
  
  // Standard Flags
  if (flags & DISCORD_FLAGS.STAFF) badges.push({ name: "Discord Staff", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/discordstaff.svg" });
  if (flags & DISCORD_FLAGS.PARTNER) badges.push({ name: "Partnered Server Owner", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/discordpartner.svg" });
  if (flags & DISCORD_FLAGS.CERTIFIED_MODERATOR) badges.push({ name: "Moderator Programs Alumni", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/discordcertifiedmoderator.svg" });
  if (flags & DISCORD_FLAGS.HYPESQUAD) badges.push({ name: "HypeSquad Events", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/hypesquad.svg" });
  if (flags & DISCORD_FLAGS.HYPESQUAD_ONLINE_HOUSE_1) badges.push({ name: "HypeSquad Bravery", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/hypesquadbravery.svg" });
  if (flags & DISCORD_FLAGS.HYPESQUAD_ONLINE_HOUSE_2) badges.push({ name: "HypeSquad Brilliance", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/hypesquadbrilliance.svg" });
  if (flags & DISCORD_FLAGS.HYPESQUAD_ONLINE_HOUSE_3) badges.push({ name: "HypeSquad Balance", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/hypesquadbalance.svg" });
  if (flags & DISCORD_FLAGS.BUG_HUNTER_LEVEL_1) badges.push({ name: "Bug Hunter Level 1", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/bughunter1.svg" });
  if (flags & DISCORD_FLAGS.BUG_HUNTER_LEVEL_2) badges.push({ name: "Bug Hunter Level 2", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/bughunter2.svg" });
  if (flags & DISCORD_FLAGS.ACTIVE_DEVELOPER) badges.push({ name: "Active Developer", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/activedeveloper.svg" });
  if (flags & DISCORD_FLAGS.VERIFIED_DEVELOPER) badges.push({ name: "Early Verified Bot Developer", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/earlyverifiedbotdeveloper.svg" });
  if (flags & DISCORD_FLAGS.PREMIUM_EARLY_SUPPORTER) badges.push({ name: "Early Supporter", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/earlysupporter.svg" });

  // Nitro Badges (Derived from premium_type)
  if (premiumType === 1) {
    badges.push({ name: "Nitro Classic", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/nitro.svg" });
  } else if (premiumType === 2) {
    badges.push({ name: "Nitro", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/nitro.svg" });
  } else if (premiumType === 3) {
    badges.push({ name: "Nitro Basic", icon: "https://raw.githubusercontent.com/mezotv/discord-badges/master/assets/nitro.svg" });
  }
  
  return badges;
};

export function ProfileHeader({ user, badges }: ProfileHeaderProps) {
  const discordBadges = user.discordPublicFlags || user.discordPremiumType 
    ? getDiscordBadges(user.discordPublicFlags || 0, user.discordPremiumType) 
    : [];

  return (
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
        <div className="w-full h-full rounded-full overflow-hidden bg-background relative">
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
        
        {/* Discord Profile Card */}
        {user.showDiscordPresence && user.discordUsername && (
            <div className="mt-4 w-full max-w-[340px] mx-auto perspective-1000">
                <div 
                    className="rounded-xl overflow-hidden bg-[#111214] border border-[#1e1f22] shadow-2xl transform transition-transform hover:scale-[1.02]"
                >
                    {/* Banner */}
                    <div 
                        className="h-[120px] w-full bg-[#5865F2] relative"
                        style={{ 
                            backgroundColor: user.discordAccentColor || '#5865F2',
                            backgroundImage: user.discordBanner ? `url(${user.discordBanner})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    />
                    
                    <div className="px-5 pb-5 relative">
                        {/* Avatar & Decoration */}
                        <div className="absolute -top-[40px] left-5">
                            <div className="relative">
                                <div className="w-[80px] h-[80px] rounded-full border-[6px] border-[#111214] bg-[#111214] relative z-10">
                                    {user.discordAvatar ? (
                                        <img src={user.discordAvatar} alt="Discord" className="w-full h-full rounded-full" />
                                    ) : (
                                        <div className="w-full h-full rounded-full bg-[#5865F2] flex items-center justify-center">
                                            <FaDiscord className="text-white w-10 h-10" />
                                        </div>
                                    )}
                                </div>
                                {/* Avatar Decoration */}
                                {user.discordAvatarDecoration && (
                                    <img 
                                        src={user.discordAvatarDecoration} 
                                        alt="Decoration" 
                                        className="absolute -top-[8px] -left-[8px] w-[96px] h-[96px] z-20 pointer-events-none"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Discord Badges */}
                        {discordBadges.length > 0 && (
                            <div className="absolute top-3 right-3 flex gap-1 bg-[#111214]/80 p-1 rounded-lg backdrop-blur-sm border border-white/5">
                                {discordBadges.map((badge, i) => (
                                    <TooltipProvider key={i}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <img src={badge.icon} alt={badge.name} className="w-5 h-5" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{badge.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ))}
                            </div>
                        )}

                        {/* Info */}
                        <div className="pt-[48px] text-left">
                            <div className="flex items-center gap-1.5 mb-1">
                                <h3 className="text-white font-bold text-xl leading-tight">
                                    {user.discordGlobalName || user.discordUsername}
                                </h3>
                                {user.discordDiscriminator && user.discordDiscriminator !== "0" && (
                                     <span className="text-[#949BA4] text-lg">#{user.discordDiscriminator}</span>
                                )}
                            </div>
                            <p className="text-[#949BA4] text-sm font-medium">
                                {user.discordUsername}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Site Badges */}
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
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
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-white/10">
                  <p className="font-bold text-primary">{badge.name}</p>
                  <p className="text-gray-300">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {user.title && (
          <p className="text-white/80 font-medium drop-shadow-sm mt-2">@{user.username}</p>
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
  );
}