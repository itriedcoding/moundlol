import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export default function Privacy() {
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
          <h1 className="text-4xl font-bold mb-8 text-gradient-pink">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, update your profile, or communicate with us. This may include your username, email address, and profile content.</p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our users and the public.</p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">3. Analytics</h2>
            <p>We use analytics tools to understand how users engage with our Service. This data is used to improve the user experience and is not shared with third parties for advertising purposes.</p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">4. Data Security</h2>
            <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
          </section>

          <section className="space-y-4 mb-8">
            <h2 className="text-2xl font-semibold">5. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at support@mound.lol.</p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
