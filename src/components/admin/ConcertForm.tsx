import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Music, Ticket, Link as LinkIcon, Save, X } from "lucide-react";

const concertSchema = z.object({
  name: z.string().min(1, "Concert name is required").max(200),
  venue: z.string().min(1, "Venue is required").max(200),
  date: z.string().min(1, "Date is required"),
  description: z.string().max(1000).optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  spotify_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  ticket_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  ticket_status: z.enum(["thinking", "purchased", "not_going"]).optional(),
  review: z.string().max(2000).optional(),
});

type ConcertFormData = z.infer<typeof concertSchema>;

interface ConcertFormProps {
  concertId?: string | null;
  onCancel?: () => void;
  onSaveComplete?: () => void;
}

export const ConcertForm = ({ concertId, onCancel, onSaveComplete }: ConcertFormProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const form = useForm<ConcertFormData>({
    resolver: zodResolver(concertSchema),
    defaultValues: {
      name: "",
      venue: "",
      date: "",
      description: "",
      image_url: "",
      spotify_url: "",
      ticket_url: "",
      ticket_status: "thinking",
      review: "",
    },
  });

  useEffect(() => {
    if (concertId) {
      setIsFetching(true);
      supabase
        .from("concerts")
        .select("*")
        .eq("id", concertId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            toast.error("Failed to load concert");
          } else if (data) {
            form.reset({
              name: data.name,
              venue: data.venue,
              date: data.date,
              description: data.description || "",
              image_url: data.image_url || "",
              spotify_url: data.spotify_url || "",
              ticket_url: data.ticket_url || "",
              ticket_status: (data.ticket_status as "thinking" | "purchased" | "not_going") || "thinking",
              review: data.review || "",
            });
          }
          setIsFetching(false);
        });
    } else {
      form.reset({
        name: "",
        venue: "",
        date: "",
        description: "",
        image_url: "",
        spotify_url: "",
        ticket_url: "",
        ticket_status: "thinking",
        review: "",
      });
    }
  }, [concertId, form]);

  const onSubmit = async (data: ConcertFormData) => {
    if (!user) {
      toast.error("You must be logged in");
      return;
    }

    setIsLoading(true);

    const concertData = {
      name: data.name,
      venue: data.venue,
      date: data.date,
      description: data.description || null,
      image_url: data.image_url || null,
      spotify_url: data.spotify_url || null,
      ticket_url: data.ticket_url || null,
      ticket_status: data.ticket_status || "thinking",
      review: data.review || null,
      created_by: user.id,
    };

    let error;

    if (concertId) {
      const { error: updateError } = await supabase
        .from("concerts")
        .update(concertData)
        .eq("id", concertId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("concerts")
        .insert(concertData);
      error = insertError;
    }

    setIsLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(concertId ? "Concert updated!" : "Concert created!");
      queryClient.invalidateQueries({ queryKey: ["concerts"] });
      form.reset();
      onSaveComplete?.();
    }
  };

  if (isFetching) {
    return (
      <Card className="glass">
        <CardContent className="p-8 flex justify-center">
          <div className="animate-pulse text-muted-foreground">Loading concert...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          {concertId ? "Edit Concert" : "Add New Concert"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      Concert Name *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Artist or event name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Venue *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Venue name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date *
                    </FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticket_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
                      Dylan's Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="thinking">Contemplating</SelectItem>
                        <SelectItem value="purchased">Ticket Purchased</SelectItem>
                        <SelectItem value="not_going">Not Going</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="spotify_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Spotify URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://open.spotify.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticket_url"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2">
                      <Ticket className="w-4 h-4" />
                      Ticket URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional details about the concert..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review (for past concerts)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How was the show?..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 justify-end">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : concertId ? "Update Concert" : "Create Concert"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
