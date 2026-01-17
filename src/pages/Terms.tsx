import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,20,147,0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
      
      <motion.div
        className="absolute top-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
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
            className="mb-8 hover:bg-primary/10 hover:text-primary transition-colors text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(255,20,147,0.3)]">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Terms of Service</h1>
                <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-muted-foreground prose-strong:text-white prose-a:text-primary">
              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">1.</span> Acceptance of Terms
                </h2>
                <p>By accessing and using mound.lol ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">2.</span> User Accounts
                </h2>
                <p>You are responsible for maintaining the security of your account and password. The Service cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">3.</span> Content Guidelines
                </h2>
                <p>You are responsible for all content posted and activity that occurs under your account. We reserve the right to remove any content that we determine to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene, or otherwise objectionable.</p>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">4.</span> Termination
                </h2>
                <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              </section>

              <section className="space-y-4 mb-8">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                  <span className="text-primary">5.</span> Changes
                </h2>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}