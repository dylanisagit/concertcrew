import { Music, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              Concert Crew — Plan shows with friends
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent fill-accent" />
            <span>for live music lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
