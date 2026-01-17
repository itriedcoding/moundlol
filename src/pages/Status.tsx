import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Activity, Users, Link as LinkIcon, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function Status() {
  const navigate = useNavigate();
  const status = useQuery(api.status.get);

  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,20,147,0.15),transparent_60%)]" />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/5 to-transparent" />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,20,147,0.3)]">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-white">System Status</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate("/")} className="hover:bg-white/10">
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-muted-foreground">Total Users</span>
            </div>
            <div className="text-4xl font-bold text-white">{status?.stats?.users || 0}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <LinkIcon className="w-5 h-5" />
              </div>
              <span className="text-muted-foreground">Total Links</span>
            </div>
            <div className="text-4xl font-bold text-white">{status?.stats?.links || 0}</div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-muted-foreground">Uptime</span>
            </div>
            <div className="text-4xl font-bold text-white">99.9%</div>
          </motion.div>
        </div>

        {/* Services Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Services</h2>
          
          {[
            { name: "API", status: "operational" },
            { name: "Database", status: "operational" },
            { name: "Discord Bot", status: "operational" },
            { name: "Link Redirects", status: "operational" },
          ].map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md hover:bg-white/5 transition-colors"
            >
              <span className="font-medium text-white">{service.name}</span>
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium capitalize">{service.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}