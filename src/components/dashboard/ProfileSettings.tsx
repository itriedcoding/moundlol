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

interface ProfileSettingsProps {
  user: any;
  sessionToken: string;
}

export function ProfileSettings({ user, sessionToken }: ProfileSettingsProps) {
  const updateProfile = useMutation(api.users.updateProfile);
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

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border rounded-2xl p-6 space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Profile Settings
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Display Name</Label>
            <Input
              id="title"
              value={profileData.title}
              onChange={(e) =>
                setProfileData({ ...profileData, title: e.target.value })
              }
              placeholder="Your Name"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) =>
                setProfileData({ ...profileData, bio: e.target.value })
              }
              placeholder="Tell people about yourself..."
              className="mt-2"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="pfp">Profile Picture URL</Label>
            <div className="flex gap-4 mt-2">
              <Input
                id="pfp"
                value={profileData.profilePicture}
                onChange={(e) =>
                  setProfileData({ ...profileData, profilePicture: e.target.value })
                }
                placeholder="https://..."
              />
              {profileData.profilePicture && (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-border shrink-0">
                  <img src={profileData.profilePicture} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Appearance
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Background Type</Label>
              <Select
                value={profileData.backgroundType}
                onValueChange={(value) => setProfileData({ ...profileData, backgroundType: value })}
              >
                <SelectTrigger className="mt-2">
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
              <Label>Button Style</Label>
              <Select
                value={profileData.buttonStyle}
                onValueChange={(value) => setProfileData({ ...profileData, buttonStyle: value })}
              >
                <SelectTrigger className="mt-2">
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
            <Label htmlFor="bgValue">
              {profileData.backgroundType === "image" ? "Image URL" : "Color / Gradient"}
            </Label>
            <Input
              id="bgValue"
              value={profileData.backgroundValue}
              onChange={(e) =>
                setProfileData({ ...profileData, backgroundValue: e.target.value })
              }
              placeholder={profileData.backgroundType === "image" ? "https://..." : "#000000 or linear-gradient(...)"}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          Audio
        </h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="audio">Background Audio URL (MP3)</Label>
            <Input
              id="audio"
              value={profileData.audioUrl}
              onChange={(e) =>
                setProfileData({ ...profileData, audioUrl: e.target.value })
              }
              placeholder="https://.../song.mp3"
              className="mt-2"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoplay">Autoplay Audio</Label>
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
        className="w-full bg-primary hover:bg-primary/90 text-white"
        size="lg"
      >
        Save Changes
      </Button>
    </motion.div>
  );
}