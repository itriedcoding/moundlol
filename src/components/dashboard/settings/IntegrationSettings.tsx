import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Music } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

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
