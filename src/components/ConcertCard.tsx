import { Calendar, MapPin, Ticket, ExternalLink, Music2, MessageCircle, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ConcertCardProps {
  concert: {
    id: string;
    name: string;
    date: string;
    venue: string;
    ticketStatus: string;
    description?: string;
    review?: string;
    ticketUrl?: string;
    spotifyUrl?: string;
    imageUrl?: string;
  };
  interestedCount?: number;
  commentCount?: number;
  isInterested?: boolean;
  onToggleInterest?: () => void;
  onOpenDetails?: () => void;
}

const ConcertCard = ({ 
  concert, 
  interestedCount = 0,
  commentCount = 0,
  isInterested = false,
  onToggleInterest,
  onOpenDetails 
}: ConcertCardProps) => {
  const formatDate = (dateString: string) => {
    // Add noon time to prevent timezone shift issues with date-only strings
    const date = new Date(dateString + "T12:00:00");
    if (isNaN(date.getTime())) {
      return { month: 'TBD', day: '?' };
    }
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return { month, day: day.toString() };
  };

  const { month, day } = formatDate(concert.date);

  const getStatusBadge = () => {
    switch (concert.ticketStatus) {
      case "thinking":
        return <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30">Contemplating</Badge>;
      case "purchased":
        return <Badge variant="secondary" className="bg-success/20 text-success border-success/30">Ticket Purchased</Badge>;
      case "not_going":
        return <Badge variant="secondary" className="bg-destructive/20 text-destructive border-destructive/30">Not Going</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="group glass-hover rounded-xl overflow-hidden">
      <div className="p-5">
        <div className="flex gap-4">
          {/* Date Badge */}
          <div className="flex-shrink-0 w-16 h-20 rounded-lg bg-gradient-primary flex flex-col items-center justify-center text-primary-foreground">
            <span className="text-xs font-medium uppercase">{month}</span>
            <span className="text-2xl font-bold">{day}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground group-hover:text-gradient transition-all truncate">
                {concert.name}
              </h3>
              {getStatusBadge()}
            </div>

            <div className="flex flex-col gap-1.5 mb-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{concert.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{concert.date}</span>
              </div>
            </div>

            {concert.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {concert.description}
              </p>
            )}

            {concert.review && (
              <div className="flex items-start gap-2 mb-4 p-2 rounded-lg bg-muted/50">
                <Star className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {concert.review}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                size="sm"
                variant={isInterested ? "default" : "outline"}
                className={isInterested ? "bg-gradient-primary text-primary-foreground hover:opacity-90" : ""}
                onClick={onToggleInterest}
              >
                <Ticket className="w-4 h-4 mr-1" />
                {isInterested ? "I'm Interested" : "Mark Interest"}
              </Button>

              <Button size="sm" variant="ghost" onClick={onOpenDetails}>
                <MessageCircle className="w-4 h-4 mr-1" />
                Discuss{commentCount > 0 && ` (${commentCount})`}
              </Button>

              {concert.spotifyUrl && (
                <Button size="sm" variant="ghost" asChild>
                  <a href={concert.spotifyUrl} target="_blank" rel="noopener noreferrer">
                    <Music2 className="w-4 h-4 mr-1" />
                    Listen
                  </a>
                </Button>
              )}

              {concert.ticketUrl && (
                <Button size="sm" variant="ghost" asChild>
                  <a href={concert.ticketUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Tickets
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Interested Friends */}
        {interestedCount > 0 && (
          <div className="mt-4 pt-4 border-t border-border/50 flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {interestedCount} {interestedCount === 1 ? 'friend' : 'friends'} interested
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConcertCard;
