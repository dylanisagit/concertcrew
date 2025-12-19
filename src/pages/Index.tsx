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
        <ConcertGrid />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
