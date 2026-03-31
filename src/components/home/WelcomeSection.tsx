import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WelcomeSection() {
  return (
    <section className="py-20 lg:py-28 bg-church-cream">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-church-gold/10 text-church-red rounded-full text-sm font-medium mb-4">
              Welcome to Our Church
            </span>
            <h2 className="font-body text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
              Experience God's Love in Our{" "}
              <span className="text-gradient-red font-bold">Community</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-tight text-justify mb-4 font-heading">
              Christ Apostolic Church International - Bubiashie Central is a vibrant 
              community of believers committed to spreading the Gospel of Jesus Christ. 
              We welcome you with open hearts to experience the transforming power of 
              God's love.
            </p>
            <p className="text-muted-foreground text-sm leading-tight text-justify mb-6">
              Whether you're seeking spiritual growth, fellowship, or a place to call 
              home, our doors are always open. Join us for worship, connect with our 
              ministries, and become part of our family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="churchPrimary" size="lg" asChild>
                <Link to="/about">Learn More About Us</Link>
              </Button>
              <Button variant="churchOutline" size="lg" asChild>
                <Link to="/contact">Plan Your Visit</Link>
              </Button>
            </div>
          </motion.div>

          {/* Right Stats/Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid gap-6"
          >
            {[
              {
                icon: Users,
                title: "Vibrant Community",
                description: "Join a loving family of believers from all walks of life, united in faith and purpose.",
              },
              {
                icon: Heart,
                title: "Spirit-Filled Worship",
                description: "Experience powerful worship services that touch hearts and transform lives through the Holy Spirit.",
              },
              {
                icon: Globe,
                title: "Global Mission",
                description: "Part of a worldwide movement spreading the Gospel and making disciples of all nations.",
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group flex gap-4 p-5 bg-card border border-border rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:!shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:!-translate-y-[3px] hover:scale-[1.005] transition-all duration-300 cursor-default"
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-xl bg-church-gold/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-[1px] group-hover:bg-church-gold/20 group-hover:shadow-md group-hover:shadow-black/5">
                    <feature.icon className="w-7 h-7 text-church-red transition-all duration-300 transform group-hover:drop-shadow-sm" />
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-base text-foreground mb-1.5 transition-colors group-hover:text-church-red">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-body">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
