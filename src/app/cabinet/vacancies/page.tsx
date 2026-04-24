"use client";

import { useAuthStore } from "@/stores/auth.store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/atoms/TagBadge";
import { Plus, Briefcase, Users, Eye, Edit2, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function EmployerVacanciesPage() {
  const { user } = useAuthStore();
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/vacancies?employerId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setVacancies(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user?.id]);

  const handleDelete = async (id: string) => {
    if (!confirm("Бұл вакансияны өшіруге сенімдісіз бе?")) return;
    
    try {
      const res = await fetch(`/api/vacancies/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVacancies(prev => prev.filter(v => v.id !== id));
        toast.success("Вакансия өшірілді");
      }
    } catch (err) {
      toast.error("Қате шықты");
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold">Менің вакансияларым</h2>
          <p className="text-muted-foreground mt-1">Сіз жариялаған барлық жұмыс орындары</p>
        </div>
        <Link href="/cabinet/vacancies/new">
          <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" /> Вакансия қосу
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : vacancies.length > 0 ? (
        <div className="space-y-4">
          {vacancies.map(v => (
            <Card key={v.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow bg-card/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex gap-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {v.emoji || "💼"}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-lg">{v.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {v.applicationsCount || 0} өтінім
                        </span>
                        <span className="flex items-center gap-1 text-primary font-medium">
                           {v.status === 'PUBLISHED' ? 'Жарияланған' : 'Черновик'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/vacancies/${v.id}`}>
                      <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
                        <Eye className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 text-muted-foreground hover:text-primary">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(v.id)}
                      className="rounded-full h-10 w-10 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/10 rounded-2xl border-2 border-dashed border-border/50">
          <div className="text-5xl mb-4 opacity-50">💼</div>
          <h3 className="text-xl font-bold mb-2">Вакансиялар әлі жоқ</h3>
          <p className="text-muted-foreground mb-6">Бірінші вакансияңызды қосыңыз</p>
          <Link href="/cabinet/vacancies/new">
            <Button variant="outline" className="rounded-xl">Жаңа вакансия қосу</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
