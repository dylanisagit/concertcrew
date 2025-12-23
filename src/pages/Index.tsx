import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ConcertGrid from "@/components/ConcertGrid";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <section className="py-6">
          <div className="container mx-auto px-4">
            <iframe 
              style={{ borderRadius: '12px' }} 
              src="https://open.spotify.com/embed/playlist/2kyQ9b38Dbw778ZqcPZykD?utm_source=generator&theme=0" 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowFullScreen 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              title="Concert Playlist"
            />
          </div>
        </section>
        <ConcertGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
