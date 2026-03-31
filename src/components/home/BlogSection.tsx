import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import prayerImage from "@/assets/7.jpeg";


const featuredPosts = [
  {
    id: 1,
    title: "Walking in Divine Purpose: A New Year Message",
    excerpt: "Discover how to align your daily life with God's ultimate plan for you...",
    author: "Pastor James Mensah",
    date: "Jan 15, 2026",
    category: "Inspiration",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Highlights from the Solid Foundation 2026",
    excerpt: "Relive the powerful moments of worship and transformation...",
    author: "Elder Grace Owusu",
    date: "Jan 12, 2026",
    category: "Church News",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    title: "The Power of Persistent Prayer",
    excerpt: "How to overcome challenges in prayer and see God's manifest power...",
    author: "Deacon Samuel Asante",
    date: "Jan 08, 2026",
    category: "Testimony",
    image: prayerImage,
  },
];

export function BlogSection() {
  return (
    <section className="py-20 lg:py-28 bg-church-cream overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1.5 bg-church-gold/10 text-church-red rounded-full text-sm font-medium mb-4">
              Latest from the Blog
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Inspiring Stories & <span className="text-gradient-red">Divine Insights</span>
            </h2>
            <p className="text-muted-foreground text-lg font-heading">
              Stay connected with our community through faith-filled articles, 
              ministry updates, and testimonies of God's faithfulness.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Button variant="churchOutline" size="lg" asChild className="group">
              <Link to="/blog" className="flex items-center gap-2">
                View All Posts
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-border"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                    <User className="w-3.5 h-3.5" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </div>
                </div>
                <h3 className="font-serif font-bold text-xl text-foreground mb-3 leading-tight group-hover:text-church-red transition-colors line-clamp-2">
                  <Link to={`/blog/${post.id}`}>{post.title}</Link>
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-6 font-body">
                  {post.excerpt}
                </p>
                <Link 
                  to={`/blog/${post.id}`}
                  className="inline-flex items-center gap-2 text-church-red font-bold text-xs uppercase tracking-widest hover:text-church-red/80 transition-colors group/link"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
