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
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      Promise.all([
        fetch(`/api/vacancies?employerId=${user.id}`).then(res => res.json()),
        fetch(`/api/employer/company?userId=${user.id}`).then(res => res.json())
      ])
        .then(([vacanciesData, companyData]) => {
          const vacanciesWithFields = (Array.isArray(vacanciesData) ? vacanciesData : (vacanciesData?.vacancies || [])).map((v: any) => ({
            ...v,
            reviewFields: typeof v.review_fields === 'string' ? JSON.parse(v.review_fields) : (v.review_fields || {})
          }));
          setVacancies(vacanciesWithFields);
          setCompany(companyData?.company);
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

  const handleResubmit = async (id: string) => {
    try {
      // In a real scenario we'd PUT/PATCH the edited fields. 
      // For now we just reset status to PENDING_REVIEW.
      const res = await fetch(`/api/admin/moderation/vacancies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PENDING_REVIEW" })
      });
      if (res.ok) {
        setVacancies(prev => prev.map(v => v.id === id ? { ...v, status: "PENDING_REVIEW" } : v));
        toast.success("Қайта тексеруге жіберілді");
      }
    } catch (err) {
      toast.error("Қате шықты");
    }
  };

  const isCompanyApproved = company?.review_status === "APPROVED";

  const getVacancyStatusBadge = (v: any) => {
    switch (v.status) {
      case "PUBLISHED": return <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-xs font-bold">Жарияланған</span>;
      case "PENDING_REVIEW": return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold">Тексерілуде</span>;
      case "NEEDS_FIX": return <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs font-bold">Түзету қажет</span>;
      case "REJECTED": return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-bold">Қабылданбады</span>;
      default: return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold">{v.status}</span>;
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold">Менің вакансияларым</h2>
          <p className="text-muted-foreground mt-1">Сіз жариялаған барлық жұмыс орындары</p>
        </div>
        {!isCompanyApproved ? (
          <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg border border-amber-200">
            Вакансия қосу үшін компанияңыз модерациядан өтуі тиіс
          </div>
        ) : (
          <Link href="/cabinet/vacancies/new">
            <Button className="rounded-xl gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-5 w-5" /> Вакансия қосу
            </Button>
          </Link>
        )}
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
                        {getVacancyStatusBadge(v)}
                      </div>
                      {(v.status === "NEEDS_FIX" || v.status === "REJECTED") && v.review_comment && (
                        <div className="text-sm text-amber-700 mt-2 bg-amber-50 p-3 rounded-md border border-amber-200">
                          <b className="block mb-1">Модератор ескертуі:</b>
                          <p>{v.review_comment}</p>
                          {v.reviewFields && Object.keys(v.reviewFields).length > 0 && (
                            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs mb-3">
                              {Object.entries(v.reviewFields).map(([k, err]) => (
                                <li key={k}><b>{k}:</b> {String(err)}</li>
                              ))}
                            </ul>
                          )}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleResubmit(v.id)}
                            className="mt-2 bg-white"
                          >
                            Түзетіп, қайта жіберу (Resubmit)
                          </Button>
                        </div>
                      )}
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
          {isCompanyApproved ? (
            <Link href="/cabinet/vacancies/new">
              <Button variant="outline" className="rounded-xl">Жаңа вакансия қосу</Button>
            </Link>
          ) : (
            <div className="text-sm text-amber-600">Компанияңыз модерациядан өткен соң вакансия қоса аласыз</div>
          )}
        </div>
      )}
    </div>
  );
}
