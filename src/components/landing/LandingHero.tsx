import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, Check } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { setSessionToken } from "@/lib/session";

export function LandingHero() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isClaiming, setIsClaiming] = useState(false);
  const claimUsername = useMutation(api.users.claimUsername);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setIsClaiming(true);
    try {
      const result = await claimUsername({
        username: username.toLowerCase().trim(),
      });
      setSessionToken(result.sessionToken);
      toast.success(`🎉 Claimed @${username}!`);
      navigate("/dashboard");
    } catch (error: any) {
      if (error.message?.includes("taken")) {
        toast.error("Username is already taken");
      } else {
        toast.error("Failed to claim username");
      }
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.1),transparent_50%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="container px-4 mx-auto relative z-10 text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-white/80">The ultimate bio link for creators</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            One link to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-400 to-blue-400">
              rule them all
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Create a beautiful, customizable profile to house all your links, music, videos, and more. 
            Claim your unique username today.
          </p>

          <form onSubmit={handleClaim} className="max-w-md mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative flex items-center bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
              <span className="pl-4 text-muted-foreground font-medium">mound.lol/</span>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="border-0 bg-transparent focus-visible:ring-0 text-lg h-12 placeholder:text-muted-foreground/50"
              />
              <Button 
                size="lg"
                disabled={isClaiming || !username}
                className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105"
              >
                {isClaiming ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Claim <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
