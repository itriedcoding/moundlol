import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { useEffect, useState } from "react";

interface ProfileHeaderProps {
  user: any;
  badges: any[];
}

interface LanyardData {
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: Array<{
    type: number;
    name: string;
    state?: string;
    details?: string;
    application_id?: string;
    assets?: {
      large_image?: string;
      small_image?: string;
    };
  }>;
  discord_user: {
    username: string;
    discriminator: string;
    avatar: string;
    id: string;
  };
}

export function ProfileHeader({ user, badges }: ProfileHeaderProps) {
  const [lanyardData, setLanyardData] = useState<LanyardData | null>(null);

  useEffect(() => {
    if (user?.discordId && user?.showDiscordPresence) {
      const fetchLanyard = async () => {
        try {
          const response = await fetch(`https://api.lanyard.rest/v1/users/${user.discordId}`);
          const data = await response.json();
          if (data.success) {
            setLanyardData(data.data);
          }
        } catch (e) {
          console.error("Failed to fetch Lanyard data", e);
        }
      };

      fetchLanyard();
      const interval = setInterval(fetchLanyard, 30000); // Update every 30s
      return () => clearInterval(interval);
    }
  }, [user?.discordId, user?.showDiscordPresence]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "online": return "#23a559";
      case "idle": return "#f0b232";
      case "dnd": return "#f23f43";
      default: return "#80848e";
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case "online": return "Online";
      case "idle": return "Idle";
      case "dnd": return "Do Not Disturb";
      default: return "Offline";
    }
  };

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
        
        {/* Discord Presence Card */}
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
                    >
                         {/* Status Badge (Top Right) */}
                         {lanyardData && (
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 flex items-center gap-1.5">
                                <div 
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: getStatusColor(lanyardData.discord_status) }}
                                />
                                <span className="text-xs font-bold text-white uppercase tracking-wide">
                                    {getStatusLabel(lanyardData.discord_status)}
                                </span>
                            </div>
                         )}
                    </div>
                    
                    <div className="px-5 pb-5 relative">
                        {/* Avatar */}
                        <div className="absolute -top-[40px] left-5">
                            <div className="w-[80px] h-[80px] rounded-full border-[6px] border-[#111214] bg-[#111214] relative">
                                {user.discordAvatar ? (
                                    <img src={user.discordAvatar} alt="Discord" className="w-full h-full rounded-full" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-[#5865F2] flex items-center justify-center">
                                        <FaDiscord className="text-white w-10 h-10" />
                                    </div>
                                )}
                                
                                {/* Status Indicator (Bottom Right of Avatar) */}
                                {lanyardData && (
                                    <div 
                                        className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-[4px] border-[#111214]"
                                        style={{ backgroundColor: getStatusColor(lanyardData.discord_status) }}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="pt-[48px] text-left">
                            <div className="flex items-center gap-1.5 mb-1">
                                <h3 className="text-white font-bold text-xl leading-tight">
                                    {user.discordGlobalName || user.discordUsername}
                                </h3>
                                {lanyardData?.discord_user?.discriminator !== "0" && (
                                     <span className="text-[#949BA4] text-lg">#{lanyardData?.discord_user?.discriminator || '0000'}</span>
                                )}
                            </div>
                            <p className="text-[#949BA4] text-sm font-medium mb-4">
                                {user.discordUsername}
                            </p>
                            
                            <div className="h-[1px] w-full bg-[#2e3035] mb-4" />

                            {/* Activities */}
                            {lanyardData?.activities && lanyardData.activities.length > 0 ? (
                                <div className="space-y-3">
                                    {lanyardData.activities.filter(a => a.type !== 4).map((activity, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            {activity.assets?.large_image ? (
                                                <img 
                                                    src={`https://cdn.discordapp.com/app-assets/${activity.application_id || ''}/${activity.assets.large_image}.png`}
                                                    className="w-10 h-10 rounded-lg"
                                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-lg bg-[#5865F2]/20 flex items-center justify-center">
                                                    <FaDiscord className="text-[#5865F2]" />
                                                </div>
                                            )}
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-bold text-white truncate">{activity.name}</p>
                                                {activity.details && <p className="text-xs text-[#949BA4] truncate">{activity.details}</p>}
                                                {activity.state && <p className="text-xs text-[#949BA4] truncate">{activity.state}</p>}
                                            </div>
                                        </div>
                                    ))}
                                    {/* Custom Status */}
                                    {lanyardData.activities.find(a => a.type === 4) && (
                                        <div className="text-sm text-[#dbdee1]">
                                            {lanyardData.activities.find(a => a.type === 4)?.state}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-[#1e1f22]/50 border border-white/5">
                                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                                    <p className="text-xs text-[#949BA4] font-medium">No active status</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Badges */}
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