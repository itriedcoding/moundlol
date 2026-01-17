import { motion } from "framer-motion";
import { Link as LinkIcon, Zap, BarChart3, Sparkles, ArrowRight } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [username, setUsername] = useState("");

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/yourusername");
    }
  };

  const handleClaimUsername = () => {
    if (username.trim()) {
      navigate(`/${username.trim()}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleClaimUsername();
    }
  };

  const platforms = [
    { name: "TikTok", icon: FaTiktok, color: "#000000" },
    { name: "Instagram", icon: FaInstagram, color: "#E4405F" },
    { name: "X (Twitter)", icon: SiX, color: "#000000" },
    { name: "YouTube", icon: FaYoutube, color: "#FF0000" },
    { name: "Twitch", icon: FaTwitch, color: "#9146FF" },
    { name: "OnlyFans", icon: SiOnlyfans, color: "#00AFF0" },
    { name: "WhatsApp", icon: FaWhatsapp, color: "#25D366" },
    { name: "Telegram", icon: FaTelegram, color: "#0088cc" },
    { name: "Discord", icon: FaDiscord, color: "#5865F2" },
    { name: "Spotify", icon: FaSpotify, color: "#1DB954" },
    { name: "SoundCloud", icon: SiSoundcloud, color: "#ff8800" },
    { name: "Patreon", icon: FaPatreon, color: "#FF424D" },
    { name: "Ko-fi", icon: SiKofi, color: "#FF5E5B" },
    { name: "Buy Me a Coffee", icon: SiBuymeacoffee, color: "#FFDD00" },
    { name: "LinkedIn", icon: FaLinkedin, color: "#0077b5" },
    { name: "Facebook", icon: FaFacebook, color: "#1877F2" },
    { name: "Snapchat", icon: FaSnapchat, color: "#FFFC00" },
    { name: "Reddit", icon: FaReddit, color: "#FF4500" },
    { name: "GitHub", icon: FaGithub, color: "#333333" },
    { name: "Pinterest", icon: FaPinterest, color: "#E60023" },
    { name: "Medium", icon: FaMedium, color: "#000000" },
    { name: "Substack", icon: SiSubstack, color: "#FF6719" },
    { name: "Vimeo", icon: FaVimeo, color: "#1ab7ea" },
    { name: "Tumblr", icon: FaTumblr, color: "#35465c" },
    { name: "PayPal", icon: FaPaypal, color: "#00457C" },
    { name: "Cash App", icon: SiCashapp, color: "#00C244" },
    { name: "Venmo", icon: SiVenmo, color: "#008CFF" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.1),transparent_50%)]" />

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
        className="absolute bottom-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 py-6 flex justify-between items-center"
        >
          <div className="text-2xl font-bold">
            <span className="text-gradient-pink">mound.lol</span>
          </div>
          <Button
            onClick={handleGetStarted}
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            {user ? "Dashboard" : "Get Started"}
          </Button>
        </motion.header>

        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">The hottest bio link platform</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Your link,
              <br />
              <span className="text-gradient-pink">Your vibe.</span>
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            >
              Create your unique bio link in seconds. Share all your socials, content, and more from one stunning page.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col gap-6 justify-center items-center max-w-2xl mx-auto"
            >
              <div className="w-full max-w-lg">
                <div className="flex flex-col sm:flex-row gap-3 p-2 bg-card border-2 border-primary/30 rounded-2xl glow-pink">
                  <div className="flex items-center flex-1 px-4 py-3 bg-background/50 rounded-xl">
                    <span className="text-muted-foreground mr-2">mound.lol/</span>
                    <Input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="yourname"
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto text-lg placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <Button
                    onClick={handleClaimUsername}
                    size="lg"
                    disabled={!username.trim()}
                    className="bg-primary hover:bg-primary/90 text-white text-lg px-8 group disabled:opacity-50"
                  >
                    Claim
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Free forever • No credit card required • Set up in 30 seconds
              </p>
            </motion.div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need,
              <br />
              <span className="text-gradient-pink">nothing you don't.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: LinkIcon,
                title: "Unlimited Links",
                description: "Add all your social profiles, websites, and content. No limits, no restrictions.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Your page loads instantly. No bloat, just speed and style.",
              },
              {
                icon: BarChart3,
                title: "Real-Time Analytics",
                description: "Track clicks, views, and engagement with powerful analytics.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:glow-pink h-full">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Connect <span className="text-gradient-pink">everywhere</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Link to all your favorite platforms
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-6 max-w-4xl mx-auto"
          >
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 px-6 py-3 bg-card border border-border rounded-full hover:border-primary/50 transition-colors group"
              >
                <platform.icon className="w-5 h-5 group-hover:scale-110 transition-transform" style={{ color: platform.color }} />
                <span className="font-medium">{platform.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl p-12 md:p-16 border border-primary/30 glow-pink"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to stand out?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands creating their perfect bio link
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white text-lg px-10 py-6"
            >
              Get Started Free
            </Button>
          </motion.div>
        </section>

        <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground border-t border-border">
          <p>© 2024 mound.lol - Made with 💖 and code</p>
        </footer>
      </div>
    </div>
  );
}
