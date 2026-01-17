import { motion } from "framer-motion";
import { Sparkles, Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { setSessionToken } from "@/lib/session";
import { Button } from "@/components/ui/button";

interface ProfileClaimProps {
  username: string;
}

export function ProfileClaim({ username }: ProfileClaimProps) {
  const navigate = useNavigate();
  const [isClaiming, setIsClaiming] = useState(false);
  const claimUsername = useMutation(api.users.claimUsername);

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
