import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FaTiktok, FaInstagram, FaTwitter, FaYoutube, FaTwitch,
  FaWhatsapp, FaTelegram, FaDiscord, FaSpotify, FaLinkedin,
  FaFacebook, FaSnapchat, FaReddit, FaGithub, FaPatreon,
  FaPinterest, FaTumblr, FaVimeo, FaMedium, FaPaypal
} from "react-icons/fa";
import { 
  SiOnlyfans, SiSoundcloud, SiCashapp, SiVenmo, SiKofi,
  SiBuymeacoffee, SiSubstack, SiX
} from "react-icons/si";
import { Globe, Mail, Link as LinkIcon, Plus, Eye, EyeOff, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const SOCIAL_PLATFORMS = [
  { value: "tiktok", label: "TikTok", icon: <FaTiktok /> },
  { value: "instagram", label: "Instagram", icon: <FaInstagram /> },
  { value: "twitter", label: "X (Twitter)", icon: <SiX /> },
  { value: "youtube", label: "YouTube", icon: <FaYoutube /> },
  { value: "twitch", label: "Twitch", icon: <FaTwitch /> },
  { value: "onlyfans", label: "OnlyFans", icon: <SiOnlyfans /> },
  { value: "fansly", label: "Fansly", icon: "💎" },
  { value: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp /> },
  { value: "telegram", label: "Telegram", icon: <FaTelegram /> },
  { value: "discord", label: "Discord", icon: <FaDiscord /> },
  { value: "spotify", label: "Spotify", icon: <FaSpotify /> },
  { value: "soundcloud", label: "SoundCloud", icon: <SiSoundcloud /> },
  { value: "patreon", label: "Patreon", icon: <FaPatreon /> },
  { value: "kofi", label: "Ko-fi", icon: <SiKofi /> },
  { value: "buymeacoffee", label: "Buy Me a Coffee", icon: <SiBuymeacoffee /> },
  { value: "linkedin", label: "LinkedIn", icon: <FaLinkedin /> },
  { value: "facebook", label: "Facebook", icon: <FaFacebook /> },
  { value: "snapchat", label: "Snapchat", icon: <FaSnapchat /> },
  { value: "reddit", label: "Reddit", icon: <FaReddit /> },
  { value: "github", label: "GitHub", icon: <FaGithub /> },
  { value: "pinterest", label: "Pinterest", icon: <FaPinterest /> },
  { value: "medium", label: "Medium", icon: <FaMedium /> },
  { value: "substack", label: "Substack", icon: <SiSubstack /> },
  { value: "vimeo", label: "Vimeo", icon: <FaVimeo /> },
  { value: "tumblr", label: "Tumblr", icon: <FaTumblr /> },
  { value: "paypal", label: "PayPal", icon: <FaPaypal /> },
  { value: "cashapp", label: "Cash App", icon: <SiCashapp /> },
  { value: "venmo", label: "Venmo", icon: <SiVenmo /> },
  { value: "website", label: "Website", icon: <Globe className="w-4 h-4" /> },
  { value: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
  { value: "custom", label: "Custom Link", icon: <LinkIcon className="w-4 h-4" /> },
];

interface LinksManagementProps {
  sessionToken: string;
}

export function LinksManagement({ sessionToken }: LinksManagementProps) {
  const myLinks = useQuery(api.links.getMyLinks, { sessionToken });
  const addLink = useMutation(api.links.addLink);
  const updateLink = useMutation(api.links.updateLink);
  const deleteLink = useMutation(api.links.deleteLink);

  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: "custom",
    title: "",
    url: "",
  });

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const platform = SOCIAL_PLATFORMS.find((p) => p.value === newLink.platform);
      await addLink({
        sessionToken,
        platform: newLink.platform,
        title: newLink.title,
        url: newLink.url,
      });
      toast.success("Link added!");
      setNewLink({ platform: "custom", title: "", url: "" });
      setShowAddLink(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleVisibility = async (linkId: string, isVisible: boolean) => {
    try {
      await updateLink({ sessionToken, linkId: linkId as any, isVisible: !isVisible });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await deleteLink({ sessionToken, linkId: linkId as any });
      toast.success("Link deleted!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-2xl p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <LinkIcon className="w-6 h-6 text-primary" />
          Your Links
        </h2>
        <Dialog open={showAddLink} onOpenChange={setShowAddLink}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={newLink.platform}
                  onValueChange={(value) =>
                    setNewLink({ ...newLink, platform: value })
                  }
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.icon} {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="linkTitle">Title</Label>
                <Input
                  id="linkTitle"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                  placeholder="My Awesome Link"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="linkUrl">URL</Label>
                <Input
                  id="linkUrl"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                  placeholder="https://..."
                  className="mt-2"
                />
              </div>
              <Button
                onClick={handleAddLink}
                className="w-full bg-primary hover:bg-primary/90 text-white"
              >
                Add Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {myLinks && myLinks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No links yet. Add your first link to get started!</p>
          </div>
        )}
        {myLinks?.map((link) => {
          const platformDef = SOCIAL_PLATFORMS.find(p => p.value === link.platform) || SOCIAL_PLATFORMS.find(p => p.value === "custom");
          return (
            <motion.div
              key={link._id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="text-2xl text-primary">
                {platformDef?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate">{link.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {link.url}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {link.clickCount} clicks
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleVisibility(link._id, link.isVisible)}
                >
                  {link.isVisible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteLink(link._id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}