import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { setSessionToken } from "@/lib/session";
import { useNavigate } from "react-router";
import { FaDiscord } from "react-icons/fa";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const login = useMutation(api.users.login);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
        toast.error("Please enter username and password");
        return;
    }

    setIsLoading(true);
    try {
      const result = await login({ 
          username: username.toLowerCase().trim(), 
          password 
      });
      if (result?.sessionToken) {
          setSessionToken(result.sessionToken);
          toast.success("Welcome back!");
          onClose();
          navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    if (!clientId) {
        toast.error("Discord Client ID is not configured");
        return;
    }
    const redirectUri = window.location.origin + "/auth/discord/callback";
    const scope = "identify";
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
    window.location.href = url;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/10 backdrop-blur-xl text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome Back</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <Button 
            onClick={handleDiscordLogin}
            className="w-full bg-[#5865F2] hover:bg-[#4752c4] text-white h-12 font-semibold"
          >
            <FaDiscord className="mr-2 w-5 h-5" />
            Continue with Discord
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-black px-2 text-muted-foreground">Or continue with password</span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="bg-white/5 border-white/10 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-white/5 border-white/10 focus:border-primary/50"
              />
            </div>
            <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 text-white h-12 font-bold"
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
