import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Heart, Music, BookOpen, Globe, Mic, Baby, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/546414627_122182576358563087_1189959514236409901_n.jpg";
import musicImage from "@/assets/617650156_122201872118563087_4673335822186223448_n.jpg";
import menImage from "@/assets/649209256_122208442994563087_3519845021812333563_n.jpg";
import womenImage from "@/assets/615875304_122202142484563087_5863192403707978202_n.jpg";
import childrenImage from "@/assets/630903071_122204749082563087_148430488719588598_n.jpg";
import mediaImage from "@/assets/616582907_122201867060563087_8134349422166194362_n.jpg";
import youthImage from "@/assets/569060568_122188550120563087_4196041456379429423_n.jpg";
import { supabase } from "@/lib/supabase";
import { notifyDepartmentHeadWhatsapp } from "@/lib/whatsapp";
import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";

// Seed data removed, now fetching from Supabase

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Join Ministry State
  const [joinModalMinistry, setJoinModalMinistry] = useState<any | null>(null);
  const [joinForm, setJoinForm] = useState({ name: '', phone: '', reason: '', aim: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function fetchMinistries() {
      const { data, error } = await supabase
        .from('ministries')
        .select('*');
      
      if (!error && data) {
        setMinistries(data.map(m => {
          // Map icons from string to Lucide component
          let iconName = m.icon.charAt(0).toUpperCase() + m.icon.slice(1);
          if (iconName === 'Groups') iconName = 'Users';
          if (iconName === 'Public') iconName = 'Globe';
          if (iconName === 'Female') iconName = 'Heart';
          if (iconName === 'Male') iconName = 'Briefcase';
          
          const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Users;
          
          // Assign specific activities based on ministry name
          let activities = [];
          const name = m.name.toLowerCase();
          
          if (name.includes('music') || name.includes('worship') || name.includes('choir')) {
            activities = ["Lead Sunday Worship Services", "Weekly Choir Rehearsals", "Special Music Ministrations", "Vocal & Instrument Training"];
          } else if (name.includes('youth') || name.includes('peniel')) {
            activities = ["Youth Impact Summits", "Skill Development Workshops", "Community Outreach & Evangelism", "Youth Fellowship & Mentorship"];
          } else if (name.includes('children') || name.includes('sunday school') && name.includes('child')) {
            activities = ["Foundational Bible Lessons", "Children's Creative Arts", "Memory Verse Recitations", "Annual Children's Day Celebration"];
          } else if (name.includes('women') || name.includes('virtuous')) {
            activities = ["Women of Virtue Prayer Meetings", "Home & Family Management Seminars", "Business & Empowerment Talks", "Outreach to Widows & Orphans"];
          } else if (name.includes('men') || name.includes('king')) {
            activities = ["Men's Prayer & Leadership Manuals", "Father-Child Mentoring Projects", "Health & Fitness Seminars", "Fellowship & Charity Outreach"];
          } else if (name.includes('media') || name.includes('technical') || name.includes('it')) {
            activities = ["Digital Content Creation", "Live Streaming Management", "Audio & Visual Engineering", "Social Media Engagement"];
          } else if (name.includes('prayer') || name.includes('intercessor')) {
            activities = ["24/7 Prayer Chain Service", "Monthly Night Vigils", "Intercessory Prayer for Nations", "School of Prayer Workshops"];
          } else if (name.includes('evangelism') || name.includes('mission') || name.includes('outreach')) {
            activities = ["Market & Community Outreach", "Prison & Hospital Ministrations", "Gospel Crusade Support", "Discipleship & Follow-up"];
          } else if (name.includes('usher') || name.includes('protocol') || name.includes('hospitality')) {
            activities = ["First Impression Management", "Congregation Order & Seating", "Warm Welcome Protocols", "Venue Logistics Support"];
          } else if (name.includes('welfare') || name.includes('charity')) {
            activities = ["Benevolence To Needy Members", "Hospital & Home Visits", "Educational Support Schemes", "Clothing & Food Drives"];
          } else if (name.includes('education') || name.includes('bible study') || name.includes('school')) {
            activities = ["In-depth Bible Doctrines", "Theological Studies Units", "Faith-Based Career Guidance", "New Converts Classes"];
          } else {
            activities = m.activities && m.activities.length > 0 ? m.activities : ["Weekly Fellowship Meetings", "Faith-Building Seminars", "Community Service Projects", "Biblical Leadership Training"];
          }
          
          return {
            id: m.id,
            name: m.name,
            description: m.description,
            activities: m.activities || activities,
            icon: IconComponent,
            color: "bg-church-red",
            image: m.image_url || heroImage
          };
        }));
      }
      setLoading(false);
    }
    fetchMinistries();
  }, []);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinModalMinistry) return;
    
    setIsSubmitting(true);
    setSubmitMessage({ type: '', text: '' });

    const { error } = await supabase.from('ministry_join_requests').insert([
      {
        ministry_id: joinModalMinistry.id,
        name: joinForm.name,
        phone: joinForm.phone,
        reason: joinForm.reason,
        aim: joinForm.aim,
        status: 'Pending'
      }
    ]);

    if (!error) {
      try {
        const whatsappResult = await notifyDepartmentHeadWhatsapp({
          ministryName: joinModalMinistry.name,
          requesterName: joinForm.name,
          requesterPhone: joinForm.phone,
          reason: joinForm.reason,
          aim: joinForm.aim
        });

        if (whatsappResult.success) {
          setSubmitMessage({
            type: 'success',
            text: 'Request submitted successfully! WhatsApp opened automatically with your message - please click Send to notify the ministry head.'
          });
        } else {
          setSubmitMessage({
            type: 'warning',
            text: `Request submitted successfully! However, WhatsApp notification failed: ${whatsappResult.error || 'Unknown error'}. The ministry head will be notified through other means.`
          });
        }
      } catch (notifyError) {
        console.warn('Failed to send WhatsApp notification:', notifyError);
        setSubmitMessage({
          type: 'warning',
          text: 'Request submitted successfully! However, WhatsApp notification failed. The ministry head will be notified through other means.'
        });
      }
    }
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
                Our Ministries
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Find Your Place to Serve
              </h1>
              <p className="text-white/80 text-lg">
                Discover various ministries where you can use your gifts to serve God 
                and contribute to our church family.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Ministries List */}
        <section className="py-20 bg-church-cream">
          <div className="container mx-auto px-6">
            <div className="space-y-16">
              {loading ? (
                <div className="text-center py-20 text-muted-foreground">Loading ministries...</div>
              ) : ministries.length > 0 ? (
                ministries.map((ministry, index) => (
                <motion.div
                  key={ministry.id}
                  id={ministry.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="scroll-mt-32"
                >
                  <div className={`group bg-card border border-border rounded-3xl overflow-hidden shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:!-translate-y-[3px] hover:scale-[1.005] transition-all duration-300 ${
                    index % 2 === 0 ? "" : "lg:flex-row-reverse"
                  }`}>
                    <div className="grid lg:grid-cols-2">
                      <div className={`p-8 sm:p-12 ${index % 2 === 0 ? "" : "lg:order-2"}`}>
                        <div className={`w-16 h-16 rounded-2xl ${ministry.color} flex items-center justify-center mb-6 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-black/10`}>
                          <ministry.icon className="w-8 h-8 text-white transition-all duration-300 transform group-hover:drop-shadow-md" />
                        </div>
                        <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                          {ministry.name}
                        </h2>
                        <p className="text-muted-foreground text-sm mb-6 text-justify leading-tight">
                          {ministry.description}
                        </p>
                        <div className="mb-8">
                          <h4 className="font-semibold text-foreground mb-3">Key Activities:</h4>
                          <ul className="grid grid-cols-2 gap-2">
                            {ministry.activities.map((activity) => (
                              <li key={activity} className="flex items-center gap-2 text-muted-foreground">
                                <span className="w-1.5 h-1.5 rounded-full bg-church-gold" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {ministry.contact && (
                          <div className="mb-6">
                            <h4 className="font-semibold text-foreground mb-2">Contact:</h4>
                            <a
                              href={`https://wa.me/${ministry.contact.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-church-gold hover:text-church-gold/80 transition-colors"
                            >
                              <span className="material-symbols-outlined text-sm">call</span>
                              {ministry.contact}
                            </a>
                          </div>
                        )}
                        <Button 
                          variant="churchPrimary" 
                          onClick={() => setJoinModalMinistry(ministry)}
                        >
                          Join This Ministry
                        </Button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-0">
                          <img
                            src={ministry.image || heroImage}
                            alt={`${ministry.name} activities`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40" />
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
              ) : (
                <div className="text-center py-20 text-muted-foreground">Check back soon for ministry updates.</div>
              )}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="pt-16 pb-28 lg:pb-36 bg-gradient-holy text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl font-bold mb-4">
              Ready to Get Involved?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              We'd love to help you find the right ministry for your gifts and calling. 
              Contact us to learn more about how you can serve.
            </p>
            <Button className="bg-red-500 text-white" size="lg">
              Contact Ministry Office
            </Button>
          </div>
        </section>
      </main>

      {/* Join Ministry Modal */}
      {joinModalMinistry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md bg-white/80 backdrop-blur-2xl border border-white/50 rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] relative"
          >
            <div className="p-5 border-b border-white/40 flex justify-between items-center bg-white/40">
              <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                <joinModalMinistry.icon className="w-5 h-5 text-church-red" />
                Join {joinModalMinistry.name}
              </h3>
              <button 
                onClick={() => setJoinModalMinistry(null)}
                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleJoinSubmit} className="p-5 space-y-4">
              {submitMessage.text && (
                <div className={`p-3 rounded-lg text-sm font-medium ${submitMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {submitMessage.text}
                </div>
              )}
              
              <div>
                <label className="block text-[13px] font-bold text-foreground/80 mb-1 drop-shadow-sm">Your Full Name <span className="text-church-red">*</span></label>
                <input 
                  required
                  type="text"
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:border-church-red focus:bg-white/90 focus:ring-2 focus:ring-church-red/20 outline-none transition-all placeholder:text-foreground/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] text-sm"
                  value={joinForm.name}
                  onChange={e => setJoinForm({...joinForm, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-foreground/80 mb-1 drop-shadow-sm">Phone Number <span className="text-church-red">*</span></label>
                <input 
                  required
                  type="tel"
                  placeholder="e.g. +1 (123) 456-7890"
                  className="w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:border-church-red focus:bg-white/90 focus:ring-2 focus:ring-church-red/20 outline-none transition-all placeholder:text-foreground/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] text-sm"
                  value={joinForm.phone}
                  onChange={e => setJoinForm({...joinForm, phone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-[13px] font-bold text-foreground/80 mb-1 drop-shadow-sm">Why do you want to join this ministry? <span className="text-church-red">*</span></label>
                <textarea 
                  required
                  rows={2}
                  placeholder="Tell us a bit about your passion or calling..."
                  className="w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:border-church-red focus:bg-white/90 focus:ring-2 focus:ring-church-red/20 outline-none transition-all resize-none placeholder:text-foreground/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] text-sm"
                  value={joinForm.reason}
                  onChange={e => setJoinForm({...joinForm, reason: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-foreground/80 mb-1 drop-shadow-sm">What is your main aim for joining? <span className="text-church-red">*</span></label>
                <textarea 
                  required
                  rows={2}
                  placeholder="e.g. To serve the community..."
                  className="w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-xl focus:border-church-red focus:bg-white/90 focus:ring-2 focus:ring-church-red/20 outline-none transition-all resize-none placeholder:text-foreground/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] text-sm"
                  value={joinForm.aim}
                  onChange={e => setJoinForm({...joinForm, aim: e.target.value})}
                />
              </div>

              <div className="pt-1">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || submitMessage.type === 'success'}
                  className="w-full bg-church-red hover:bg-church-red/90 text-white py-5 text-[15px] font-bold rounded-xl shadow-lg shadow-church-red/20 transition-all active:scale-95"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
