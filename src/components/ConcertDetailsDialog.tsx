import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Music2, ExternalLink, Star } from "lucide-react";
import { format } from "date-fns";
import ConcertDiscussion from "./ConcertDiscussion";

const parseConcertDate = (dateString: string) => {
  const safe = dateString.includes("T") ? dateString : `${dateString}T12:00:00`;
  const d = new Date(safe);
  return isNaN(d.getTime()) ? null : d;
};

interface ConcertDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
  } | null;
}

const ConcertDetailsDialog = ({
  open,
  onOpenChange,
  concert,
}: ConcertDetailsDialogProps) => {
  if (!concert) return null;

  const getStatusBadge = () => {
    switch (concert.ticketStatus) {
      case "thinking":
        return (
          <Badge variant="secondary" className="bg-warning/20 text-warning border-warning/30">
            Contemplating
          </Badge>
        );
      case "purchased":
        return (
          <Badge variant="secondary" className="bg-success/20 text-success border-success/30">
            Ticket Purchased
          </Badge>
        );
      case "not_going":
        return (
          <Badge variant="secondary" className="bg-destructive/20 text-destructive border-destructive/30">
            Not Going
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-muted-foreground/30">
            Concert Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const dateObj = parseConcertDate(concert.date);
  const dateLabel = dateObj ? format(dateObj, "EEEE, MMM do ''yy") : concert.date;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-xl font-bold">{concert.name}</DialogTitle>
            {getStatusBadge()}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Concert Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{concert.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{dateLabel}</span>
            </div>
          </div>

          {concert.description && (
            <div>
              <h4 className="font-medium mb-2">About</h4>
              <p className="text-muted-foreground">{concert.description}</p>
            </div>
          )}

          {concert.review && (
            <div className="glass rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-warning" />
                <h4 className="font-medium">Review</h4>
              </div>
              <p className="text-muted-foreground">{concert.review}</p>
            </div>
          )}

          {/* Links */}
          <div className="flex gap-2 flex-wrap">
            {concert.spotifyUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={concert.spotifyUrl} target="_blank" rel="noopener noreferrer">
                  <Music2 className="w-4 h-4 mr-2" />
                  Listen on Spotify
                </a>
              </Button>
            )}
            {concert.ticketUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={concert.ticketUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get Tickets
                </a>
              </Button>
            )}
          </div>

          {/* Discussion Section */}
          <div className="border-t pt-6">
            <ConcertDiscussion concertId={concert.id} concertName={concert.name} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConcertDetailsDialog;
