import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/649416000_122208445154563087_2317423105924190548_n.jpg";
import prayerImage from "@/assets/7.jpeg";
import youthImage from "@/assets/4.jpeg";
import conventionImage from "@/assets/619910776_122202868574563087_1389364340991551083_n.jpg";



const blogPosts = [
  {
    id: 1,
    title: "Walking in Divine Purpose: A New Year Message",
    excerpt: "Discover how to align your daily life with God's ultimate plan for you in this inspiring year-round guide...",
    author: "Pastor James Mensah",
    date: "Jan 15, 2026",
    category: "Inspiration",
    image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    title: "Highlights from the Solid Foundation 2026",
    excerpt: "Relive the powerful moments of worship, deliverance, and transformation from our recent convention...",
    author: "Elder Grace Owusu",
    date: "Jan 12, 2026",
    category: "Church News",
    image: conventionImage,
  },
  {
    id: 3,
    title: "The Power of Persistent Prayer",
    excerpt: "Common challenges in prayer and how to overcome them to see the manifest power of God in your life...",
    author: "Deacon Samuel Asante",
    date: "Jan 08, 2026",
    category: "Testimony",
    image: prayerImage,
  },
  {
    id: 4,
    title: "Building a Stronger Family Foundation",
    excerpt: "Scriptural principles for raising godly children and maintaining a peaceful, Christ-centered home in the modern age...",
    author: "Deaconess Martha Boateng",
    date: "Jan 05, 2026",
    category: "Family Life",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 5,
    title: "Youth Ministry: The Future is Now",
    excerpt: "How our young people are leading the charge in digital missions and local community outreach projects...",
    author: "Elder James Owusu",
    date: "Jan 02, 2026",
    category: "Youth Ministry",
    image: youthImage,
  },
  {
    id: 6,
    title: "Understanding Financial Stewardship",
    excerpt: "Practical tips on managing resources according to kingdom principles of sowing, reaping, and saving...",
    author: "Pastor James Mensah",
    date: "Dec 28, 2025",
    category: "Financial Wisdom",
    image: "https://images.unsplash.com/photo-1454165205744-3b78555e5572?auto=format&fit=crop&q=80&w=800",
  },
];

const categories = ["All", "Inspiration", "Church News", "Testimony", "Family Life", "Youth Ministry"];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-holy text-white relative">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Blog Header"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-hero-overlay" />
          </div>
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium mb-4">
                Inspire & Empower
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Our Blog
              </h1>
              <p className="text-white/80 text-lg">
                Stay updated with voices from our church, spiritual insights, and community news.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 bg-background border-b border-border sticky top-[64px] z-30 shadow-sm">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 h-11"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === category
                        ? "bg-church-red text-white shadow-md shadow-church-red/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-church-cream">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-church-red rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase">
                        <User className="w-3.5 h-3.5" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {post.date}
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-foreground mb-3 leading-tight group-hover:text-church-red transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 font-body">
                      {post.excerpt}
                    </p>
                    <Button variant="ghost" className="p-0 text-church-red hover:text-church-red/80 hover:bg-transparent flex items-center gap-2 group/btn font-bold text-xs uppercase tracking-widest">
                      Read More
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>
            {filteredPosts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
