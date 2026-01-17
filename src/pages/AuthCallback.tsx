import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { getSessionToken } from "@/lib/session";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const discordAuth = useAction(api.discord.discordAuth);
  const linkDiscord = useMutation(api.users.linkDiscordAccount);

  useEffect(() => {
    const code = searchParams.get("code");
    const sessionToken = getSessionToken();

    if (!code) {
      navigate("/dashboard");
      return;
    }

    if (!sessionToken) {
        toast.error("Please log in first");
        navigate("/");
        return;
    }

    const handleAuth = async () => {
      try {
        const redirectUri = window.location.origin + "/auth/discord/callback";
        const discordData = await discordAuth({ code, redirectUri });
        
        await linkDiscord({
            sessionToken,
            discordId: discordData.discordId,
            discordUsername: discordData.username,
            discordAvatar: discordData.avatar || undefined,
        });

        toast.success("Discord connected successfully!");
        navigate("/dashboard");
      } catch (error: any) {
        console.error(error);
        toast.error("Failed to connect Discord: " + error.message);
        navigate("/dashboard");
      }
    };

    handleAuth();
  }, [searchParams, navigate, discordAuth, linkDiscord]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Connecting to Discord...</p>
      </div>
    </div>
  );
}
