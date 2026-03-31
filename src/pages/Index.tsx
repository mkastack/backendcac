import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { WelcomeSection } from "@/components/home/WelcomeSection";
import { SermonsSection } from "@/components/home/SermonsSection";
import { EventsSection } from "@/components/home/EventsSection";
import { MinistriesSection } from "@/components/home/MinistriesSection";
import { GiveSection } from "@/components/home/GiveSection";
import { BlogSection } from "@/components/home/BlogSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <WelcomeSection />
        <SermonsSection />
        <EventsSection />
        <MinistriesSection />
        <BlogSection />
        <GiveSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
