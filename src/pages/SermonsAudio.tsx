import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BookOpen, Clock, User, Download, Search, Filter, Mic, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-church.jpg";
import { supabase } from "@/lib/supabase";

// Seed data removed, now fetching from Supabase

const topics = ["All Topics", "Spiritual Warfare", "Grace", "Holy Spirit", "Rest", "Forgiveness", "Wisdom"];

export default function AudioSermonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSermons() {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .not('audio_url', 'is', null)
        .order('date', { ascending: false });
      
      if (!error && data) {
        setSermons(data.map(s => ({
          id: s.id,
          title: s.title,
          preacher: s.speaker,
          date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          readTime: "Audio",
          topic: s.type || "General",
          excerpt: s.description || "Tune in to hear this inspiring message.",
          audioUrl: s.audio_url
        })));
      }
      setLoading(false);
    }
    fetchSermons();
  }, []);

  const filteredSermons = sermons.filter((sermon) => {
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
                Audio Sermons
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-6">
                Read Our Sermons
              </h1>
              <p className="text-white/80 text-lg">
                Dive deep into the Word with our collection of written sermons for personal study.
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

        {/* Sermons List */}
        <section className="py-16 bg-church-cream">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">Loading audio sermons...</p>
              </div>
            ) : filteredSermons.length > 0 ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                {filteredSermons.map((sermon, index) => (
                  <motion.article
                    key={sermon.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_5px_15px_rgba(0,0,0,0.15)] hover:!-translate-y-[3px] transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-church-gold/10 flex items-center justify-center transition-colors">
                          <Mic className="w-8 h-8 text-red-500  transition-colors" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 bg-church-light-blue text-church-deep-blue dark:bg-church-gold/10 dark:text-church-gold rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
                          {sermon.topic}
                        </span>
                        <h3 className="font-serif font-semibold text-xl text-foreground mb-2 group-hover:text-red-500 transition-colors">
                          {sermon.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">{sermon.excerpt}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            {sermon.preacher}
                          </span>
                          <span>{sermon.date}</span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            {sermon.readTime}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 flex sm:flex-col gap-2">
                        <Button className="bg-church-gold hover:bg-church-gold/90 text-white" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="border-church-gold text-church-gold hover:bg-church-gold/10" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
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
              Prefer to Watch?
            </h2>
            <p className="text-white mb-6">
              Watch our video sermons for a more immersive experience.
            </p>
            <Button className="text-white border border-white bg-transparent" size="lg" asChild>
              <Link to="/sermons/video">Browse Video Sermons</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
