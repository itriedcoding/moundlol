import { useNavigate } from "react-router";
import { Github, Twitter, Disc } from "lucide-react";

export function LandingFooter() {
  const navigate = useNavigate();
  const currentYear = 2026; // As requested

  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="container px-4 mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center font-bold text-white">
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
                <button onClick={() => navigate("/dashboard")} className="hover:text-primary transition-colors">
                  Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/status")} className="hover:text-primary transition-colors">
                  System Status
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button onClick={() => navigate("/terms")} className="hover:text-primary transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/privacy")} className="hover:text-primary transition-colors">
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
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Disc className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
