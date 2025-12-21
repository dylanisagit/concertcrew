import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Concert {
  id: string;
  name: string;
  description: string | null;
  date: string;
  venue: string;
  ticket_status: string | null;
  ticket_url: string | null;
  spotify_url: string | null;
  image_url: string | null;
  review: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConcertInterest {
  id: string;
  concert_id: string;
  user_id: string;
  interest_level: string;
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string | null;
  email: string | null;
}

export const useConcerts = () => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [interests, setInterests] = useState<ConcertInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchConcerts = async () => {
    const { data, error } = await supabase
      .from("concerts")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching concerts:", error);
      return;
    }

    setConcerts(data || []);
  };

  const fetchInterests = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("concert_interests")
      .select("*");

    if (error) {
      console.error("Error fetching interests:", error);
      return;
    }

    setInterests(data || []);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchConcerts(), fetchInterests()]);
      setLoading(false);
    };

    loadData();

    // Subscribe to realtime updates for interests
    const channel = supabase
      .channel("concert_interests_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "concert_interests",
        },
        () => {
          fetchInterests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const toggleInterest = async (concertId: string) => {
    if (!user) {
      toast.error("Please sign in to mark your interest");
      return;
    }

    const existingInterest = interests.find(
      (i) => i.concert_id === concertId && i.user_id === user.id
    );

    if (existingInterest) {
      const { error } = await supabase
        .from("concert_interests")
        .delete()
        .eq("id", existingInterest.id);

      if (error) {
        toast.error("Failed to update interest");
        return;
      }

      setInterests(interests.filter((i) => i.id !== existingInterest.id));
      toast.success("Interest removed");
    } else {
      // Get concert name for notification
      const concert = concerts.find(c => c.id === concertId);
      
      const { data, error } = await supabase
        .from("concert_interests")
        .insert({
          concert_id: concertId,
          user_id: user.id,
          interest_level: "interested",
        })
        .select()
        .single();

      if (error) {
        toast.error("Failed to mark interest");
        return;
      }

      setInterests([...interests, data]);
      toast.success("Marked as interested!");

      // Send notification (fire and forget)
      if (concert) {
        supabase.functions.invoke("send-notification", {
          body: {
            type: "new_interest",
            userName: user.email?.split("@")[0] || "Someone",
            concertName: concert.name,
          },
        }).catch(err => console.error("Failed to send interest notification:", err));
      }
    }
  };

  const isInterested = (concertId: string) => {
    if (!user) return false;
    return interests.some(
      (i) => i.concert_id === concertId && i.user_id === user.id
    );
  };

  const getInterestedCount = (concertId: string) => {
    return interests.filter((i) => i.concert_id === concertId).length;
  };

  const getUpcomingConcerts = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return concerts.filter((concert) => {
      const concertDate = new Date(concert.date);
      return concertDate >= now;
    });
  };

  const getPastConcerts = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return concerts.filter((concert) => {
      const concertDate = new Date(concert.date);
      return concertDate < now;
    }).reverse();
  };

  return {
    concerts,
    interests,
    loading,
    toggleInterest,
    isInterested,
    getInterestedCount,
    getUpcomingConcerts,
    getPastConcerts,
    refetch: fetchConcerts,
  };
};
