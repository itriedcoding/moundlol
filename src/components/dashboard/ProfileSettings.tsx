import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Image as ImageIcon, Music, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaDiscord } from "react-icons/fa";

interface ProfileSettingsProps {
  user: any;
  sessionToken: string;
}

export function ProfileSettings({ user, sessionToken }: ProfileSettingsProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const unlinkDiscord = useMutation(api.users.unlinkDiscordAccount);
  const [profileData, setProfileData] = useState({
    title: "",
    bio: "",
    profilePicture: "",
    backgroundType: "solid",
    backgroundValue: "#000000",
    buttonStyle: "rounded",
    audioUrl: "",
    audioAutoPlay: false,
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        title: user.title || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        backgroundType: user.backgroundType || "solid",
        backgroundValue: user.backgroundValue || "#000000",
        buttonStyle: user.buttonStyle || "rounded",
        audioUrl: user.audioUrl || "",
        audioAutoPlay: user.audioAutoPlay || false,
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        sessionToken,
        ...profileData,
      });
      toast.success("Profile updated!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDiscordLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    if (!clientId) {
        toast.error("Discord Client ID is not configured in environment variables");
        return;
    }
    const redirectUri = window.location.origin + "/auth/discord/callback";
    const scope = "identify";
    const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
    window.location.href = url;
  };

  const handleUnlinkDiscord = async () => {
      try {
          await unlinkDiscord({ sessionToken });
          toast.success("Discord account unlinked");
      } catch (e: any) {
          toast.error(e.message);
      }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          Profile Settings
        </h2>
        <div className="space-y-5">
          <div>
            <Label htmlFor="title" className="text-muted-foreground">Display Name</Label>
            <Input
              id="title"
              value={profileData.title}
              onChange={(e) =>
                setProfileData({ ...profileData, title: e.target.value })
              }
              placeholder="Your Name"
              className="mt-2 bg-black/20 border-white/10 focus:border-primary/50"
            />
          </div>
          <div>
            <Label htmlFor="bio" className="text-muted-foreground">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              placeholder="Tell people about yourself..."
              className="mt-2 bg-black/20 border-white/10 focus:border-primary/50 min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="pfp" className="text-muted-foreground">Profile Picture URL</Label>
            <div className="flex gap-4 mt-2">
              <Input
                id="pfp"
                value={profileData.profilePicture}
                onChange={(e) =>
                  setProfileData({ ...profileData, profilePicture: e.target.value })
                }
                placeholder="https://..."
                className="bg-black/20 border-white/10 focus:border-primary/50"
              />
              {profileData.profilePicture && (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10 shrink-0 ring-2 ring-primary/20">
                  <img src={profileData.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5">
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
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          Appearance
        </h2>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-muted-foreground">Background Type</Label>
              <Select
                value={profileData.backgroundType}
                onValueChange={(value) => setProfileData({ ...profileData, backgroundType: value })}
              >
                <SelectTrigger className="mt-2 bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Solid Color</SelectItem>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="image">Image URL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Button Style</Label>
              <Select
                value={profileData.buttonStyle}
                onValueChange={(value) => setProfileData({ ...profileData, buttonStyle: value })}
              >
                <SelectTrigger className="mt-2 bg-black/20 border-white/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded">Rounded</SelectItem>
                  <SelectItem value="square">Square</SelectItem>
                  <SelectItem value="pill">Pill</SelectItem>
                  <SelectItem value="neumorphic">Neumorphic</SelectItem>
                  <SelectItem value="glass">Glassmorphism</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="bgValue" className="text-muted-foreground">
              {profileData.backgroundType === "image" ? "Image URL" : "Color / Gradient"}
            </Label>
            <Input
              id="bgValue"
              value={profileData.backgroundValue}
              onChange={(e) =>
                setProfileData({ ...profileData, backgroundValue: e.target.value })
              }
              placeholder={profileData.backgroundType === "image" ? "https://..." : "#000000 or linear-gradient(...)"}
              className="mt-2 bg-black/20 border-white/10 focus:border-primary/50"
            />
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

      <Button
        onClick={handleSaveProfile}
        className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 rounded-xl"
        size="lg"
      >
        Save Changes
      </Button>
    </motion.div>
  );
}