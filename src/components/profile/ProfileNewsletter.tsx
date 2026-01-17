import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ProfileNewsletterProps {
  user: any;
  username: string;
}

export function ProfileNewsletter({ user, username }: ProfileNewsletterProps) {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const subscribe = useMutation(api.analytics.addEmailSubscriber);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username) return;
    
    setIsSubscribing(true);
    try {
      await subscribe({ username, email, source: "profile_page" });
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!user.newsletterActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-6 bg-black/30 backdrop-blur-xl border border-white/10 rounded-3xl text-center"
    >
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
        <Mail className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{user.newsletterHeading}</h3>
      <p className="text-white/60 mb-6">{user.newsletterDescription}</p>
      <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm mx-auto">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
          required
        />
        <Button type="submit" disabled={isSubscribing}>
          {isSubscribing ? "..." : "Join"}
        </Button>
      </form>
    </motion.div>
  );
}
