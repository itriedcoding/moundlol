import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface QuickActionsProps {
  user: any;
}

export function QuickActions({ user }: QuickActionsProps) {
  const navigate = useNavigate();

  const copyProfileUrl = () => {
    const url = `${window.location.origin}/${user.username}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
    >
      <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start h-12 bg-black/20 border-white/10 hover:bg-white/5 hover:text-white"
          onClick={copyProfileUrl}
        >
          <Copy className="w-4 h-4 mr-3" />
          Copy Profile Link
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start h-12 bg-black/20 border-white/10 hover:bg-white/5 hover:text-white"
          onClick={() => navigate(`/${user.username}`)}
        >
          <ExternalLink className="w-4 h-4 mr-3" />
          View Public Profile
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start h-12 bg-black/20 border-white/10 hover:bg-white/5 hover:text-white"
          onClick={() => navigate("/status")}
        >
          <Activity className="w-4 h-4 mr-3" />
          System Status
        </Button>
      </div>
    </motion.div>
  );
}