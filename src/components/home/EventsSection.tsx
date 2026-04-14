import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('home_events_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0]) // Only future events
      .order('date', { ascending: true })
      .limit(3); // Show only 3 recent events

    if (!error && data) {
      setEvents(data.map(event => ({
        id: event.id,
        title: event.title,
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        time: event.time || 'TBD',
        location: event.location || 'TBD',
        description: event.description || 'Join us for this upcoming event.',
        category: event.category || 'General',
        featured: event.is_featured || false,
        image: event.image_url
      })));
    }
    setLoading(false);
  };

  const announcements = [
    {
      id: 1,
      title: "Choir Auditions Open",
      date: "Jan 15, 2026",
      category: "Ministry",
    },
  ];
  return (
    <section className="py-20 lg:py-28 bg-church-light-blue">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Events Column */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="inline-block px-4 py-1.5 bg-church-gold/10 text-church-red rounded-full text-sm font-medium mb-4">
                Upcoming Events
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
                Join Our Community Activities
              </h2>
            </motion.div>

            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-10 text-muted-foreground">Loading events...</div>
              ) : events.length > 0 ? (
                events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-card relative border border-border rounded-2xl overflow-hidden shadow-[0_3px_10px_rgba(0,0,0,0.06)] hover:!shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 w-full"
                  >
                    {/* Left Accent Bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ba1a1a]" />

                    <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-6">
                      {/* Left Content */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="px-4 py-1.5 bg-[#5b21b6]/10 text-[#5b21b6] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                            {event.category}
                          </span>
                          {event.featured && (
                            <span className="px-4 py-1.5 bg-[#ffdad5] text-[#ba1a1a] rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                              Featured
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-bold text-xl text-[#1c1b1b] mb-2 group-hover:text-[#ba1a1a] transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-[#5e5e5e] text-sm leading-relaxed mb-3">{event.description}</p>
                      </div>

                      {/* Right Details Panel */}
                      <div className="md:w-[260px] flex flex-col justify-between gap-4 md:border-l md:border-border md:pl-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-[#1c1b1b] text-sm">
                            <Calendar className="w-4 h-4 text-[#ba1a1a]" />
                            <span className="font-semibold">{event.date}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#1c1b1b] text-sm">
                            <Clock className="w-4 h-4 text-[#ba1a1a]" />
                            <span className="font-semibold">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[#1c1b1b] text-sm">
                            <MapPin className="w-4 h-4 text-[#ba1a1a]" />
                            <span className="font-semibold">{event.location}</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-[#1e3a8a] text-white hover:bg-[#1e40af] rounded-lg font-bold shadow-md shadow-[#1e3a8a]/20"
                        >
                          Join Now
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">No upcoming events at this time.</div>
              )}
            </div>

            <div className="mt-8">
              <Button variant="churchOutline" size="lg" asChild>
                <Link to="/events" className="flex items-center gap-2">
                  View All Events
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Announcements Column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <span className="inline-block px-4 py-1.5 bg-church-deep-blue/10 text-church-deep-blue rounded-full text-sm font-medium mb-4">
                Announcements
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                Stay Informed
              </h2>
            </motion.div>

            <div className="space-y-4">
              {announcements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:!shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:!-translate-y-[3px] hover:scale-[1.005] transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block px-2 py-0.5 bg-muted text-church-red rounded text-xs font-medium mb-2">
                        {announcement.category}
                      </span>
                      <h4 className="font-medium text-foreground transition-colors font-body">
                        {announcement.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {announcement.date}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Links Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-gradient-holy rounded-2xl p-5 text-white shadow-lg"
            >
              <h4 className="font-body font-semibold text-lg mb-2">
                Need Prayer?
              </h4>
              <p className="text-white/80 text-sm mb-5 leading-tight">
                Submit your prayer request and our prayer team will intercede on your behalf.
              </p>
              <Button size="sm" className="w-full bg-white/10 border border-white/20 text-xs hover:bg-white/20" asChild>
                <Link to="/prayer">Submit Prayer Request</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
