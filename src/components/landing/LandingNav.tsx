import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";

export function LandingNav() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/20 backdrop-blur-lg border-b border-white/5"
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center font-bold text-white">
            M
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            mound.lol
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button 
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            >
              Dashboard
            </Button>
          ) : (
            <Button 
              onClick={() => setIsLoginOpen(true)}
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              Sign In
            </Button>
          )}
        </div>
      </motion.nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}