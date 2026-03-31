import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Users, Heart, Music, BookOpen, Globe, Mic } from "lucide-react";

const ministries = [
  {
    id: "men",
    name: "Men's Ministry",
    description: "Empowering men to lead with faith and integrity",
    icon: Users,
  },
  {
    id: "women",
    name: "Women's Ministry",
    description: "Building strong women of virtue and prayer",
    icon: Heart,
  },
  {
    id: "youth",
    name: "Youth Ministry",
    description: "Inspiring the next generation for Christ",
    icon: Music,
  },
  {
    id: "children",
    name: "Children's Church",
    description: "Teaching kids the foundations of faith",
    icon: BookOpen,
  },
  {
    id: "media",
    name: "Media Team",
    description: "Reaching the world through technology",
    icon: Mic,
  },
  {
    id: "music",
    name: "Music Ministry",
    description: "Leading worship through music and song",
    icon: Music,
  },
];

export function MinistriesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-church-gold/10 text-church-red rounded-full text-sm font-medium mb-4">
            Our Ministries
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Find Your Place to Serve
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover various ministries where you can use your gifts to serve God 
            and contribute to our church family.
          </p>
        </motion.div>

        {/* Ministries Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ministries.map((ministry, index) => (
            <motion.div
              key={ministry.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                to={`/ministries#${ministry.id}`}
                className="block group h-full"
              >
                <div className="relative h-full bg-church-cream rounded-2xl p-8 transition-all duration-300 group-hover:bg-church-deep-blue group-hover:!shadow-[0_20px_40px_rgba(0,0,0,0.12)] group-hover:!-translate-y-[3px] group-hover:scale-[1.005] overflow-hidden shadow-[0_3px_10px_rgba(0,0,0,0.08)]">
                  {/* Decorative Circle */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-church-gold/10 group-hover:bg-white/10 transition-colors" />
                  
                  <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-church-gold/10 group-hover:bg-white/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 active:scale-95 group-hover:shadow-lg group-hover:shadow-black/5">
                      <ministry.icon className="w-7 h-7 text-church-red group-hover:text-white transition-all duration-300 transform group-hover:drop-shadow-sm" />
                    </div>
                    <h3 className="font-serif font-semibold text-xl text-foreground group-hover:text-white mb-2 transition-colors">
                      {ministry.name}
                    </h3>
                    <p className="text-muted-foreground group-hover:text-white/80 transition-colors">
                      {ministry.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
