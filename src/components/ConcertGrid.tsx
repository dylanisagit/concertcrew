import ConcertCard from "./ConcertCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConcerts } from "@/hooks/useConcerts";
import { Calendar, History, Loader2 } from "lucide-react";

const ConcertGrid = () => {
  const { 
    loading, 
    toggleInterest, 
    isInterested, 
    getInterestedCount,
    getUpcomingConcerts,
    getPastConcerts 
  } = useConcerts();

  const upcomingConcerts = getUpcomingConcerts();
  const pastConcerts = getPastConcerts();

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
                {upcomingConcerts.map(concert => (
                  <ConcertCard
                    key={concert.id}
                    concert={{
                      id: concert.id,
                      name: concert.name,
                      date: new Date(concert.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }),
                      venue: concert.venue,
                      ticketStatus: concert.ticket_status || 'pending',
                      description: concert.description || undefined,
                      ticketUrl: concert.ticket_url || undefined,
                      spotifyUrl: concert.spotify_url || undefined,
                      imageUrl: concert.image_url || undefined,
                    }}
                    isInterested={isInterested(concert.id)}
                    onToggleInterest={() => toggleInterest(concert.id)}
                    interestedCount={getInterestedCount(concert.id)}
                  />
                ))}
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
                {pastConcerts.map(concert => (
                  <ConcertCard
                    key={concert.id}
                    concert={{
                      id: concert.id,
                      name: concert.name,
                      date: new Date(concert.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }),
                      venue: concert.venue,
                      ticketStatus: concert.ticket_status || 'pending',
                      description: concert.description || undefined,
                      review: concert.review || undefined,
                      ticketUrl: concert.ticket_url || undefined,
                      spotifyUrl: concert.spotify_url || undefined,
                      imageUrl: concert.image_url || undefined,
                    }}
                    isInterested={isInterested(concert.id)}
                    onToggleInterest={() => toggleInterest(concert.id)}
                    interestedCount={getInterestedCount(concert.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default ConcertGrid;
