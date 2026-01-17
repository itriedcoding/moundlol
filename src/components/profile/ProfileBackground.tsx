import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface ProfileBackgroundProps {
  user: any;
}

export function ProfileBackground({ user }: ProfileBackgroundProps) {
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
    <div 
      className={`fixed inset-0 -z-10 transition-colors duration-500`}
      style={getBackgroundStyle()}
    >
      {/* Overlay for readability if image background */ }
      {user.backgroundType === "image" && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      )}
      {renderAnimation()}
    </div>
  );
}
