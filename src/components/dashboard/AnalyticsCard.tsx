import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AnalyticsCardProps {
  sessionToken: string;
}

export function AnalyticsCard({ sessionToken }: AnalyticsCardProps) {
  const analytics = useQuery(api.analytics.getAnalytics, { sessionToken, range: "7d" });

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl p-6"
    >
      <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <BarChart3 className="w-5 h-5 text-orange-400" />
        </div>
        Analytics
      </h3>
      <div className="space-y-6">
        <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
          <div className="text-4xl font-bold text-white mb-1">
            {analytics?.profileViews || 0}
          </div>
          <div className="text-sm text-muted-foreground font-medium">Profile Views</div>
        </div>
        <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
          <div className="text-4xl font-bold text-white mb-1">
            {analytics?.linkClicks || 0}
          </div>
          <div className="text-sm text-muted-foreground font-medium">Link Clicks</div>
        </div>
        <div className="pt-4 border-t border-white/5">
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Data (Last 7 days)
          </div>
        </div>
      </div>
    </motion.div>
  );
}
