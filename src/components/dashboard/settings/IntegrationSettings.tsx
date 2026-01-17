import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Music, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";

interface IntegrationSettingsProps {
  profileData: any;
  setProfileData: (data: any) => void;
  user: any;
  handleDiscordLogin: () => void;
  handleUnlinkDiscord: () => void;
}

const OFFICIAL_GUILD_ID = "1458780758440411220";

export function IntegrationSettings({
  profileData,
  setProfileData,
  user,
  handleDiscordLogin,
  handleUnlinkDiscord
}: IntegrationSettingsProps) {
  const getGuildWidget = useAction(api.discord.getGuildWidget);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyWidget = async () => {
    setIsVerifying(true);
    try {
        const data = await getGuildWidget({ guildId: OFFICIAL_GUILD_ID });
        
        if (!data) {
            toast.error("System Error: Could not fetch official server widget.");
            return;
        }
        
        if (!data.members) {
             toast.error("Widget fetched but no members list found.");
             return;
        }

        const member = data.members.find((m: any) => m.id === user.discordId);
        
        if (member) {
            toast.success(`Success! Found you as ${member.status} (${member.game ? "Playing " + member.game.name : "No Activity"})`);
        } else {
            toast.warning("You were not found in the official server widget. Please make sure you have joined the server and are online/idle/dnd (not invisible).");
        }
    } catch (e) {
        toast.error("Failed to verify status connection");
    } finally {
        setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="p-2 bg-[#5865F2]/10 rounded-lg">
            <FaDiscord className="w-5 h-5 text-[#5865F2]" />
          </div>
          Discord Integration
        </h2>
        <div className="space-y-5">
            {user.discordId ? (
                <div className="flex items-center justify-between p-4 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-xl">
                    <div className="flex items-center gap-3">
                        {user.discordAvatar && (
                            <img src={user.discordAvatar} alt="Discord Avatar" className="w-10 h-10 rounded-full" />
                        )}
                        <div>
                            <p className="font-bold text-white">{user.discordUsername}</p>
                            <p className="text-xs text-white/60">Connected</p>
                        </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleUnlinkDiscord}>
                        Unlink
                    </Button>
                </div>
            ) : (
                <div className="p-6 bg-black/20 border border-white/10 rounded-xl text-center">
                    <p className="text-muted-foreground mb-4">Connect your Discord account to display your presence and badges.</p>
                    <Button 
                        onClick={handleDiscordLogin}
                        className="bg-[#5865F2] hover:bg-[#4752c4] text-white"
                    >
                        <FaDiscord className="mr-2 w-5 h-5" />
                        Connect Discord
                    </Button>
                </div>
            )}

            {user.discordId && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Label className="text-white font-medium">Live Status Connection</Label>
                    </div>
                    
                    <div className="p-4 bg-black/20 border border-white/10 rounded-xl space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg mt-1">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-white">Requirement</p>
                                <p className="text-xs text-muted-foreground">
                                    To display your Online/Idle/DND status on your profile, you must be a member of our official Discord Server.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button 
                                onClick={handleVerifyWidget}
                                disabled={isVerifying}
                                variant="outline"
                                className="w-full border-white/10 hover:bg-white/5"
                            >
                                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <FaDiscord className="w-4 h-4 mr-2" />}
                                {isVerifying ? "Checking..." : "Check Status Connection"}
                            </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center">
                            Server ID: {OFFICIAL_GUILD_ID}
                        </p>
                    </div>
                 </div>
              </div>
            )}
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Music className="w-5 h-5 text-blue-400" />
          </div>
          Audio
        </h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="audio" className="text-muted-foreground">Background Audio URL (MP3)</Label>
            <Input
              id="audio"
              value={profileData.audioUrl}
              onChange={(e) =>
                setProfileData({ ...profileData, audioUrl: e.target.value })
              }
              placeholder="https://.../song.mp3"
              className="mt-2 bg-black/20 border-white/10 focus:border-primary/50"
            />
          </div>
          <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
            <Label htmlFor="autoplay" className="cursor-pointer">Autoplay Audio</Label>
            <Switch
              id="autoplay"
              checked={profileData.audioAutoPlay}
              onCheckedChange={(checked) =>
                setProfileData({ ...profileData, audioAutoPlay: checked })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}