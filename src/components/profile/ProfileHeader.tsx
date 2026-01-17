import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

interface ProfileHeaderProps {
  user: any;
  badges: any[];
}

export function ProfileHeader({ user, badges }: ProfileHeaderProps) {
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
        
        {/* Discord Presence */}
        {user.showDiscordPresence && user.discordUsername && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/30 text-white/90 text-sm backdrop-blur-sm">
                <FaDiscord className="text-[#5865F2]" />
                <span>{user.discordUsername}</span>
                {/* We could add a status indicator here if we had real-time presence */}
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse ml-1" title="Linked"></span>
            </div>
        )}

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
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 border border-white/10">
                  <p className="font-bold text-primary">{badge.name}</p>
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
  );
}
