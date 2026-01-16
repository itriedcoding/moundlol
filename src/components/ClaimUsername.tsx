import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Check, X, Loader2 } from "lucide-react";
import { useEffect } from "react";

export function ClaimUsername({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [available, setAvailable] = useState<boolean | null>(null);

  const claimUsername = useMutation(api.users.claimUsername);
  const usernameCheck = useQuery(
    api.users.checkUsername,
    username.length >= 3 ? { username } : "skip"
  );

  useEffect(() => {
    if (usernameCheck !== undefined) {
      setAvailable(usernameCheck.available);
    }
  }, [usernameCheck]);

  const handleCheckUsername = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
    setUsername(cleaned);

    if (cleaned.length < 3) {
      setAvailable(null);
    }
  };

  const handleClaim = async () => {
    if (!available || username.length < 3) {
      toast.error("Please enter a valid username");
      return;
    }

    try {
      await claimUsername({ username, email: email || undefined });
      toast.success("Username claimed successfully!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to claim username");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Claim Your <span className="text-gradient-pink">Link</span>
          </h1>
          <p className="text-muted-foreground">
            Choose a unique username for your bio link
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative mt-2">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                mound.lol/
              </div>
              <Input
                id="username"
                value={username}
                onChange={(e) => handleCheckUsername(e.target.value)}
                className="pl-24"
                placeholder="yourname"
                maxLength={30}
              />
              {usernameCheck === undefined && username.length >= 3 && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
              )}
              {available === true && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
              {available === false && (
                <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
              )}
            </div>
            {username.length >= 3 && available !== null && (
              <p
                className={`text-sm mt-2 ${
                  available ? "text-green-500" : "text-red-500"
                }`}
              >
                {available
                  ? "Username is available!"
                  : "Username is already taken"}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Letters, numbers, and underscores only. Min 3 characters.
            </p>
          </div>

          <div>
            <Label htmlFor="email">Email (optional)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              placeholder="your@email.com"
            />
            <p className="text-xs text-muted-foreground mt-1">
              For account recovery and updates
            </p>
          </div>

          <Button
            onClick={handleClaim}
            disabled={!available || username.length < 3}
            className="w-full bg-primary hover:bg-primary/90 text-white"
            size="lg"
          >
            Claim Username
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
