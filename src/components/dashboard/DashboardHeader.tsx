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
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
