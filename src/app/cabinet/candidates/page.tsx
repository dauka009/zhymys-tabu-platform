"use client";

import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/atoms/TagBadge";
import { User, Mail, Calendar, Check, X, Loader2, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function CandidatesPage() {
  const { user } = useAuthStore();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/applications?employerId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setCandidates(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user?.id]);

  const updateStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        setCandidates(prev => prev.map(c => c.id === appId ? { ...c, status } : c));
        toast.success("Мәртебе жаңартылды");
      }
    } catch (err) {
      toast.error("Қате шықты");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold">Кандидаттар</h2>
        <p className="text-muted-foreground mt-1">Сіздің вакансияларыңызға келген өтінімдер</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : candidates.length > 0 ? (
        <div className="space-y-4">
          {candidates.map(c => (
            <Card key={c.id} className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="h-14 w-14 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                      <User className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg">{c.user?.name || "Кандидат"}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-primary" />
                          {c.vacancyTitle}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5" />
                          {c.user?.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(c.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
                    <TagBadge
                      label={c.status === 'pending' ? 'Қаралуда' : c.status === 'interview' ? 'Шақырылды' : 'Бас тартылды'}
                      variant={c.status === 'pending' ? 'blue' : c.status === 'interview' ? 'green' : 'orange'}
                      className="px-3 py-1 font-bold uppercase text-[10px]"
                    />
                    
                    {c.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateStatus(c.id, 'rejected')}
                          className="rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 h-9"
                        >
                          <X className="h-4 w-4 mr-1" /> Бас тарту
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => updateStatus(c.id, 'interview')}
                          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 h-9"
                        >
                          <Check className="h-4 w-4 mr-1" /> Шақыру
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
          <div className="text-5xl mb-4 opacity-50">👥</div>
          <h3 className="text-xl font-bold mb-2">Кандидаттар әлі жоқ</h3>
          <p className="text-muted-foreground">Вакасияларыңызға өтінім түскенде осында көрінеді</p>
        </div>
      )}
    </div>
  );
}
