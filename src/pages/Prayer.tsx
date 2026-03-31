import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Send, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/514032381_122169086210563087_2234518162042499617_n.jpg";
import heroImage2 from "@/assets/10.jpeg";

const testimonies = [
  {
    id: 1,
    name: "Sarah A.",
    testimony: "God healed me from a chronic illness after the church prayed for me. I am forever grateful for this community of faith!",
    date: "Dec 2025",
  },
  {
    id: 2,
    name: "Emmanuel K.",
    testimony: "Through the men's ministry, I found deliverance from addiction and restored my relationship with my family. Praise God!",
    date: "Nov 2025",
  },
  {
    id: 3,
    name: "Grace M.",
    testimony: "The Lord blessed me with a job after 8 months of unemployment. The prayer team stood with me, and God answered!",
    date: "Oct 2025",
  },
];

export default function PrayerPage() {
  const [prayerForm, setPrayerForm] = useState({
    name: "",
    email: "",
    request: "",
    isAnonymous: false,
  });
  const [testimonyForm, setTestimonyForm] = useState({
    name: "",
    email: "",
    testimony: "",
  });
  const [prayerSubmitted, setPrayerSubmitted] = useState(false);
  const [testimonySubmitted, setTestimonySubmitted] = useState(false);
  const { toast } = useToast();

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPrayerSubmitted(true);
    toast({
      title: "Prayer Request Submitted",
      description: "Our prayer team will lift your request to God.",
    });
  };

  const handleTestimonySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTestimonySubmitted(true);
    toast({
      title: "Testimony Submitted",
      description: "Thank you for sharing what God has done!",
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
              className="w-full h-full object-cover object-center"
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
                Prayer & Testimonies
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                We're Here to Pray With You
              </h1>
              <p className="text-white/80 text-sm leading-tight max-w-2xl mx-auto">
                Submit your prayer request and share your testimony. Our prayer team is ready to stand with you in faith.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Prayer Request Form */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:!shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-church-gold/10 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-7 h-7 text-church-red" />
                    </div>
                    <div>
                      <h2 className="font-serif text-3xl font-bold text-foreground">
                        Prayer Request
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">We stand with you in faith.</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                    Whatever you're going through, you don't have to face it alone. 
                    Share your prayer request and our dedicated prayer team will intercede on your behalf.
                  </p>

                  {prayerSubmitted ? (
                    <div className="bg-background border border-border rounded-2xl p-8 text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                        Request Received
                      </h3>
                      <p className="text-muted-foreground">
                        Our prayer team will lift your request to God. May you experience His peace and provision.
                      </p>
                      <Button 
                        variant="churchOutline" 
                        className="mt-6"
                        onClick={() => setPrayerSubmitted(false)}
                      >
                        Submit Another Request
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handlePrayerSubmit} className="space-y-6">
                      <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={prayerForm.isAnonymous}
                          onChange={(e) => setPrayerForm({ ...prayerForm, isAnonymous: e.target.checked })}
                          className="w-5 h-5 rounded border-border accent-church-red"
                        />
                        <label htmlFor="anonymous" className="text-sm font-medium text-foreground cursor-pointer">
                          Submit anonymously
                        </label>
                      </div>
                      {!prayerForm.isAnonymous && (
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Your Name
                            </label>
                            <Input
                              type="text"
                              value={prayerForm.name}
                              onChange={(e) => setPrayerForm({ ...prayerForm, name: e.target.value })}
                              placeholder="Enter your name"
                              className="bg-muted/30 border-border/50 focus:border-church-red transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                              Email (optional)
                            </label>
                            <Input
                              type="email"
                              value={prayerForm.email}
                              onChange={(e) => setPrayerForm({ ...prayerForm, email: e.target.value })}
                              placeholder="Enter your email"
                              className="bg-muted/30 border-border/50 focus:border-church-red transition-all"
                            />
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Your Prayer Request *
                        </label>
                        <Textarea
                          value={prayerForm.request}
                          onChange={(e) => setPrayerForm({ ...prayerForm, request: e.target.value })}
                          placeholder="Share your prayer request..."
                          rows={5}
                          required
                          className="bg-muted/30 border-border/50 focus:border-church-red transition-all resize-none"
                        />
                      </div>
                      <Button type="submit" variant="churchPrimary" className="w-full h-12 text-base font-bold shadow-lg shadow-black/10">
                        <Send className="w-5 h-5 mr-2" />
                        Submit Prayer Request
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>

              {/* Testimony Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:!shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-church-gold/10 flex items-center justify-center shrink-0">
                      <Heart className="w-7 h-7 text-church-red" />
                    </div>
                    <div>
                      <h2 className="font-serif text-3xl font-bold text-foreground">
                        Share Testimony
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">Glorify God with your story.</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                    Has God done something amazing in your life? Share your testimony to encourage others and glorify God!
                  </p>

                  {testimonySubmitted ? (
                    <div className="bg-background border border-border rounded-2xl p-8 text-center">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                        Testimony Submitted
                      </h3>
                      <p className="text-muted-foreground">
                        Thank you for sharing! Your testimony may be featured after review.
                      </p>
                      <Button 
                        variant="churchOutline" 
                        className="mt-6"
                        onClick={() => setTestimonySubmitted(false)}
                      >
                        Share Another Testimony
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleTestimonySubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Your Name *
                          </label>
                          <Input
                            type="text"
                            value={testimonyForm.name}
                            onChange={(e) => setTestimonyForm({ ...testimonyForm, name: e.target.value })}
                            placeholder="Enter your name"
                            required
                            className="bg-muted/30 border-border/50 focus:border-church-red transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Email *
                          </label>
                          <Input
                            type="email"
                            value={testimonyForm.email}
                            onChange={(e) => setTestimonyForm({ ...testimonyForm, email: e.target.value })}
                            placeholder="Enter your email"
                            required
                            className="bg-muted/30 border-border/50 focus:border-church-red transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Your Testimony *
                        </label>
                        <Textarea
                          value={testimonyForm.testimony}
                          onChange={(e) => setTestimonyForm({ ...testimonyForm, testimony: e.target.value })}
                          placeholder="Share what God has done..."
                          rows={5}
                          required
                          className="bg-muted/30 border-border/50 focus:border-church-red transition-all resize-none"
                        />
                      </div>
                      <Button type="submit" variant="churchPrimary" className="w-full h-12 text-base font-bold shadow-lg shadow-black/10">
                        <Heart className="w-5 h-5 mr-2" />
                        Submit Testimony
                      </Button>
                    </form>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Featured Testimonies */}
        <section className="py-20 bg-church-cream relative">
          <div className="absolute inset-0">
            <img
              src={heroImage2}
              alt="Church sanctuary"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-hero-overlay" />
          </div>
          <div className="container mx-auto px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-sm font-medium mb-4">
                Praise Reports
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                What God Has Done
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonies.map((testimony, index) => (
                <motion.div
                  key={testimony.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-hero-overlay rounded-2xl p-6 shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_5px_15px_rgba(0,0,0,0.15)] hover:!-translate-y-[3px] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-church-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimony.name}</p>
                      <p className="text-sm text-church-red">{testimony.date}</p>
                    </div>
                  </div>
                  <p className="text-white italic text-sm leading-tight">"{testimony.testimony}"</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
