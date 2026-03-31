import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-church.jpg";

const events = [
  {
    id: 1,
    title: "Solid Foundation 2026",
    date: "Jan 10, 2026",
    time: "6:00 PM - 8:30 PM",
    location: "Church Premises",
    description: "An evening of worship, and experience faith, hope, and transformation.",
    category: "Youth",
    type: "Join Now",
    featured: true,
  },

];

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
            <div className="grid lg:grid-cols-2 gap-8">
              {events.map((event, index)  => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_5px_15px_rgba(0,0,0,0.15)] hover:!-translate-y-[3px] transition-all duration-300 ${
                    event.featured ? "border-l-4 border-l-church-red lg:col-span-2" : ""
                  }`}
                >
                  <div className={`flex flex-col ${event.featured ? "lg:flex-row lg:gap-8" : ""}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${categoryColors[event.category] || defaultCategoryColor}`}>
                          {event.category}
                        </span>
                        {event.featured && (
                          <span className="px-3 py-1 bg-church-gold/10 text-church-red rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-xl sm:text-2xl text-foreground mb-3">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground mb-6">{event.description}</p>
                    </div>
                    <div className={`${event.featured ? "lg:w-72 lg:border-l lg:border-border lg:pl-8" : ""}`}>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-foreground">
                          <Calendar className="w-5 h-5 text-church-red shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-3 text-foreground">
                          <Clock className="w-5 h-5 text-church-red shrink-0" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-foreground">
                          <MapPin className="w-5 h-5 text-church-red shrink-0" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <Button variant="churchPrimary" className="w-full mt-6">
                       {event.type}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
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
