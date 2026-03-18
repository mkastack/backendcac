import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, BookOpen, Clock, User, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "@/assets/image.jpg"

const latestSermons = [
  {
    id: 1,
    title: "Solid Foundation 2026 – Day 25",
    preacher: "Apostle Chris K. Narh",
    date: "Jan 30, 2026",
    duration: "78 min",
    type: "video",
    thumbnail: Image,
    videoUrl: 'https://www.youtube.com/watch?v=-Kep0AGNcZY'
  },
  {
    id: 2,
    title: "SOLID FOUNDATION 2026 - Day 18",
    preacher: "Rev. Dr. George Asante",
    date: "Jan 23, 2026",
    duration: "98 min",
    type: "video",
    thumbnail: Image,
    videoUrl: 'https://www.youtube.com/watch?v=unCT4f16oqw'
  },
  {
    id: 3,
    title: "Solid Foundation 2026 – Day 21",
    preacher: "Rev. Seth Frimpong",
    date: "Jan 26, 2026",
    duration: "61 min",
    type: "video",
    thumbnail: Image,
    videoUrl: 'https://www.youtube.com/watch?v=4BizK_Aispo'
  },
];

export function SermonsSection() {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-church-gold/10 text-red-500 rounded-full text-sm font-medium mb-4">
            Latest Sermons
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Nourish Your Soul with the Word
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-heading">
            Access our library of inspiring sermons. Watch, listen, or read messages 
            that will strengthen your faith and guide your walk with Christ.
          </p>
        </motion.div>

        {/* Sermons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 hover:cursor-pointer">
          {latestSermons.map((sermon, index) => (
            <motion.article
              key={sermon.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 overflow-hidden border border-border"
            >
              {/* Thumbnail */}
              <div className="relative overflow-hidden aspect-video">
                <img
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-church-deep-blue/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    {sermon.type === "video" ? (
                      <Play
                       onClick={() => window.open(sermon.videoUrl, "_blank")}
                      className="w-8 h-8 text-white ml-1" />
                    ) : (
                      <Mic className="w-7 h-7 text-white" />
                    )}
                  </div>
                </div>
                <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                  sermon.type === "video" 
                    ? "bg-white/10 text-white" 
                    : "bg-church-deep-blue text-white"
                }`}>
                  {sermon.type === "video" ? "Video" : "Audio"}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-heading font-semibold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-red-500 transition-colors">
                  {sermon.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-body">
                    <User className="w-4 h-4" />
                    {sermon.preacher}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground">{sermon.date}</span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {sermon.duration}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center gap-4 mx-auto">
          <Button variant="churchPrimary" size="lg" asChild>
            <Link to="/sermons/video" className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Video Sermons
            </Link>
          </Button>
          <Button variant="churchOutline" size="lg" asChild>
            <Link to="/sermons/audio" className="flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Audio Sermons
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
