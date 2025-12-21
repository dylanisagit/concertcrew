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
          <span className="text-gradient bg-primary-foreground text-primary text-5xl font-extrabold">Dylan's Concert Crew</span>
        </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
            Plan concerts with friends. Browse upcoming shows, mark your interest, 
            and coordinate who's going to which gigs.
          </p>
        </div>
      </div>
    </section>;
};
export default HeroSection;