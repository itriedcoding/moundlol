import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FaDiscord } from "react-icons/fa";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleDiscordLogin = () => {
    const clientId = "1458362723959181435";
    const redirectUri = window.location.origin + "/auth/discord/callback";
    const scope = "identify";
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
    window.location.href = url;
  };

  const redirectUri = window.location.origin + "/auth/discord/callback";

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

          <p className="text-center text-sm text-muted-foreground">
            Please ensure you have linked your Discord account to your profile.
          </p>

          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-muted-foreground text-center mb-1">
              Developer Note: Add this Redirect URI to Discord:
            </p>
            <p className="text-xs font-mono text-center break-all select-all text-primary">
              {redirectUri}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}