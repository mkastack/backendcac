import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-church.jpg";

const bibleVerses = [
  {
    verse: "For where two or three gather in my name, there am I with them.",
    reference: "Matthew 18:20",
  },
  {
    verse: "Trust in the Lord with all your heart and lean not on your own understanding.",
    reference: "Proverbs 3:5",
  },
  {
    verse: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
  },
  {
    verse: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
  },
];

export function HeroSection() {
  const [currentVerse, setCurrentVerse] = useState(0);
  const handleWatchLive = () => {
    window.open("https://www.youtube.com/@cacint_bubiashiecentral", "_blank");
  };

  const handleVisitUs = () => {
    window.open("https://maps.app.goo.gl/B6mkb6Tn4fRpaKdj7", "_blank", "noopener noreferrer");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVerse((prev) => (prev + 1) % bibleVerses.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Church sanctuary"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
      </div>

      {/* Floating Light Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-church-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-church-gold/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Welcome Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="
  inline-block
  max-w-full
  px-3 sm:px-4
  py-2
  rounded-full
  bg-white/10
  backdrop-blur-sm
  text-white/90
  text-xs sm:text-sm
  font-medium
  border border-white/20
  text-center
  break-words
">
  ✝️ Welcome to Christ Apostolic Church International
</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight"
          >
            A Place of{" "}
            <span className="text-gradient-red font-heading">Faith</span>,{" "}
            <br className="hidden sm:block" />
            Hope & Transformation
          </motion.h1>

          {/* Bible Verse Carousel */}
          <div className="h-24 md:h-20 mb-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVerse}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <p className="text-white/90 text-lg md:text-xl italic max-w-2xl mx-auto">
                  "{bibleVerses[currentVerse].verse}"
                </p>
                <p className="text-church-brown font-semibold mt-2 drop-shadow-sm">
                  — {bibleVerses[currentVerse].reference}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Verse Indicators */}
          <div className="flex justify-center gap-2 mb-10">
            {bibleVerses.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVerse(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentVerse
                    ? "bg-white w-8"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to verse ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="xl"
              onClick={handleWatchLive}
              className="flex items-center gap-2 bg-gradient-red text-white hover:opacity-90 transition-opacity"
            >
              <Play className="h-5 w-5" />
              Watch Live
            </Button>

            <Button 
              size="lg"
              variant="heroOutline"
              onClick={handleVisitUs}
              className="bg-transparent"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Visit Us
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator 
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 h-1.5 bg-white/50 rounded-full"
          />
        </div>
      </motion.div>
      */}
    </section>
  );
}
