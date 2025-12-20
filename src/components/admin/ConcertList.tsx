import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar, MapPin, List } from "lucide-react";

interface ConcertListProps {
  onEdit: (concertId: string) => void;
}

export const ConcertList = ({ onEdit }: ConcertListProps) => {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { data: concerts, isLoading } = useQuery({
    queryKey: ["concerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concerts")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const { error } = await supabase.from("concerts").delete().eq("id", deleteId);
    setIsDeleting(false);

    if (error) {
      toast.error("Failed to delete concert");
    } else {
      toast.success("Concert deleted");
      queryClient.invalidateQueries({ queryKey: ["concerts"] });
    }
    setDeleteId(null);
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "purchased":
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Purchased</Badge>;
      case "not_going":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Not Going</Badge>;
      default:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Thinking</Badge>;
    }
  };

  const isPastConcert = (date: string) => {
    return new Date(date) < new Date();
  };

  if (isLoading) {
    return (
      <Card className="glass">
        <CardContent className="p-8 flex justify-center">
          <div className="animate-pulse text-muted-foreground">Loading concerts...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="w-5 h-5 text-primary" />
            All Concerts ({concerts?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {concerts && concerts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {concerts.map((concert) => (
                    <TableRow 
                      key={concert.id}
                      className={isPastConcert(concert.date) ? "opacity-60" : ""}
                    >
                      <TableCell className="font-medium">
                        {concert.name}
                        {isPastConcert(concert.date) && (
                          <Badge variant="outline" className="ml-2 text-xs">Past</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {concert.venue}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(concert.date), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(concert.ticket_status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(concert.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(concert.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No concerts yet. Add your first concert!
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Concert</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this concert? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
