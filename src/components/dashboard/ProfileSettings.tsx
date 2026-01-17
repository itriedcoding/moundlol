import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface ProfileSettingsProps {
  user: any;
  sessionToken: string;
}

export function ProfileSettings({ user, sessionToken }: ProfileSettingsProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const [profileData, setProfileData] = useState({
    title: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        title: user.title || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        sessionToken,
        title: profileData.title,
        bio: profileData.bio,
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
      className="bg-card border border-border rounded-2xl p-6"
    >
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
        <Button
          onClick={handleSaveProfile}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          Save Profile
        </Button>
      </div>
    </motion.div>
  );
}
