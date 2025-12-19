import { Music, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  isLoggedIn?: boolean;
  userName?: string;
  onLoginClick?: () => void;
}

const Header = ({ isLoggedIn = false, userName, onLoginClick }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gradient">Concert Crew</h1>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{userName}</span>
              </div>
            </div>
          ) : (
            <Button 
              onClick={onLoginClick}
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-primary-foreground"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
