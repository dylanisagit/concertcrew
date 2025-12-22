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
          <span className="text-gradient font-extrabold bg-transparent text-slate-900 text-6xl">Dylan's Concert Crew</span>
        </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg">Browse upcoming shows that piqued Dylan's interest and let him know if you're similarly intrigued through the Discuss feature. Hit the "I'm Interested" button to let him know who's going to which gigs.</p>
        </div>
      </div>
    </section>;
};
export default HeroSection;