import { motion } from "framer-motion";
import { Palette, BarChart3, Zap, Shield, Globe, Smartphone } from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Custom Design",
    description: "Choose from stunning themes or create your own with custom colors, backgrounds, and fonts."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track views, clicks, and engagement with detailed insights to grow your audience."
  },
  {
    icon: Zap,
    title: "Instant Updates",
    description: "Changes appear instantly. No loading times, no caching issues. Just speed."
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description: "Enterprise-grade security and 99.9% uptime ensure your link is always accessible."
  },
  {
    icon: Globe,
    title: "Custom Domain",
    description: "Connect your own domain for a fully branded experience (Coming soon)."
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Optimized for every device, ensuring your profile looks perfect everywhere."
  }
];

export function LandingFeatures() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything you need
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Powerful features to help you share your content and grow your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
