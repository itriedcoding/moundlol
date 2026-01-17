import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { getSessionToken, setSessionToken } from "@/lib/session";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const discordAuth = useAction(api.discord.discordAuth);
  const linkDiscord = useMutation(api.users.linkDiscordAccount);
  const loginWithDiscord = useMutation(api.users.loginWithDiscord);
  const processed = useRef(false);

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
                discordAvatar: discordData.avatar || undefined,
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
        // Display the full error message received from the server
        // This ensures the user sees the detailed configuration error if present.
        toast.error(`Error connecting Discord: ${error.message || "Unknown error"}`, { duration: 10000 });
        navigate("/");
      }
    };

    handleAuth();
  }, [searchParams, navigate, discordAuth, linkDiscord, loginWithDiscord]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Connecting to Discord...</p>
        <p className="text-xs text-muted-foreground mt-4\">Please wait while we verify your account.</p>
      </div>
    </div>
  );
}