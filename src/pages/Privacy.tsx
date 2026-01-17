import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router";

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,20,147,0.1),transparent_50%)]" />
      
      <motion.div
        className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
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
            className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-muted-foreground prose-strong:text-white prose-a:text-primary">
              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">1.</span> Information We Collect
                </h2>
                <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your username, email address, and profile content.</p>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">2.</span> How We Use Your Information
                </h2>
                <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users and the public.</p>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">3.</span> Analytics
                </h2>
                <p>We use analytics tools to understand how users engage with our Service. This data is used to improve the user experience and is not shared with third parties for advertising purposes.</p>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">4.</span> Data Security
                </h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">5.</span> Contact Us
                </h2>
                <p>If you have any questions about this Privacy Policy, please contact us at support@mound.lol.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}