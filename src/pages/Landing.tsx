import { LandingNav } from "@/components/landing/LandingNav";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary/30">
      <LandingNav />
      <LandingHero />
      <LandingFeatures />
      <LandingFooter />
    </div>
  );
}