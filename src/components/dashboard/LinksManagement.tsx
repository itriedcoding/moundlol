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
  FaPinterest, FaTumblr, FaVimeo, FaMedium, FaPaypal,
  FaThreads, FaBluesky
} from "react-icons/fa6";
import { 
  SiOnlyfans, SiSoundcloud, SiCashapp, SiVenmo, SiKofi,
  SiBuymeacoffee, SiSubstack, SiX, SiKick
} from "react-icons/si";
import { Globe, Mail, Link as LinkIcon, Plus, Eye, EyeOff, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

const SOCIAL_PLATFORMS = [
  { value: "tiktok", label: "TikTok", icon: <FaTiktok />, color: "#000000" },
  { value: "instagram", label: "Instagram", icon: <FaInstagram />, color: "#E1306C" },
  { value: "twitter", label: "X (Twitter)", icon: <SiX />, color: "#1DA1F2" },
  { value: "threads", label: "Threads", icon: <FaThreads />, color: "#000000" },
  { value: "bluesky", label: "Bluesky", icon: <FaBluesky />, color: "#0560FF" },
  { value: "youtube", label: "YouTube", icon: <FaYoutube />, color: "#FF0000" },
  { value: "twitch", label: "Twitch", icon: <FaTwitch />, color: "#9146FF" },
  { value: "kick", label: "Kick", icon: <SiKick />, color: "#53FC18" },
  { value: "onlyfans", label: "OnlyFans", icon: <SiOnlyfans />, color: "#00AFF0" },
  { value: "fansly", label: "Fansly", icon: "💎", color: "#2BDEAC" },
  { value: "whatsapp", label: "WhatsApp", icon: <FaWhatsapp />, color: "#25D366" },
  { value: "telegram", label: "Telegram", icon: <FaTelegram />, color: "#0088cc" },
  { value: "discord", label: "Discord", icon: <FaDiscord />, color: "#5865F2" },
  { value: "spotify", label: "Spotify", icon: <FaSpotify />, color: "#1DB954" },
  { value: "soundcloud", label: "SoundCloud", icon: <SiSoundcloud />, color: "#ff8800" },
  { value: "patreon", label: "Patreon", icon: <FaPatreon />, color: "#FF424D" },
  { value: "kofi", label: "Ko-fi", icon: <SiKofi />, color: "#FF5E5B" },
  { value: "buymeacoffee", label: "Buy Me a Coffee", icon: <SiBuymeacoffee />, color: "#FFDD00" },
  { value: "linkedin", label: "LinkedIn", icon: <FaLinkedin />, color: "#0077b5" },
  { value: "facebook", label: "Facebook", icon: <FaFacebook />, color: "#1877F2" },
  { value: "snapchat", label: "Snapchat", icon: <FaSnapchat />, color: "#FFFC00" },
  { value: "reddit", label: "Reddit", icon: <FaReddit />, color: "#FF4500" },
  { value: "github", label: "GitHub", icon: <FaGithub />, color: "#333333" },
  { value: "pinterest", label: "Pinterest", icon: <FaPinterest />, color: "#E60023" },
  { value: "medium", label: "Medium", icon: <FaMedium />, color: "#000000" },
  { value: "substack", label: "Substack", icon: <SiSubstack />, color: "#FF6719" },
  { value: "vimeo", label: "Vimeo", icon: <FaVimeo />, color: "#1ab7ea" },
  { value: "tumblr", label: "Tumblr", icon: <FaTumblr />, color: "#35465c" },
  { value: "paypal", label: "PayPal", icon: <FaPaypal />, color: "#00457C" },
  { value: "cashapp", label: "Cash App", icon: <SiCashapp />, color: "#00C244" },
  { value: "venmo", label: "Venmo", icon: <SiVenmo />, color: "#008CFF" },
  { value: "website", label: "Website", icon: <Globe className="w-4 h-4" />, color: "#ff1493" },
  { value: "email", label: "Email", icon: <Mail className="w-4 h-4" />, color: "#ff1493" },
  { value: "custom", label: "Custom Link", icon: <LinkIcon className="w-4 h-4" />, color: "#ff1493" },
];

interface LinksManagementProps {
  sessionToken: string;
}

export function LinksManagement({ sessionToken }: LinksManagementProps) {
  const myLinks = useQuery(api.links.getMyLinks, { sessionToken });
  const addLink = useMutation(api.links.addLink);
  const updateLink = useMutation(api.links.updateLink);
  const deleteLink = useMutation(api.links.deleteLink);
  const reorderLinks = useMutation(api.links.reorderLinks);

  const [showAddLink, setShowAddLink] = useState(false);
  const [localLinks, setLocalLinks] = useState<any[]>([]);
  const [newLink, setNewLink] = useState({
    platform: "custom",
    title: "",
    url: "",
  });

  useEffect(() => {
    if (myLinks) {
      setLocalLinks(myLinks);
    }
  }, [myLinks]);

  const handleReorder = async (newOrder: any[]) => {
    setLocalLinks(newOrder);
    const linkIds = newOrder.map(link => link._id);
    try {
        await reorderLinks({ sessionToken, linkIds });
    } catch (error) {
        console.error("Failed to reorder links", error);
        toast.error("Failed to save link order");
    }
  };

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
      className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <LinkIcon className="w-5 h-5 text-green-400" />
          </div>
          Your Links
        </h2>
        <Dialog open={showAddLink} onOpenChange={setShowAddLink}>
          <DialogTrigger asChild>
            <Button className="bg-white text-black hover:bg-white/90 font-semibold rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/90 border-white/10 backdrop-blur-xl">
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
                  <SelectTrigger className="mt-2 bg-white/5 border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOCIAL_PLATFORMS.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          {platform.icon} {platform.label}
                        </div>
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
                  className="mt-2 bg-white/5 border-white/10"
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
                  className="mt-2 bg-white/5 border-white/10"
                />
              </div>
              <Button
                onClick={handleAddLink}
                className="w-full bg-white text-black hover:bg-white/90"
              >
                Add Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {myLinks && myLinks.length === 0 && (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-white/5 rounded-2xl">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium text-white">No links yet</p>
            <p className="text-sm">Add your first link to get started!</p>
          </div>
        )}
        
        <Reorder.Group axis="y" values={localLinks} onReorder={handleReorder} className="space-y-3">
        {localLinks.map((link) => {
          const platformDef = SOCIAL_PLATFORMS.find(p => p.value === link.platform) || SOCIAL_PLATFORMS.find(p => p.value === "custom");
          return (
            <Reorder.Item
              key={link._id}
              value={link}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group hover:bg-black/30 cursor-grab active:cursor-grabbing"
            >
              <div className="text-white/20 group-hover:text-white/50 cursor-grab active:cursor-grabbing">
                <GripVertical className="w-5 h-5" />
              </div>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                style={{ 
                  backgroundColor: `${platformDef?.color}20`, // 20% opacity
                  color: platformDef?.color 
                }}
              >
                {platformDef?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate text-white">{link.title}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {link.url}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {link.clickCount} clicks
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleToggleVisibility(link._id, link.isVisible)}
                  className="hover:bg-white/10"
                >
                  {link.isVisible ? (
                    <Eye className="w-4 h-4 text-green-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteLink(link._id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Reorder.Item>
          );
        })}
        </Reorder.Group>
      </div>
    </motion.div>
  );
}