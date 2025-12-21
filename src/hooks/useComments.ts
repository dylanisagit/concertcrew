import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Comment {
  id: string;
  concert_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: {
    display_name: string;
    avatar_url: string | null;
  };
}

export const useComments = (concertId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();

  const fetchComments = async () => {
    setLoading(true);
    
    // First get comments
    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("*")
      .eq("concert_id", concertId)
      .order("created_at", { ascending: true });

    if (commentsError) {
      console.error("Error fetching comments:", commentsError);
      setLoading(false);
      return;
    }

    // Then get profiles for the comment authors
    if (commentsData && commentsData.length > 0) {
      const userIds = [...new Set(commentsData.map(c => c.user_id))];
      
      // Note: Due to RLS, users can only see their own profile
      // For other users' display names, we'll need to fetch via a public view or function
      // For now, we'll fetch what we can and use fallback for others
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);

      const profilesMap = new Map(
        profilesData?.map(p => [p.user_id, { display_name: p.display_name, avatar_url: p.avatar_url }]) || []
      );

      const commentsWithProfiles = commentsData.map(comment => ({
        ...comment,
        profile: profilesMap.get(comment.user_id) || { display_name: "Concert Enthusiast", avatar_url: null }
      }));

      setComments(commentsWithProfiles);
    } else {
      setComments([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (concertId) {
      fetchComments();
    }
  }, [concertId]);

  useEffect(() => {
    if (!concertId) return;

    // Subscribe to realtime updates for comments on this concert
    const channel = supabase
      .channel(`comments_${concertId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `concert_id=eq.${concertId}`,
        },
        () => {
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [concertId]);

  const addComment = async (content: string, concertName: string) => {
    if (!user) {
      toast.error("Please sign in to leave a comment");
      return false;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      toast.error("Comment cannot be empty");
      return false;
    }

    if (trimmedContent.length > 1000) {
      toast.error("Comment is too long (max 1000 characters)");
      return false;
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        concert_id: concertId,
        user_id: user.id,
        content: trimmedContent,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment");
      return false;
    }

    // Send notification email
    try {
      await supabase.functions.invoke("send-notification", {
        body: {
          type: "new_comment",
          userName: profile?.display_name || "A user",
          concertName,
          commentContent: trimmedContent,
        },
      });
    } catch (e) {
      console.error("Failed to send notification:", e);
      // Don't block the comment from being added
    }

    // Add to local state with profile
    const newComment: Comment = {
      ...data,
      profile: {
        display_name: profile?.display_name || "You",
        avatar_url: profile?.avatar_url || null,
      },
    };
    
    setComments((prev) => [...prev, newComment]);
    toast.success("Comment added!");
    return true;
  };

  const deleteComment = async (commentId: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
      return false;
    }

    setComments((prev) => prev.filter((c) => c.id !== commentId));
    toast.success("Comment deleted");
    return true;
  };

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refetch: fetchComments,
  };
};
