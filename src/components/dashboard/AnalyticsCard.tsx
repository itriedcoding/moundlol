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
  );
}
