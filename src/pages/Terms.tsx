import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck, Scale, FileText, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,20,147,0.05),transparent_50%)]" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 hover:bg-primary/10 hover:text-primary transition-colors text-white/70"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-8"
          >
            <div className="border-b border-white/10 pb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Terms of Service</h1>
              <p className="text-xl text-muted-foreground">
                Please read these terms carefully before using BioLink Hub.
              </p>
              <p className="text-sm text-muted-foreground mt-4">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_300px]">
              <div className="space-y-12">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Scale className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
                  </div>
                  <div className="prose prose-invert text-muted-foreground leading-relaxed">
                    <p>
                      By accessing and using BioLink Hub ("the Service"), you agree to be bound by these Terms of Service. 
                      These Terms apply to all visitors, users, and others who access or use the Service.
                    </p>
                    <p className="mt-4">
                      If you disagree with any part of the terms, then you may not access the Service.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">2. User Accounts & Security</h2>
                  </div>
                  <div className="prose prose-invert text-muted-foreground leading-relaxed">
                    <p>
                      When you create an account with us, you must provide us information that is accurate, complete, and current at all times. 
                      Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                      <li>You are responsible for safeguarding the password that you use to access the Service.</li>
                      <li>You agree not to disclose your password to any third party.</li>
                      <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">3. Content & Conduct</h2>
                  </div>
                  <div className="prose prose-invert text-muted-foreground leading-relaxed">
                    <p>
                      Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content").
                      You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                    </p>
                    <p className="mt-4">
                      We reserve the right to terminate accounts that post content which is:
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                      <li>Illegal, unlawful, or promotes illegal activity.</li>
                      <li>Defamatory, discriminatory, or mean-spirited.</li>
                      <li>Spam, machine-generated, or randomly generated.</li>
                      <li>Containing viruses or other malicious code.</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">4. Termination</h2>
                  </div>
                  <div className="prose prose-invert text-muted-foreground leading-relaxed">
                    <p>
                      We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                    <p className="mt-4">
                      All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
                    </p>
                  </div>
                </section>
              </div>

              <div className="hidden md:block">
                <div className="sticky top-24 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><a href="#acceptance" className="hover:text-primary transition-colors">Acceptance of Terms</a></li>
                    <li><a href="#accounts" className="hover:text-primary transition-colors">User Accounts</a></li>
                    <li><a href="#content" className="hover:text-primary transition-colors">Content Guidelines</a></li>
                    <li><a href="#termination" className="hover:text-primary transition-colors">Termination</a></li>
                  </ul>
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-xs text-muted-foreground">
                      Questions about our terms? <br />
                      <a href="mailto:support@mound.lol" className="text-primary hover:underline">Contact Support</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}