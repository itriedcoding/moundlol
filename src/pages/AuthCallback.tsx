import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { getSessionToken, setSessionToken } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const discordAuth = useAction(api.discord.auth.callback);
  const linkDiscord = useMutation(api.users.linkDiscordAccount);
  const loginWithDiscord = useMutation(api.users.loginWithDiscord);
  const processed = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const code = searchParams.get("code");
    const sessionToken = getSessionToken();

    if (!code) {
      navigate("/dashboard");
      return;
    }

    const handleAuth = async () => {
      try {
        const redirectUri = window.location.origin + "/auth/discord/callback";
        const discordData = await discordAuth({ code, redirectUri });
        
        if (sessionToken) {
            // Link account
            await linkDiscord({
                sessionToken,
                discordId: discordData.discordId,
                discordUsername: discordData.username,
                discordGlobalName: discordData.global_name,
                discordAvatar: discordData.avatar || undefined,
                discordBanner: discordData.banner || undefined,
                discordAccentColor: discordData.accent_color?.toString(),
                discordPublicFlags: discordData.public_flags,
                discordPremiumType: discordData.premium_type,
                discordAvatarDecoration: discordData.avatar_decoration || undefined,
            });
            toast.success("Discord connected successfully!");
            navigate("/dashboard");
        } else {
            // Login
            try {
                const result = await loginWithDiscord({ discordId: discordData.discordId });
                if (result?.sessionToken) {
                    setSessionToken(result.sessionToken);
                    toast.success("Logged in with Discord!");
                    // Force a reload to ensure auth state updates
                    window.location.href = "/dashboard";
                }
            } catch (loginError: any) {
                console.error(loginError);
                toast.error("No account found linked to this Discord. Please sign up or log in first.");
                navigate("/");
            }
        }
      } catch (error: any) {
        console.error(error);
        // Set error state to display persistent UI
        setError(error.message || "Unknown error occurred during Discord connection.");
      }
    };

    handleAuth();
  }, [searchParams, navigate, discordAuth, linkDiscord, loginWithDiscord]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
        <div className="max-w-2xl w-full bg-red-950/30 border border-red-500/30 rounded-2xl p-8 text-center backdrop-blur-xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Connection Failed</h3>
          <div className="bg-black/40 rounded-lg p-6 mb-8 text-left overflow-auto max-h-96 border border-white/5 font-mono text-sm">
            <p className="text-red-200 whitespace-pre-wrap break-words leading-relaxed">
              {error}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button 
                onClick={() => navigate("/")}
                variant="outline"
                className="border-white/10 hover:bg-white/5 text-white"
            >
                Return Home
            </Button>
            <Button 
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white"
            >
                Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Connecting to Discord...</p>
        <p className="text-xs text-muted-foreground mt-4">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}