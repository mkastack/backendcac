import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Target, Heart, BookOpen, Church, Flame, Globe, Star } from "lucide-react";
import heroImage from "@/assets/516146505_122170451588563087_8088452427971609050_n.jpg";
import Image from "@/assets/8.jpeg"
import pastorImage from "@/assets/_MG_5561.jpg"
import associatePastorImage from "@/assets/_MG_5567.jpg"
import deaconAsanteImage from "@/assets/13.jpg"
import revSethImage from "@/assets/653095672_122209342274563087_5467309530285769182_n.jpg"
import elderNewloveImage from "@/assets/15.jpg"
import emmanuelImage from "@/assets/14.jpg"





const historyMilestones = [
  {
    icon: Church,
    year: "Founded",
    title: "A Church is Born",
    description:
      "Christ Apostolic Church International, Bubiashie Central was established by a small but fervent group of believers in the heart of Accra, Ghana. Rooted in prayer and a deep hunger for God, they gathered weekly in a humble room, believing God for greater things.",
  },
  {
    icon: Flame,
    year: "Growth",
    title: "The Fire Spreads",
    description:
      "Fuelled by the Holy Spirit, the assembly grew rapidly. Revival meetings, open-air crusades, and passionate evangelism drew hundreds into the fold. The church became known across Bubiashie as a place of miracles, healing, and genuine transformation.",
  },
  {
    icon: Globe,
    year: "Outreach",
    title: "Community & Beyond",
    description:
      "With growth came responsibility. The church launched outreach programs — feeding the hungry, visiting the sick, supporting widows and orphans — embodying Christ's love in practical ways. Mission teams were sent to surrounding communities and regions.",
  },
  {
    icon: Star,
    year: "Today",
    title: "A Beacon of Hope",
    description:
      "Today, CAC Bubiashie Central stands as a vibrant, Spirit-filled congregation of over 500 families. We continue to build on the foundation laid by our founders — worshipping God, winning souls, and raising the next generation to carry the torch of the Gospel.",
  },
];

const leaders = [
  {
    name: "Pastor James Mensah",
    role: "General Overseer",
    image: pastorImage,
  },
  {
    name: "Elder Grace Owusu",
    role: "Associate Pastor",
    image: associatePastorImage,
  },
  {
    name: "Deacon Samuel Asante",
    role: "Church Administrator",
    image: deaconAsanteImage,
  },
  {
    name: "REV SETH FRIMPONG",
    role: "General Overseer/Head Pastor",
    image: revSethImage,
  },
  {
    name: "Elder John Appiah",
    role: "Youth Pastor",
    image: Image,
  },
  {
    name: "Deaconess Sarah Osei",
    role: "Children's Ministry",
    image: Image,
  },
  {
    name: "Emmanuel Mensah",
    role: "Music Director",
    image: emmanuelImage,
  },
  {
    name: "ELDER NEWLOVE OHENE",
    role: "PRESIDING ELDER",
    image: elderNewloveImage,
  },
];

// Duplicate the array for infinite scrolling effect
const slidingLeaders = [...leaders, ...leaders];

const beliefs = [
  "We believe in one God, eternally existent in three persons: Father, Son, and Holy Spirit.",
  "We believe in the deity of our Lord Jesus Christ, His virgin birth, His sinless life, His miracles.",
  "We believe in the present ministry of the Holy Spirit, by whose indwelling the Christian is enabled to live a godly life.",
  "We believe in the resurrection of both the saved and the lost.",
  "We believe in the spiritual unity of believers in our Lord Jesus Christ.",
];

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [inView, value, count]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function AboutPage() {
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
                About Us
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Our Story & Mission
              </h1>
              <p className="text-white/80 text-lg">
                Learn about our history, vision, and the leadership that guides our church family.
              </p>
            </motion.div>
          </div>
        </section>

        {/* History Section */}
        <section className="py-20 bg-background overflow-hidden">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="inline-block px-4 py-1.5 bg-gradient-red text-white rounded-full text-sm font-medium mb-4">
                Our Story
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Our History
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
                From a small gathering of faithful believers to a thriving community — this is the story 
                of God's faithfulness through the years at CAC Bubiashie Central.
              </p>
            </motion.div>

            {/* Stats Grid — top */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10"
            >
              {[
                { icon: Users, value: 500, suffix: "+", desc: "Members" },
                { icon: Target, value: 25, suffix: "+", desc: "Years of Ministry" },
                { icon: Heart, value: 50, suffix: "+", desc: "Outreach Programs" },
                { icon: BookOpen, value: 6, suffix: "", desc: "Active Ministries" },
              ].map((stat) => (
                <div key={stat.desc} className="group bg-card border border-border rounded-2xl p-6 text-center hover:bg-white dark:hover:bg-white/5 hover:shadow-lg hover:!-translate-y-1 transition-all duration-300 hover:border-church-gold/20">
                  <stat.icon className="w-8 h-8 text-church-red mx-auto mb-3 transition-transform duration-300 group-hover:scale-110" />
                  <p className="font-serif text-3xl font-bold text-foreground">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-muted-foreground text-[13px] mt-1">{stat.desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Scripture Quote */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden mb-14"
            >
              {/* Rich gradient background so glass blur actually shows */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a2e] via-[#1a3050] to-[#0f2a40]" />
              {/* Glowing orbs */}
              <div className="absolute -top-8 -right-8 w-52 h-52 rounded-full bg-church-red/30 blur-3xl" />
              <div className="absolute -bottom-8 -left-8 w-52 h-52 rounded-full bg-church-gold/20 blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-24 rounded-full bg-blue-500/10 blur-2xl" />

              {/* Glass card on top */}
              <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <p className="font-serif text-base italic leading-relaxed mb-3 text-white/90">
                  "For I know the plans I have for you, declares the Lord — plans to prosper you and 
                  not to harm you, plans to give you hope and a future."
                </p>
                <span className="text-white/50 text-xs font-semibold tracking-wider uppercase">
                  Jeremiah 29:11
                </span>
              </div>
            </motion.div>

            {/* Timeline — below */}
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-church-red via-church-gold to-transparent" />

              <div className="space-y-8">
                {historyMilestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative flex gap-6 group"
                  >
                    {/* Icon bubble */}
                    <div className="shrink-0 w-12 h-12 rounded-full bg-church-red/10 border-2 border-church-red/30 flex items-center justify-center z-10 group-hover:bg-church-red group-hover:border-church-red transition-all duration-300">
                      <milestone.icon className="w-5 h-5 text-church-red group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="bg-card border border-border rounded-2xl p-5 flex-1 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                      <span className="inline-block text-xs font-semibold text-church-red uppercase tracking-widest mb-1">
                        {milestone.year}
                      </span>
                      <h3 className="font-serif text-base font-bold text-foreground mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-church-cream">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-card rounded-2xl p-8 border border-border shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:!-translate-y-[3px] hover:scale-[1.005] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-church-gold/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:bg-church-gold/20">
                  <Target className="w-7 h-7 text-church-red" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground text-justify">
                  To be a Spirit-filled, Christ-centered community that transforms lives, 
                  builds strong families, and impacts nations with the Gospel of Jesus Christ.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group bg-card rounded-2xl p-8 border border-border shadow-[0_3px_10px_rgba(0,0,0,0.08)] hover:!shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:!-translate-y-[3px] hover:scale-[1.005] transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-church-gold/10 flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 group-hover:bg-church-gold/20">
                  <Heart className="w-7 h-7 text-church-red" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground text-justify">
                  To worship God, win souls, disciple believers, and demonstrate the love of 
                  Christ through service to our community and beyond.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Statement of Faith */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground text-center mb-10">
                Statement of Faith
              </h2>
              <div className="space-y-4">
                {beliefs.map((belief, index) => (
                  <div key={index} className="flex gap-4 px-5 py-4 min-h-[72px] bg-church-cream rounded-xl justify-start items-center">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-foreground">{belief}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Leadership */}
        <section className="py-20 bg-church-light-blue">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <span className="inline-block px-4 py-1.5 bg-gradient-red text-white rounded-full text-sm font-medium mb-4">
                Our Leadership
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                Meet Our Leaders
              </h2>
            </motion.div>

            <div className="relative overflow-hidden w-full py-4 -mx-4 px-4">
              <div className="flex gap-8 w-max animate-scroll hover:[animation-play-state:paused]">
                {slidingLeaders.map((leader, index) => (
                  <div
                    key={`${leader.name}-${index}`}
                    className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center w-[280px] shrink-0"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif font-semibold text-lg text-foreground whitespace-normal">
                        {leader.name}
                      </h3>
                      <p className="text-church-red text-sm">{leader.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
