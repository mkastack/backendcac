import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock, Send, Facebook, Youtube, Instagram, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-church.jpg";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
  };

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
                Get In Touch
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-white/80 text-lg">
                We'd love to hear from you. Reach out for inquiries, prayer requests, or to plan your visit.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-20 bg-church-cream">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xl">
                  {/* Header Bar */}
                  <div className="bg-church-deep-blue py-4 text-center">
                    <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                      Get In Touch With Us Now!
                    </h3>
                  </div>

                  {/* 2x2 Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 border-collapse">
                    {/* Phone Section */}
                    <div className="p-8 text-center border-b sm:border-r border-border hover:bg-muted/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-church-gold/10 flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-6 h-6 text-church-deep-blue dark:text-church-gold" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2 text-lg">Phone Number</h4>
                      <p className="text-muted-foreground text-sm">+233 XX XXX XXXX</p>
                      <p className="text-muted-foreground text-sm">+233 XX XXX XXXX</p>
                    </div>

                    {/* Email Section */}
                    <div className="p-8 text-center border-b border-border hover:bg-muted/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-church-gold/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-6 h-6 text-church-deep-blue dark:text-church-gold" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2 text-lg">Email</h4>
                      <p className="text-muted-foreground text-sm break-all">christapostolicchurchbubiashie@gmail.com</p>
                    </div>

                    {/* Location Section */}
                    <div className="p-8 text-center border-b sm:border-b-0 sm:border-r border-border hover:bg-muted/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-church-gold/10 flex items-center justify-center mx-auto mb-4">
                        <MapPin className="w-6 h-6 text-church-deep-blue dark:text-church-gold" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2 text-lg">Location</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        Christ Apostolic Church International<br />
                        Bubiashie Central, Accra, Ghana
                      </p>
                    </div>

                    {/* Service Times Section */}
                    <div className="p-8 text-center hover:bg-muted/30 transition-colors">
                      <div className="w-12 h-12 rounded-full bg-church-gold/10 flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-6 h-6 text-church-deep-blue dark:text-church-gold" />
                      </div>
                      <h4 className="font-bold text-foreground mb-2 text-lg">Service Times</h4>
                      <div className="space-y-1">
                        <p className="text-muted-foreground text-sm">Sun: 8:00 AM & 10:30 AM</p>
                        <p className="text-muted-foreground text-sm">Wed: 6:00 PM | Fri: 6:00 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Footer */}
                  <div className="p-6 bg-muted/20 border-t border-border flex flex-col items-center gap-4">
                    <h4 className="font-semibold text-foreground uppercase text-xs tracking-wider">Follow Us</h4>
                    <div className="flex gap-4">
                      {[
                        { icon: Facebook, label: "Facebook" },
                        { icon: Youtube, label: "YouTube" },
                        { icon: Instagram, label: "Instagram" },
                      ].map((social) => (
                        <a
                          key={social.label}
                          href="#"
                          className="w-10 h-10 rounded-full bg-muted text-foreground flex items-center justify-center hover:bg-church-gold hover:text-white transition-all duration-300 shadow-sm"
                          aria-label={social.label}
                        >
                          <social.icon className="w-4 h-4" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

               
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8">
                  Send Us a Message
                </h2>

                {submitted ? (
                  <div className="bg-card border border-border rounded-2xl p-12 shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_5px_15px_rgba(0,0,0,0.15)] hover:!-translate-y-[3px] transition-all duration-300 text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                      Message Sent!
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We'll respond as soon as possible.
                    </p>
                    <Button 
                      variant="churchOutline"
                      onClick={() => {
                        setSubmitted(false);
                        setForm({ name: "", email: "", phone: "", subject: "", message: "" });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-8 shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_5px_15px_rgba(0,0,0,0.15)] hover:!-translate-y-[3px] transition-all duration-300 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name *
                        </label>
                        <Input
                          type="text"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Phone Number
                        </label>
                        <Input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+233 XX XXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Subject *
                        </label>
                        <Input
                          type="text"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          placeholder="How can we help?"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <Textarea
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Write your message here..."
                        rows={5}
                        required
                      />
                    </div>
                    <Button type="submit" variant="churchPrimary" className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                )}
              </motion.div>
            </div>
                 {/* Map Placeholder */}
                <div className="mt-10 bg-church-light-blue rounded-2xl h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-20 text-church-red mx-auto mb-3" />
                    <p className="text-muted-foreground">Interactive map coming soon</p>
                  </div>
                </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
