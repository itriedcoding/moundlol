import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,20,147,0.1),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center px-4"
      >
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
          <AlertCircle className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl text-white/80 mb-8">Page not found</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Button 
          onClick={() => navigate("/")}
          className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-xl"
        >
          <Home className="w-5 h-5 mr-2" />
          Back Home
        </Button>
      </motion.div>
    </div>
  );
}