import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Music, Loader2, CheckCircle2, XCircle, Bot } from "lucide-react";
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
  const getGuildWidget = useAction(api.discord.guild.getWidget);
  const getGuildMember = useAction(api.discord.guild.getMember);
  const registerCommands = useAction(api.discord.commands.register);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleVerifyWidget = async () => {
    setIsVerifying(true);
    try {
        // 1. Try Widget First (Public, shows status)
        const widgetData = await getGuildWidget({ guildId: OFFICIAL_GUILD_ID });
        let foundInWidget = false;
        let widgetMember = null;

        if (widgetData && widgetData.members) {
             widgetMember = widgetData.members.find((m: any) => m.id === user.discordId);
             if (widgetMember) {
                 foundInWidget = true;
             }
        }

        if (foundInWidget && widgetMember) {
            toast.success(`Success! Found you as ${widgetMember.status} (${widgetMember.game ? "Playing " + widgetMember.game.name : "No Activity"})`);
            return;
        }

        // 2. If not in widget, try Bot API (Private, confirms membership)
        toast.info("Not found in public widget, checking server membership via Bot API...");
        const memberData = await getGuildMember({ guildId: OFFICIAL_GUILD_ID, userId: user.discordId });

        if (memberData) {
            toast.success("Verified! You are a member of the official server.");
            toast.warning("Note: You are not visible in the public Widget list. This means your status (Online/Idle) might not appear on your profile. Ensure you are not 'Invisible' and that the server widget is configured to show you.");
        } else {
            toast.error("You were not found in the official server. Please join the server to enable status features.");
        }

    } catch (e) {
        console.error(e);
        toast.error("Failed to verify status connection");
    } finally {
        setIsVerifying(false);
    }
  };

  const handleRegisterCommands = async () => {
    setIsRegistering(true);
    try {
        await registerCommands({});
        toast.success("Slash commands registered successfully!");
    } catch (e: any) {
        toast.error("Failed to register commands: " + e.message);
    } finally {
        setIsRegistering(false);
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
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Bot className="w-5 h-5 text-purple-400" />
          </div>
          Discord Bot
        </h2>
        <div className="space-y-5">
            <div className="p-6 bg-black/20 border border-white/10 rounded-xl">
                <p className="text-sm text-muted-foreground mb-4">
                    Ensure you have added your <code>DISCORD_BOT_TOKEN</code> and <code>DISCORD_CLIENT_ID</code> in the Convex Dashboard.
                    Then, click below to register the slash commands (<code>/profile</code>, <code>/assignbadge</code>, etc.) to your bot.
                </p>
                <Button 
                    onClick={handleRegisterCommands} 
                    disabled={isRegistering}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                    {isRegistering ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Bot className="w-4 h-4 mr-2" />}
                    Register Slash Commands
                </Button>
            </div>
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