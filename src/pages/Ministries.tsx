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

const ministries = [
  {
    id: "men",
    name: "Men's Ministry",
    description: "Empowering men to lead with faith, integrity, and purpose. Our men's fellowship provides biblical teaching, mentorship, and support for men of all ages.",
    activities: ["Monthly Men's Breakfast", "Bible Study Groups", "Mentorship Program", "Community Outreach"],
    icon: Briefcase,
    color: "bg-blue-500",
    image: menImage,
  },
  {
    id: "women",
    name: "Women's Ministry",
    description: "Building strong women of virtue, prayer, and purpose. We nurture spiritual growth through fellowship, teaching, and service.",
    activities: ["Women's Fellowship", "Prayer Meetings", "Annual Conference", "Skill Development"],
    icon: Heart,
    color: "bg-pink-500",
    image: womenImage,
  },
  {
    id: "youth",
    name: "Youth Ministry",
    description: "Inspiring and equipping the next generation for Christ. Our youth programs engage teenagers and young adults with relevant, spirit-filled activities.",
    activities: ["Friday Youth Night", "Youth Camp", "Drama & Music", "Leadership Training"],
    icon: Music,
    color: "bg-purple-500",
    image: youthImage,
  },
  {
    id: "children",
    name: "Children's Church",
    description: "Teaching children the foundations of faith in fun and engaging ways. Every Sunday, children experience worship, Bible stories, and activities designed for them.",
    activities: ["Sunday School", "Vacation Bible School", "Children's Choir", "Family Events"],
    icon: Baby,
    color: "bg-green-500",
    image: childrenImage,
  },
  {
    id: "media",
    name: "Media & Technical",
    description: "Using technology to extend our reach and enhance worship. Our media team handles sound, video, livestreaming, and digital communication.",
    activities: ["Live Streaming", "Sound & Lighting", "Social Media", "Video Production"],
    icon: Mic,
    color: "bg-cyan-500",
    image: mediaImage,
  },
  {
    id: "music",
    name: "Music Ministry",
    description: "Leading worship through music and song. Our music ministry creates an atmosphere of praise through choirs, bands, and instrumental performances.",
    activities: ["Choir Practice", "Worship Team", "Instrumental Ensemble", "Special Music Events"],
    icon: Music,
    color: "bg-indigo-500",
    image: musicImage,
  },
];

export default function MinistriesPage() {
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
              {ministries.map((ministry, index) => (
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
                        <Button variant="churchPrimary">Join This Ministry</Button>
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
              ))}
            </div>
          </div>
        </section>

        {/* Join CTA */}
        <section className="py-16 bg-gradient-holy text-white">
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
      <Footer />
    </div>
  );
}
