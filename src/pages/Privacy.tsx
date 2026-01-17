import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Lock, Eye, Database, Shield, Globe } from "lucide-react";
import { useNavigate } from "react-router";

export default function Privacy() {
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground">
                We value your privacy and are committed to protecting your personal data.
              </p>
              <p className="text-sm text-muted-foreground mt-4">Last updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_300px]">
              <div className="space-y-12">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Database className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
                  </div>
                  <div className="prose prose-invert text-muted-foreground leading-relaxed">
                    <p>
                      We collect several different types of information for various purposes to provide and improve our Service to you.
                    </p>
                    <h3 className="text-white text-lg font-medium mt-4 mb-2">Personal Data</h3>
                    <p>
                      While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
                    </p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Email address</li>
                      <li>First name and last name</li>
                      <li>Cookies and Usage Data</li>
                      <li>Discord Profile Information (when linked)</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Eye className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">2. How We Use Your Data</h2>
                  </div>
                  <div className="prose prose-invert text-muted-foreground leading-relaxed">
                    <p>BioLink Hub uses the collected data for various purposes:</p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                      <li>To provide and maintain the Service</li>
                      <li>To notify you about changes to our Service</li>
                      <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                      <li>To provide customer care and support</li>
                      <li>To provide analysis or valuable information so that we can improve the Service</li>
                      <li>To monitor the usage of the Service</li>
                      <li>To detect, prevent and address technical issues</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">3. Third-Party Services</h2>
                  </div>
                  <div className="prose prose-invert text-muted-foreground leading-relaxed">
                    <p>
                      We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used.
                    </p>
                    <p className="mt-4">
                      These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">4. Security of Data</h2>
                  </div>
                  <div className="prose prose-invert text-muted-foreground leading-relaxed">
                    <p>
                      The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                    </p>
                  </div>
                </section>
              </div>

              <div className="hidden md:block">
                <div className="sticky top-24 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <h3 className="text-lg font-semibold text-white mb-4">Table of Contents</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li><a href="#collection" className="hover:text-primary transition-colors">Information Collection</a></li>
                    <li><a href="#usage" className="hover:text-primary transition-colors">Data Usage</a></li>
                    <li><a href="#third-party" className="hover:text-primary transition-colors">Third-Party Services</a></li>
                    <li><a href="#security" className="hover:text-primary transition-colors">Security</a></li>
                  </ul>
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <p className="text-xs text-muted-foreground">
                      Concerns about your data? <br />
                      <a href="mailto:privacy@mound.lol" className="text-primary hover:underline">Contact Privacy Officer</a>
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