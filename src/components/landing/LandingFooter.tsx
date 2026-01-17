import { useNavigate } from "react-router";
import { Github, Twitter, Disc } from "lucide-react";

export function LandingFooter() {
  const navigate = useNavigate();
  const currentYear = 2026;

  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-32 bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container px-4 mx-auto py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(255,20,147,0.5)]">
                M
              </div>
              <span className="text-xl font-bold text-white">mound.lol</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              The ultimate bio link platform for creators, influencers, and businesses.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button onClick={() => navigate("/dashboard")} className="hover:text-primary transition-colors hover:translate-x-1 duration-300 inline-block">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/status")} className="hover:text-primary transition-colors hover:translate-x-1 duration-300 inline-block">
                  System Status
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button onClick={() => navigate("/terms")} className="hover:text-primary transition-colors hover:translate-x-1 duration-300 inline-block">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/privacy")} className="hover:text-primary transition-colors hover:translate-x-1 duration-300 inline-block">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} mound.lol. All rights reserved.
          </p>
          
          {/* Icons removed as requested */}
        </div>
      </div>
    </footer>
  );
}