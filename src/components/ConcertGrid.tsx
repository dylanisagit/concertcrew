import { useState, useEffect } from "react";
import ConcertCard from "./ConcertCard";
import ConcertDetailsDialog from "./ConcertDetailsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConcerts } from "@/hooks/useConcerts";
import { Calendar, History, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface ConcertDetails {
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
}

const ConcertGrid = () => {
  const [selectedConcert, setSelectedConcert] = useState<ConcertDetails | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  
  const { 
    loading, 
    concerts,
    toggleInterest, 
    isInterested, 
    getInterestedCount,
    getUpcomingConcerts,
    getPastConcerts 
  } = useConcerts();

  const upcomingConcerts = getUpcomingConcerts();
  const pastConcerts = getPastConcerts();

  useEffect(() => {
    const fetchCommentCounts = async () => {
      if (concerts.length === 0) return;
      
      const { data, error } = await supabase
        .from('comments')
        .select('concert_id');
      
      if (error) {
        console.error('Error fetching comment counts:', error);
        return;
      }

      const counts: Record<string, number> = {};
      data?.forEach(comment => {
        counts[comment.concert_id] = (counts[comment.concert_id] || 0) + 1;
      });
      setCommentCounts(counts);
    };

    fetchCommentCounts();

    // Subscribe to comment changes
    const channel = supabase
      .channel('comment-counts')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        () => fetchCommentCounts()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [concerts]);

  const handleOpenDetails = (concert: ConcertDetails) => {
    setSelectedConcert(concert);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-bold">Concert Schedule</h2>
            <TabsList className="glass">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                <Calendar className="w-4 h-4 mr-2" />
                Upcoming ({upcomingConcerts.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
                <History className="w-4 h-4 mr-2" />
                Past Shows ({pastConcerts.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="upcoming" className="mt-0">
            {upcomingConcerts.length === 0 ? (
              <div className="glass rounded-xl p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No upcoming concerts</h3>
                <p className="text-muted-foreground">Check back later for new shows!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {upcomingConcerts.map(concert => {
                  const concertDetails: ConcertDetails = {
                    id: concert.id,
                    name: concert.name,
                    date: format(new Date(concert.date), "EEEE, MMM do ''yy"),
                    venue: concert.venue,
                    ticketStatus: concert.ticket_status || 'pending',
                    description: concert.description || undefined,
                    ticketUrl: concert.ticket_url || undefined,
                    spotifyUrl: concert.spotify_url || undefined,
                    imageUrl: concert.image_url || undefined,
                  };
                  return (
                    <ConcertCard
                      key={concert.id}
                      concert={concertDetails}
                      isInterested={isInterested(concert.id)}
                      onToggleInterest={() => toggleInterest(concert.id)}
                      interestedCount={getInterestedCount(concert.id)}
                      commentCount={commentCounts[concert.id] || 0}
                      onOpenDetails={() => handleOpenDetails(concertDetails)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-0">
            {pastConcerts.length === 0 ? (
              <div className="glass rounded-xl p-12 text-center">
                <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No past concerts</h3>
                <p className="text-muted-foreground">Your concert history will appear here.</p>
              </div>
            ) : (
              <div className="grid gap-4 opacity-80">
                {pastConcerts.map(concert => {
                  const concertDetails: ConcertDetails = {
                    id: concert.id,
                    name: concert.name,
                    date: format(new Date(concert.date), "EEEE, MMM do ''yy"),
                    venue: concert.venue,
                    ticketStatus: concert.ticket_status || 'pending',
                    description: concert.description || undefined,
                    review: concert.review || undefined,
                    ticketUrl: concert.ticket_url || undefined,
                    spotifyUrl: concert.spotify_url || undefined,
                    imageUrl: concert.image_url || undefined,
                  };
                  return (
                    <ConcertCard
                      key={concert.id}
                      concert={concertDetails}
                      isInterested={isInterested(concert.id)}
                      onToggleInterest={() => toggleInterest(concert.id)}
                      interestedCount={getInterestedCount(concert.id)}
                      commentCount={commentCounts[concert.id] || 0}
                      onOpenDetails={() => handleOpenDetails(concertDetails)}
                    />
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <ConcertDetailsDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          concert={selectedConcert}
        />
      </div>
    </section>
  );
};

export default ConcertGrid;
