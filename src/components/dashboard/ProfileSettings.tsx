import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./settings/GeneralSettings";
import { AppearanceSettings } from "./settings/AppearanceSettings";
import { AdvancedSettings } from "./settings/AdvancedSettings";
import { IntegrationSettings } from "./settings/IntegrationSettings";

interface ProfileSettingsProps {
  user: any;
  sessionToken: string;
}

export function ProfileSettings({ user, sessionToken }: ProfileSettingsProps) {
  const updateProfile = useMutation(api.users.updateProfile);
  const unlinkDiscord = useMutation(api.users.unlinkDiscordAccount);
  const discordClientId = useQuery(api.users.getDiscordClientId);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  
  const [profileData, setProfileData] = useState({
    title: "",
    bio: "",
    profilePicture: "",
    backgroundType: "solid",
    backgroundValue: "#000000",
    buttonStyle: "rounded",
    font: "sans",
    audioUrl: "",
    audioAutoPlay: false,
    seoTitle: "",
    seoDescription: "",
    customCss: "",
    showSocialProof: false,
    sensitiveContent: false,
    animationEffect: "none",
    newsletterActive: false,
    newsletterHeading: "Subscribe to my newsletter",
    newsletterDescription: "Get the latest updates directly to your inbox.",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        title: user.title || "",
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        backgroundType: user.backgroundType || "solid",
        backgroundValue: user.backgroundValue || "#000000",
        buttonStyle: user.buttonStyle || "rounded",
        font: user.font || "sans",
        audioUrl: user.audioUrl || "",
        audioAutoPlay: user.audioAutoPlay || false,
        seoTitle: user.seoTitle || "",
        seoDescription: user.seoDescription || "",
        customCss: user.customCss || "",
        showSocialProof: user.showSocialProof || false,
        sensitiveContent: user.sensitiveContent || false,
        animationEffect: user.animationEffect || "none",
        newsletterActive: user.newsletterActive || false,
        newsletterHeading: user.newsletterHeading || "Subscribe to my newsletter",
        newsletterDescription: user.newsletterDescription || "Get the latest updates directly to your inbox.",
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pfp' | 'bg') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const postUrl = await generateUploadUrl();
      
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) throw new Error("Upload failed");
      
      const { storageId } = await result.json();
      
      const finalUrl = `https://${import.meta.env.VITE_CONVEX_URL.split('//')[1].split('.')[0]}.convex.cloud/api/storage/${storageId}`;
      
      if (type === 'pfp') {
        setProfileData(prev => ({ ...prev, profilePicture: finalUrl }));
      } else {
        setProfileData(prev => ({ ...prev, backgroundValue: finalUrl, backgroundType: 'image' }));
      }
      
      toast.success("File uploaded!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDiscordLogin = () => {
    const clientId = discordClientId;
    if (!clientId) {
        toast.error("Discord Client ID not configured");
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
      className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8"
    >
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-8 bg-black/20 p-1 rounded-xl">
          <TabsTrigger value="general" className="rounded-lg">General</TabsTrigger>
          <TabsTrigger value="appearance" className="rounded-lg">Design</TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-lg">Advanced</TabsTrigger>
          <TabsTrigger value="integrations" className="rounded-lg">Connect</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralSettings 
            profileData={profileData}
            setProfileData={setProfileData}
            fileInputRef={fileInputRef}
            handleFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceSettings 
            profileData={profileData}
            setProfileData={setProfileData}
            bgFileInputRef={bgFileInputRef}
            handleFileUpload={handleFileUpload}
            isUploading={isUploading}
          />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedSettings 
            profileData={profileData}
            setProfileData={setProfileData}
          />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationSettings 
            profileData={profileData}
            setProfileData={setProfileData}
            user={user}
            handleDiscordLogin={handleDiscordLogin}
            handleUnlinkDiscord={handleUnlinkDiscord}
          />
        </TabsContent>
      </Tabs>

      <div className="mt-8 pt-6 border-t border-white/10">
        <Button
          onClick={handleSaveProfile}
          className="w-full bg-white text-black hover:bg-white/90 font-bold h-12 rounded-xl"
          size="lg"
        >
          Save Changes
        </Button>
      </div>
    </motion.div>
  );
}