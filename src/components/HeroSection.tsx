import { Link } from "react-router-dom";
import heroConcert from "@/assets/hero-concert.jpg";
const HeroSection = () => {
  return <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${heroConcert})`
    }} />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      
      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-12">
        <div className="max-w-2xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          <span className="bg-transparent text-slate-900 text-6xl font-sans font-bold">Dylan's Concert Crew</span>
        </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg">Browse upcoming shows that piqued Dylan's interest and let him know if you're similarly intrigued through the Discuss feature. Hit the I'm Interested button to let him know who's going to which gigs. The playlist below contains 3 solid tracks from each of the artists. And if you'd like a little regret, <Link to="/attended" className="underline text-primary hover:text-primary/80">check out the shows that the Crew have already attended</Link>.</p>
        </div>
      </div>
    </section>;
};
export default HeroSection;
