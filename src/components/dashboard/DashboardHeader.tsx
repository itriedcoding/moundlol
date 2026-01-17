import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

interface DashboardHeaderProps {
  user: any;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const copyProfileUrl = () => {
    const url = `${window.location.origin}/${user.username}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-lg font-bold text-white hidden md:block">mound.lol</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm hover:bg-white/10 transition-colors cursor-pointer" onClick={copyProfileUrl}>
            <span className="text-muted-foreground">mound.lol/</span>
            <span className="text-white font-medium">{user.username}</span>
            <Copy className="w-3 h-3 ml-2 text-muted-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-3">
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
