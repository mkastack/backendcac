import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Play, Clock, User, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-church.jpg";
import Image from "@/assets/2.jpeg"
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/Skeleton";

const topics = ["All Topics", "Faith", "Prayer", "Purpose", "Salvation", "Family"];
const PAGE_SIZE = 9;

export default function VideoSermonsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All Topics");
  const [sermons, setSermons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchSermons = async () => {
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .not('video_url', 'is', null)
      .order('date', { ascending: false });
    
    if (!error && data) {
      setSermons(data.map(s => ({
        id: s.id,
        title: s.title,
        preacher: s.speaker,
        date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        duration: "Sermon",
        topic: s.type || "General",
        thumbnail: s.thumbnail_url || Image,
        videoUrl: s.video_url
      })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSermons();

    const channel = supabase
      .channel('video_sermons_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sermons' }, () => {
        fetchSermons();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTopic]);

  const filteredSermons = sermons.filter((sermon) => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "All Topics" || sermon.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  const totalPages = Math.ceil(filteredSermons.length / PAGE_SIZE);
  const paginatedSermons = filteredSermons.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-gradient-holy text-white relative">
          <div className="absolute inset-0">
            <img src={heroImage} alt="Church sanctuary" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-hero-overlay" />
          </div>
          <div className="container mx-auto px-6 relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 bg-[#9e2016]/10 text-white border border-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-lg mb-4">Video Sermons</span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-6">Watch Our Sermons</h1>
              <p className="text-white/80 text-lg">Experience powerful messages that will strengthen your faith and transform your life.</p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 bg-background border-b border-border sticky top-20 z-30">
          <div className="container mx-auto px-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input type="text" placeholder="Search sermons..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
                <Filter className="w-5 h-5 text-muted-foreground shrink-0" />
                {topics.map((topic) => (
                  <button key={topic} onClick={() => setSelectedTopic(topic)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedTopic === topic ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
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
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="flex justify-between pt-4 border-t border-border">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedSermons.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedSermons.map((sermon, index) => (
                  <motion.article key={sermon.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-card border border-border rounded-2xl shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_5px_15px_rgba(0,0,0,0.15)] hover:!-translate-y-[3px] transition-all duration-300 overflow-hidden">
                    <div className="relative overflow-hidden aspect-video">
                      <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 flex items-center justify-center transition-colors duration-500 cursor-pointer" onClick={() => window.open(sermon.videoUrl, "_blank")}>
                        <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:bg-red-600 transition-all duration-300 group-hover:scale-110 shadow-2xl">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </div>
                      <span className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-[#9e2016] text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-2xl border border-white/20 z-10">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/40 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Video Sermon
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="font-serif font-semibold text-lg text-foreground mb-3 group-hover:text-red-500 transition-colors">{sermon.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <User className="w-4 h-4" />{sermon.preacher}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-sm text-muted-foreground">{sermon.date}</span>
                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />{sermon.duration}
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12 flex-wrap">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:border-red-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {getPageNumbers().map((page, i) =>
                  page === '...' ? (
                    <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">...</span>
                  ) : (
                    <button key={page} onClick={() => setCurrentPage(Number(page))}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${currentPage === page ? 'bg-red-500 text-white shadow-md' : 'border border-border text-muted-foreground hover:border-red-500 hover:text-red-500'}`}>
                      {page}
                    </button>
                  )
                )}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-border text-muted-foreground hover:border-red-500 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Result count */}
            {!loading && filteredSermons.length > 0 && (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredSermons.length)}–{Math.min(currentPage * PAGE_SIZE, filteredSermons.length)} of {filteredSermons.length} sermons
              </p>
            )}

            <div className="text-center mt-10">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                onClick={() => window.open("https://www.youtube.com/@cacint_bubiashiecentral", "_blank")}>
                View All Sermons on YouTube
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pt-16 pb-28 lg:pb-36 bg-background relative">
          <div className="absolute inset-0">
            <img src={heroImage} alt="Church sanctuary" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-hero-overlay" />
          </div>
          <div className="container mx-auto px-6 text-center relative">
            <h2 className="font-serif text-2xl font-bold text-white mb-4">Prefer to Read?</h2>
            <p className="text-white mb-6">Access our collection of written sermons for deeper study.</p>
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
