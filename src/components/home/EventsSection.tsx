import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const upcomingEvents = [
  {
    id: 1,
    title: "Youth Fellowship Night",
    date: "Jan 10, 2026",
    time: "5:00 PM",
    location: "Youth Hall",
    description: "An evening of worship, games, and fellowship for young people.",
    featured: true,
  },
  {
    id: 2,
    title: "Marriage Enrichment Seminar",
    date: "Jan 17, 2026",
    time: "9:00 AM - 2:00 PM",
    location: "Conference Room",
    description: "Strengthen your marriage with biblical principles and practical guidance.",
    featured: false,
  },
];

const announcements = [
  {
    id: 1,
    title: "Choir Auditions Open",
    date: "Jan 15, 2026",
    category: "Ministry",
  },
];

export function EventsSection() {
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
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group bg-card border border-border rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.05)] hover:!shadow-[0_12px_24px_rgba(0,0,0,0.1)] hover:!-translate-y-[3px] hover:scale-[1.005] transition-all duration-300 ${
                    event.featured ? "border-l-4 border-l-red-300" : ""
                  }`}
                >
                  {event.featured && (
                    <span className="inline-block px-3 py-1 bg-church-gold/10 text-church-red rounded-full text-xs font-semibold mb-3">
                      Featured Event
                    </span>
                  )}
                  <h3 className="font-body font-semibold text-xl text-foreground mb-3 group-hover:text-church-red transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 group-hover:text-red-400 transition-colors">
                      <Calendar className="w-4 h-4 text-church-red transition-transform duration-300 group-hover:scale-105" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1.5 group-hover:text-red-400 transition-colors">
                      <Clock className="w-4 h-4 text-church-red transition-transform duration-300 group-hover:scale-105" />
                      {event.time}
                    </span>
                    <span className="flex items-center gap-1.5 group-hover:text-red-400 transition-colors">
                      <MapPin className="w-4 h-4 text-church-red transition-transform duration-300 group-hover:scale-105" />
                      {event.location}
                    </span>
                  </div>
                </motion.div>
              ))}
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
