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
    if (!profileData.discordGuildId) {
        toast.error("Please enter a Server ID first");
        return;
    }
    
    setIsVerifying(true);
    try {
        const data = await getGuildWidget({ guildId: profileData.discordGuildId });
        
        if (!data) {
            toast.error("Could not fetch widget. Is 'Enable Widget' turned on in Server Settings?");
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
            toast.warning("Widget accessible, but you were not found in the list. You might be offline or invisible.");
        }
    } catch (e) {
        toast.error("Failed to verify widget");
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
                        <Label htmlFor="guildId" className="text-white font-medium">Discord Server ID (For Live Status)</Label>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="w-4 h-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>To show your Online/Idle/DND status:</p>
                                    <ol className="list-decimal ml-4 mt-2 space-y-1 text-xs">
                                        <li>Go to your Discord Server Settings</li>
                                        <li>Enable "Widget"</li>
                                        <li>Copy "Server ID"</li>
                                        <li>Paste it here</li>
                                    </ol>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="flex gap-2">
                        <Input
                            id="guildId"
                            value={profileData.discordGuildId || ""}
                            onChange={(e) =>
                                setProfileData({ ...profileData, discordGuildId: e.target.value })
                            }
                            placeholder="e.g. 123456789012345678"
                            className="bg-black/20 border-white/10 focus:border-[#5865F2]/50"
                        />
                        <Button 
                            onClick={handleVerifyWidget}
                            disabled={isVerifying || !profileData.discordGuildId}
                            variant="outline"
                            className="border-white/10 hover:bg-white/5"
                        >
                            {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Test"}
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        Required for real-time status. You must be a member of this server and visible in the widget list.
                    </p>
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