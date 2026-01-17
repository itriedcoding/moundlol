import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="text-4xl font-bold mb-8 text-gradient-pink">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>By accessing and using mound.lol ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">2. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account and password. The Service cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.</p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">3. Content Guidelines</h2>
            <p>You are responsible for all content posted and activity that occurs under your account. We reserve the right to remove any content that we determine to be unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene, or otherwise objectionable.</p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">4. Termination</h2>
            <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">5. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
