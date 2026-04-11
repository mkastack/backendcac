import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-church.jpg";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

// Seed events removed, now fetching from Supabase

const categoryColors: Record<string, string> = {
  Prayer: "bg-blue-100/10 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  Youth: "bg-purple-100/10 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  Family: "bg-pink-100/10 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400",
  Women: "bg-rose-100/10 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400",
  Children: "bg-green-100/10 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  Men: "bg-amber-100/10 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

const defaultCategoryColor = "bg-muted text-muted-foreground";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-gradient-holy text-white relative">
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
                Events & Programs
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Upcoming Events
              </h1>
              <p className="text-white/80 text-lg">
                Join us for worship, fellowship, and life-changing events. There's something for everyone!
              </p>
            </motion.div>
          </div>
        </section>

        {/* Events Grid */}
        <section className="py-20 bg-church-cream">
          <div className="container mx-auto px-6">
            <div className="flex flex-col gap-8">
              {loading ? (
                <div className="lg:col-span-2 text-center py-12 text-muted-foreground">Loading events...</div>
              ) : events.length > 0 ? (
                events.map((event, index)  => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`bg-card relative border border-border rounded-2xl overflow-hidden shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-300 w-full ${
                      event.is_featured ? "ring-1 ring-[#ba1a1a]/10" : ""
                    }`}
                  >
                    {/* Left Accent Bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ba1a1a]" />

                    <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-6">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${categoryColors[event.category] || defaultCategoryColor}`}>
                            {event.category}
                          </span>
                          {event.is_featured && (
                            <span className="px-4 py-1.5 bg-[#ffdad5] text-[#ba1a1a] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1c1b1b] mb-2 leading-tight group-hover:text-[#ba1a1a] transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-[#5e5e5e] text-base leading-relaxed mb-4 max-w-2xl">{event.description}</p>
                      </div>

                      {/* Right Details Panel */}
                      <div className="md:w-[280px] flex flex-col sm:flex-row md:flex-col justify-between gap-4 md:border-l md:border-border md:pl-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-4 text-[#1c1b1b]">
                            <div className="p-2 bg-neutral-100 rounded-lg text-[#ba1a1a]">
                              <Calendar className="w-5 h-5 shrink-0" />
                            </div>
                            <span className="font-semibold text-sm">{event.date}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[#1c1b1b]">
                            <div className="p-2 bg-neutral-100 rounded-lg text-[#ba1a1a]">
                              <Clock className="w-5 h-5 shrink-0" />
                            </div>
                            <span className="font-semibold text-sm">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-4 text-[#1c1b1b]">
                            <div className="p-2 bg-neutral-100 rounded-lg text-[#ba1a1a]">
                              <MapPin className="w-5 h-5 shrink-0" />
                            </div>
                            <span className="font-semibold text-sm">{event.location}</span>
                          </div>
                        </div>

                        <Button 
                          className="w-full h-12 bg-[#1e3a8a] text-white hover:bg-[#1e40af] rounded-lg font-bold shadow-md shadow-[#1e3a8a]/20 transition-all active:scale-[0.98]"
                        >
                          Join Now
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))) : (
                <div className="lg:col-span-2 text-center py-12 text-muted-foreground">Check back soon for upcoming events!</div>
              )}
            </div>
          </div>
        </section>



        {/* Calendar CTA */}
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
            <div className="max-w-2xl mx-auto">
              <Calendar className="w-16 h-16 text-church-red mx-auto mb-6" />
              <h2 className="font-serif text-3xl font-bold text-white mb-4">
                Never Miss an Event
              </h2>
              <p className="text-white mb-6">
                Subscribe to our newsletter to receive updates about upcoming events, 
                programs, and special announcements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-md mx-auto px-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-12 text-center bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-church-gold text-foreground placeholder:text-muted-foreground"
                />
                <Button className="h-12 px-8 bg-church-red text-white hover:bg-church-red/90 transition-all font-bold">Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
