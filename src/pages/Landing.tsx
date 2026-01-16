import { motion } from "framer-motion";
import { Link, Plus, Zap, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Landing() {
  const navigate = useNavigate();
  const currentUser = useQuery(api.users.getCurrentUser);

  const handleGetStarted = () => {
    if (currentUser) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.1),transparent_50%)]" />

      {/* Animated background blobs */}
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

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
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
            {currentUser ? "Dashboard" : "Sign In"}
          </Button>
        </motion.header>

        {/* Hero Section */}
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
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white glow-pink text-lg px-8 py-6 group"
              >
                Claim Your Link
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <div className="text-sm text-muted-foreground">
                mound.lol/<span className="text-primary font-semibold">yourname</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
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
                icon: Link,
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

        {/* Supported Platforms Section */}
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
            {["TikTok", "Instagram", "Twitter", "YouTube", "Twitch", "OnlyFans", "WhatsApp", "Telegram", "Discord", "Spotify", "SoundCloud", "Patreon"].map(
              (platform, index) => (
                <motion.div
                  key={platform}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="px-6 py-3 bg-card border border-border rounded-full hover:border-primary/50 transition-colors"
                >
                  <span className="font-medium">{platform}</span>
                </motion.div>
              )
            )}
          </motion.div>
        </section>

        {/* CTA Section */}
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

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 text-center text-muted-foreground border-t border-border">
          <p>© 2024 mound.lol - Made with 💖 and code</p>
        </footer>
      </div>
    </div>
  );
}
