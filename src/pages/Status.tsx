import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { motion } from "framer-motion";
import { Activity, Users, Link as LinkIcon, CheckCircle2, ArrowLeft, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export default function Status() {
  const navigate = useNavigate();
  const status = useQuery(api.status.get);

  const stats = [
    {
      label: "Total Users",
      value: status?.stats?.users?.toLocaleString() || "-",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Total Links",
      value: status?.stats?.links?.toLocaleString() || "-",
      icon: LinkIcon,
      color: "text-pink-400",
      bg: "bg-pink-400/10",
    },
    {
      label: "System Status",
      value: "Operational",
      icon: Activity,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.1),transparent_50%)]" />
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-green-500">All Systems Operational</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">System Status</h1>
            <p className="text-muted-foreground text-lg">Real-time performance metrics and operational status</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-primary/30 transition-colors group"
              >
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" />
              Service Health
            </h2>
            
            <div className="space-y-4">
              {[
                { name: "API Gateway", status: "Operational" },
                { name: "Database", status: "Operational" },
                { name: "Discord Bot", status: "Operational" },
                { name: "Image Optimization", status: "Operational" },
                { name: "Authentication", status: "Operational" },
              ].map((service, i) => (
                <div key={service.name} className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/5">
                  <span className="font-medium">{service.name}</span>
                  <div className="flex items-center gap-2 text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}