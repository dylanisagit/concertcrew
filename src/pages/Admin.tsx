import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { ConcertForm } from "@/components/admin/ConcertForm";
import { ConcertList } from "@/components/admin/ConcertList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Plus, List } from "lucide-react";

const Admin = () => {
  const { isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const [editingConcertId, setEditingConcertId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("list");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
    }
  }, [loading, user, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleEditConcert = (concertId: string) => {
    setEditingConcertId(concertId);
    setActiveTab("form");
  };

  const handleCancelEdit = () => {
    setEditingConcertId(null);
    setActiveTab("list");
  };

  const handleSaveComplete = () => {
    setEditingConcertId(null);
    setActiveTab("list");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Admin Panel</h1>
            <p className="text-muted-foreground">Manage concerts and events</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              All Concerts
            </TabsTrigger>
            <TabsTrigger value="form" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              {editingConcertId ? "Edit Concert" : "Add Concert"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <ConcertList onEdit={handleEditConcert} />
          </TabsContent>

          <TabsContent value="form">
            <ConcertForm 
              concertId={editingConcertId} 
              onCancel={handleCancelEdit}
              onSaveComplete={handleSaveComplete}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
