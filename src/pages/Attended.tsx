import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Music } from "lucide-react";
import { Loader2 } from "lucide-react";

interface Concert {
  id: string;
  name: string;
  date: string;
  venue: string;
  review: string | null;
  image_url: string | null;
  spotify_url: string | null;
}

const Attended = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttended = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("concerts")
        .select("id, name, date, venue, review, image_url, spotify_url")
        .eq("ticket_status", "purchased")
        .lt("date", today)
        .order("date", { ascending: false });

      if (!error && data) {
        setConcerts(data);
      }
      setLoading(false);
    };

    fetchAttended();
  }, []);

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-6">
              <Music className="w-7 h-7 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold">Concerts Attended</h1>
            </div>

            <div className="mb-8">
              <iframe
                style={{ borderRadius: "12px" }}
                src="https://open.spotify.com/embed/playlist/3d6INysqVh4jxayaAO2mtR?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Attended Concerts Playlist"
              />
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : concerts.length === 0 ? (
              <div className="glass rounded-xl p-12 text-center">
                <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No concerts attended yet</h3>
                <p className="text-muted-foreground">
                  Past concerts with purchased tickets will appear here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {concerts.map((concert) => (
                  <Card key={concert.id} className="glass border-border/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <CardTitle className="text-lg md:text-xl">{concert.name}</CardTitle>
                        <Badge variant="secondary" className="bg-primary/20 text-primary shrink-0">
                          Attended
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(concert.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {concert.venue}
                        </span>
                      </div>
                    </CardHeader>
                    {concert.review && (
                      <CardContent>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm font-medium mb-1 text-muted-foreground">Review</p>
                          <p className="text-sm whitespace-pre-wrap">{concert.review}</p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Attended;
