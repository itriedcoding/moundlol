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
    <section className="py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
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
              className="group p-8 rounded-3xl bg-black/40 border border-white/10 hover:bg-white/5 transition-all duration-500 backdrop-blur-xl hover:border-primary/30 hover:shadow-[0_0_30px_rgba(255,20,147,0.1)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(255,20,147,0.3)]">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed group-hover:text-white/80 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}