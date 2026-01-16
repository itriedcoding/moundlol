import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import {
  ExternalLink,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  Settings,
  Copy,
  Link as LinkIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SOCIAL_PLATFORMS = [
  { value: "tiktok", label: "TikTok", icon: "🎵" },
  { value: "instagram", label: "Instagram", icon: "📷" },
  { value: "twitter", label: "Twitter/X", icon: "🐦" },
  { value: "youtube", label: "YouTube", icon: "▶️" },
  { value: "twitch", label: "Twitch", icon: "🎮" },
  { value: "onlyfans", label: "OnlyFans", icon: "💋" },
  { value: "whatsapp", label: "WhatsApp", icon: "💬" },
  { value: "telegram", label: "Telegram", icon: "✈️" },
  { value: "discord", label: "Discord", icon: "🎮" },
  { value: "spotify", label: "Spotify", icon: "🎵" },
  { value: "soundcloud", label: "SoundCloud", icon: "🎧" },
  { value: "patreon", label: "Patreon", icon: "🎨" },
  { value: "linkedin", label: "LinkedIn", icon: "💼" },
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "snapchat", label: "Snapchat", icon: "👻" },
  { value: "reddit", label: "Reddit", icon: "🤖" },
  { value: "github", label: "GitHub", icon: "💻" },
  { value: "website", label: "Website", icon: "🌐" },
  { value: "email", label: "Email", icon: "📧" },
  { value: "custom", label: "Custom Link", icon: "🔗" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, sessionToken } = useAuth();

  const myLinks = useQuery(
    api.links.getMyLinks,
    sessionToken ? { sessionToken } : "skip"
  );
  const analytics = useQuery(
    api.analytics.getAnalytics,
    sessionToken ? { sessionToken, range: "7d" } : "skip"
  );

  const updateProfile = useMutation(api.users.updateProfile);
  const addLink = useMutation(api.links.addLink);
  const updateLink = useMutation(api.links.updateLink);
  const deleteLink = useMutation(api.links.deleteLink);

  const [profileData, setProfileData] = useState({
    title: "",
    bio: "",
  });
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({
    platform: "custom",
    title: "",
    url: "",
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        title: user.title || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  if (!sessionToken || !user) {
    navigate("/yourusername");
    return null;
  }

  if (myLinks === undefined || analytics === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-primary">Loading...</div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    if (!sessionToken) return;
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

  const handleAddLink = async () => {
    if (!sessionToken) return;
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
        icon: platform?.icon,
      });
      toast.success("Link added!");
      setNewLink({ platform: "custom", title: "", url: "" });
      setShowAddLink(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleToggleVisibility = async (linkId: string, isVisible: boolean) => {
    if (!sessionToken) return;
    try {
      await updateLink({ sessionToken, linkId: linkId as any, isVisible: !isVisible });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!sessionToken) return;
    if (!confirm("Are you sure you want to delete this link?")) return;

    try {
      await deleteLink({ sessionToken, linkId: linkId as any });
      toast.success("Link deleted!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyProfileUrl = () => {
    const url = `${window.location.origin}/${user.username}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gradient-pink">mound.lol</h1>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full text-sm">
              <span className="text-muted-foreground">mound.lol/</span>
              <span className="text-primary font-semibold">{user.username}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyProfileUrl}
              className="hidden sm:flex"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/${user.username}`)}
            >
              <ExternalLink className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">View Profile</span>
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Profile Settings */}
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

            {/* Links Management */}
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
                {myLinks?.map((link) => (
                  <motion.div
                    key={link._id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/50 transition-colors group"
                  >
                    <div className="text-2xl">{link.icon || "🔗"}</div>
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
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Analytics Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Analytics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {analytics?.profileViews || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Profile Views</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary">
                    {analytics?.linkClicks || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Link Clicks</div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="text-xs text-muted-foreground">Last 7 days</div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-card border border-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={copyProfileUrl}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Profile Link
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(`/${user.username}`)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Public Profile
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
