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

          <div className="container mx-auto px-6 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <span className="inline-block px-5 py-2 bg-white/10 text-white border border-white/20 backdrop-blur-xl rounded-full text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl mb-8 transition-all hover:bg-white/20">
                Inspire & Empower
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-md">
                Our Blog
              </h1>
              <p className="text-white/80 text-lg md:text-xl">
                Stay updated with voices from our church, spiritual insights, and community news.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 bg-background/80 backdrop-blur-xl border-b border-border sticky top-[64px] z-30 shadow-sm transition-all duration-300">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-4 text-muted-foreground/60" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  className="pl-10 h-11 bg-white/50 dark:bg-black/20 border-white/30 backdrop-blur-sm focus:bg-white dark:focus:bg-black/40 transition-all rounded-xl shadow-inner-soft"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-church-red text-white shadow-lg shadow-church-red/20 scale-105"
                        : "bg-white/40 dark:bg-white/5 text-muted-foreground hover:bg-white/60 dark:hover:bg-white/10 border border-white/20 backdrop-blur-sm"
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
        <section className="pt-20 pb-24 lg:pb-32 bg-church-cream relative overflow-hidden">
          {/* Decorative background elements for glass to pop */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-church-gold/5 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-church-red/5 rounded-full blur-[120px] -ml-64 -mb-64" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card/40 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-soft">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-8 space-y-4">
                      <div className="flex gap-4">
                         <Skeleton className="h-4 w-20" />
                         <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-7 w-full" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-10 w-24 rounded-full" />
                    </div>
                  </div>
                ))
              ) : filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: index * 0.1 }}
                  className="group bg-card/60 dark:bg-card/30 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-3xl overflow-hidden shadow-soft hover:shadow-2xl hover:bg-card/80 hover:-translate-y-2 transition-all duration-500"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-5 left-5">
                      <span className="px-4 py-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-md text-church-red rounded-full text-[10px] font-black uppercase tracking-[0.15em] border border-white/20 shadow-xl">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-5 text-[11px] text-muted-foreground/80 mb-5 pb-5 border-b border-white/10 dark:border-white/5 uppercase tracking-widest font-black">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-church-red/60" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-church-red/60" />
                        {post.date}
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-foreground mb-4 leading-tight group-hover:text-church-red transition-all duration-300 line-clamp-2 drop-shadow-sm">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-[15px] line-clamp-3 mb-8 font-body leading-relaxed group-hover:text-foreground transition-colors duration-300">
                      {post.excerpt}
                    </p>
                    <Button 
                      variant="ghost" 
                      onClick={() => setReadModalPost(post)}
                      className="p-0 text-church-red hover:text-church-red/80 hover:bg-transparent flex items-center gap-3 group/btn font-black text-xs uppercase tracking-[0.2em]"
                    >
                      Read Article
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-2" />
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md transition-all duration-500">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-3xl bg-background/80 dark:bg-card/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/30 dark:border-white/10 relative max-h-[90vh] flex flex-col overflow-hidden"
          >
            <button 
              onClick={() => setReadModalPost(null)}
              className="absolute top-6 right-6 z-20 w-10 h-10 bg-black/40 hover:bg-church-red text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-xl border border-white/20 group"
            >
              <span className="text-xl group-hover:rotate-90 transition-transform">✕</span>
            </button>
            <div className="overflow-y-auto scrollbar-hide flex-1">
              <div className="relative aspect-[16/9] sm:aspect-[21/10] bg-neutral-100 shrink-0">
                <img src={readModalPost.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="px-3 py-1 bg-church-red/90 backdrop-blur-md text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 inline-block shadow-lg border border-white/10">
                    {readModalPost.category}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight drop-shadow-2xl">
                    {readModalPost.title}
                  </h2>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between text-[11px] text-muted-foreground mb-10 pb-10 border-b border-white/10 dark:border-white/5 uppercase tracking-[0.2em] font-black">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-church-red" />
                      {readModalPost.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-church-red" />
                      {readModalPost.date}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleSharePost(readModalPost)}
                    className="w-full md:w-auto bg-white/5 hover:bg-church-red hover:text-white border-white/10 backdrop-blur-sm rounded-xl transition-all duration-300 group shadow-lg"
                  >
                    <Share2 className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Share Article
                  </Button>
                </div>
                <div className="prose prose-lg dark:prose-invert prose-church max-w-none text-foreground/90 leading-relaxed whitespace-pre-wrap font-body">
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
