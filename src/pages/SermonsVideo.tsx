import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Play, Clock, User, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-church.jpg";
import Image from "@/assets/2.jpeg"

const videoSermons = [
  {
    id: 1,
    title: "Walking in Faith: Trusting God's Plan",
    preacher: "Pastor James Mensah",
    date: "Jan 1, 2026",
    duration: "45 min",
    topic: "Faith",
    thumbnail: Image,
    videoUrl: "#",
  },
  {
    id: 2,
    title: "The Power of Prayer in Difficult Times",
    preacher: "Elder Grace Owusu",
    date: "Dec 29, 2025",
    duration: "38 min",
    topic: "Prayer",
    thumbnail: Image,
    videoUrl: "#",
  },
  {
    id: 3,
    title: "Living a Life of Purpose",
    preacher: "Pastor James Mensah",
    date: "Dec 25, 2025",
    duration: "52 min",
    topic: "Purpose",
    thumbnail: Image,
    videoUrl: "#",
  },
  {
    id: 4,
    title: "The Joy of Salvation",
    preacher: "Pastor James Mensah",
    date: "Dec 22, 2025",
    duration: "41 min",
    topic: "Salvation",
    thumbnail: Image,
    videoUrl: "#",
  },
  {
    id: 5,
    title: "Building Strong Families",
    preacher: "Elder Grace Owusu",
    date: "Dec 18, 2025",
    duration: "48 min",
    topic: "Family",
    thumbnail: Image,
    videoUrl: "#",
  },
  {
    id: 6,
    title: "Overcoming Fear with Faith",
    preacher: "Pastor James Mensah",
    date: "Dec 15, 2025",
    duration: "44 min",
    topic: "Faith",
    thumbnail: Image,
    videoUrl: "#",
  },
];

const topics = ["All Topics", "Faith", "Prayer", "Purpose", "Salvation", "Family"];

export default function VideoSermonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");

  const filteredSermons = videoSermons.filter((sermon) => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "All Topics" || sermon.topic === selectedTopic;
    return matchesSearch && matchesTopic;
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
              alt="Church sanctuary"
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
                Video Sermons
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-6">
                Watch Our Sermons
              </h1>
              <p className="text-white/80 text-lg">
                Experience powerful messages that will strengthen your faith and transform your life.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-background border-b border-border sticky top-20 z-30">
          <div className="container mx-auto px-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search sermons..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
                {topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      selectedTopic === topic
                        ? "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Sermons Grid */}
        <section className="py-16 bg-church-cream">
          <div className="container mx-auto px-6">
            {filteredSermons.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSermons.map((sermon, index) => (
                  <motion.article
                    key={sermon.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-card border border-border rounded-2xl shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_5px_15px_rgba(0,0,0,0.15)] hover:!-translate-y-[3px] transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative overflow-hidden aspect-video">
                      <img
                        src={sermon.thumbnail}
                        alt={sermon.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-church-deep-blue/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                          <Play
                          onClick={() => window.open(sermon.videoUrl, "_blank")}
                          className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/10 text-white rounded-full text-xs font-medium">
                        {sermon.topic}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif font-semibold text-lg text-foreground mb-3 group-hover:text-red-500 transition-colors">
                        {sermon.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <User className="w-4 h-4" />
                        {sermon.preacher}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">{sermon.date}</span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {sermon.duration}
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No sermons found matching your criteria.</p>
              </div>
            )}
          </div>

            {/* View All Button */}
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => window.open("https://www.youtube.com/@cacint_bubiashiecentral", "_blank")}
          >
            View All Sermons
          </Button>
        </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-background relative">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Church sanctuary"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-hero-overlay" />
          </div>
          <div className="container mx-auto px-6 text-center relative">
            <h2 className="font-serif text-2xl font-bold text-white mb-4">
              Prefer to Read?
            </h2>
            <p className="text-white mb-6">
              Access our collection of written sermons for deeper study.
            </p>
            <Button className="text-white border border-white bg-transparent" size="lg" asChild>
              <Link to="/sermons/text">Browse Text Sermons</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
