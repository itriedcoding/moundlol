import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, LogOut, Globe, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

interface DashboardHeaderProps {
  user: any;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { signOut, sessionToken } = useAuth();
  const updatePublishedStatus = useMutation(api.users.updatePublishedStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const copyProfileUrl = () => {
    const url = `${window.location.origin}/${user.username}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const handlePublishToggle = async (checked: boolean) => {
    if (!sessionToken) return;
    setIsUpdating(true);
    try {
      await updatePublishedStatus({ 
        sessionToken,
        isPublished: checked 
      });
      toast.success(checked ? "Profile published!" : "Profile unpublished");
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-lg font-bold text-white hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">mound.lol</h1>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors cursor-pointer group" onClick={copyProfileUrl}>
            <span className="text-muted-foreground group-hover:text-white/80 transition-colors">mound.lol/</span>
            <span className="text-white font-medium">{user.username}</span>
            <Copy className="w-3 h-3 ml-2 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 mr-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
            {user.isPublished ? (
              <Globe className="w-3 h-3 text-green-400" />
            ) : (
              <Lock className="w-3 h-3 text-yellow-400" />
            )}
            <span className={`text-xs font-medium ${user.isPublished ? "text-green-400" : "text-yellow-400"}`}>
              {user.isPublished ? "Public" : "Private"}
            </span>
            <Switch 
              checked={user.isPublished} 
              onCheckedChange={handlePublishToggle}
              disabled={isUpdating}
              className="scale-75 data-[state=checked]:bg-green-500"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/${user.username}`)}
            className="text-muted-foreground hover:text-white hover:bg-white/5"
          >
            <ExternalLink className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">View Page</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}