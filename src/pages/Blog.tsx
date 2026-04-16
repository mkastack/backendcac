import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, Calendar, User, ArrowRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/649416000_122208445154563087_2317423105924190548_n.jpg";
import prayerImage from "@/assets/7.jpeg";
import youthImage from "@/assets/4.jpeg";
import conventionImage from "@/assets/619910776_122202868574563087_1389364340991551083_n.jpg";
import { Skeleton } from "@/components/ui/Skeleton";



// Seed data removed, now fetching from Supabase

const categories = ["All", "Inspiration", "Church News", "Testimony", "Family Life", "Youth Ministry"];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [readModalPost, setReadModalPost] = useState<any | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const buildPostUrl = (post: any) => {
    return `${window.location.origin}/blog?post=${encodeURIComponent(post.id)}`;
  };

  const handleSharePost = async (post: any) => {
    const postUrl = buildPostUrl(post);
    const shareData = {
      title: post.title,
      text: post.excerpt || `${post.title} — Read more on our church blog.`,
      url: postUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error: any) {
        if (error?.name === 'AbortError') {
          return;
        }
      }
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        toast({
          title: 'Link copied',
          description: 'The blog article link is ready to paste and open on another device.',
        });
      } catch (error) {
        toast({
          title: 'Unable to copy',
          description: 'Please copy the blog article link manually from the address bar.',
        });
      }
      return;
    }

    toast({
      title: 'Sharing not supported',
      description: 'Use your browser share menu or copy the page link manually.',
    });
  };

  useEffect(() => {
    async function fetchPosts() {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'Published')
        .order('published_at', { ascending: false });
      
      if (!error && data) {
        setBlogPosts(data.map(p => ({
          ...p,
          excerpt: (p.content || '').substring(0, 150) + '...',
          image: p.image_url || heroImage,
          category: p.category || "Inspiration",
          author: p.author || "Church Admin",
          date: p.published_at ? new Date(p.published_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'Recently'
        })));
      }
      setLoading(false);
    }
    fetchPosts();

    // Add Realtime sync
    const channel = supabase
      .channel('public_blog_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'blog_posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (!loading && searchParams.has('post')) {
      const postId = searchParams.get('post');
      const targetPost = blogPosts.find((post) => String(post.id) === postId);
      if (targetPost) {
        setReadModalPost(targetPost);
      }
    }
  }, [loading, searchParams, blogPosts]);

  useEffect(() => {
    if (readModalPost) {
      setSearchParams({ post: String(readModalPost.id) });
    } else if (searchParams.has('post')) {
      setSearchParams({});
    }
  }, [readModalPost, searchParams, setSearchParams]);

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
              <span className="inline-block px-5 py-2 bg-black/40 text-white border border-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-xl mb-6">
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
        <section className="pt-16 pb-24 lg:pb-32 bg-church-cream">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-6 space-y-4">
                      <div className="flex gap-4">
                         <Skeleton className="h-4 w-20" />
                         <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-7 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-10 w-24 rounded-full" />
                    </div>
                  </div>
                ))
              ) : filteredPosts.map((post, index) => (
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
                    <Button 
                      variant="ghost" 
                      onClick={() => setReadModalPost(post)}
                      className="p-0 text-church-red hover:text-church-red/80 hover:bg-transparent flex items-center gap-2 group/btn font-bold text-xs uppercase tracking-widest"
                    >
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

      {/* Read Post Modal */}
      {readModalPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-2xl bg-background dark:bg-card rounded-2xl shadow-2xl border border-border/50 relative max-h-[85vh] flex flex-col overflow-hidden"
          >
            <button 
              onClick={() => setReadModalPost(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-black/40 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-sm shadow-md text-sm"
            >
              ✕
            </button>
            <div className="overflow-y-auto scrollbar-hide flex-1">
              <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-neutral-100 shrink-0">
                <img src={readModalPost.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-[9px] font-bold uppercase tracking-wider mb-2.5 inline-block">
                    {readModalPost.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight drop-shadow-md">
                    {readModalPost.title}
                  </h2>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-[11px] text-muted-foreground mb-6 pb-6 border-b border-neutral-100 uppercase tracking-wider">
                  <div className="flex flex-wrap items-center gap-3 font-bold">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {readModalPost.author}
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {readModalPost.date}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSharePost(readModalPost)}
                    className="w-full max-w-[220px] justify-center md:w-auto"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Article
                  </Button>
                </div>
                <div className="prose prose-base text-foreground/90 dark:text-foreground/80 leading-relaxed whitespace-pre-wrap font-body">
                  {readModalPost.content}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
