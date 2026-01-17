import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
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
  );
}
