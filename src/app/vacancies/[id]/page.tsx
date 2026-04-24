"use client";

import { useVacanciesStore } from "@/stores/vacancies.store";
import { useApplicationsStore } from "@/stores/applications.store";
import { useAuthStore } from "@/stores/auth.store";
import { notFound, useParams } from "next/navigation";
import { TagBadge } from "@/components/atoms/TagBadge";
import { SalaryBadge } from "@/components/atoms/SalaryBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Clock, Heart, ExternalLink, CalendarDays, Share2, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Vacancy } from "@/types";
import { cn } from "@/lib/utils";

export default function VacancyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { vacancies } = useVacanciesStore();
  
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { isAuth, role, user } = useAuthStore();
  const { savedVacancies, toggleSavedVacancy, apply, applications } = useApplicationsStore();
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if in store first
    const fromStore = vacancies.find(v => v.id === id);
    if (fromStore) {
      setVacancy(fromStore);
      setLoading(false);
    } else {
      // Fetch from API if not in store (direct navigation)
      fetch(`/api/vacancies/${id}`)
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('NotFound');
        })
        .then(data => {
          setVacancy(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, vacancies]);

  if (!isClient || loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!vacancy) return notFound();

  const isSaved = savedVacancies.includes(vacancy.id);
  const isApplied = applications.some(a => a.vacancyId === vacancy.id && a.userId === user?.id);
  const isExternal = vacancy.id.startsWith("api_");

  const handleApply = () => {
    if (!isAuth) {
      toast.error("Алдымен жүйеге кіріңіз");
      return;
    }
    if (role !== 'seeker') {
      toast.error("Тек іздеушілер өтініш қалдыра алады");
      return;
    }
    
    apply({
      vacancyId: vacancy.id,
      userId: user!.id,
    });
  };

  const handleSave = () => {
    if (!isAuth) {
      toast.error("Алдымен жүйеге кіріңіз");
      return;
    }
    toggleSavedVacancy(vacancy.id);
    toast.success(isSaved ? "Сақталғандардан өшірілді" : "Сақталғандарға қосылды");
  };

  return (
    <main className="flex-1 bg-background pb-20">
      <div className="bg-[#0B0F1A] pt-24 pb-48 text-white relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="container px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-10 justify-between items-start">
            <div className="flex items-center gap-8">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[2rem] bg-white/5 text-5xl shadow-2xl backdrop-blur-xl border border-white/10 group hover:scale-110 transition-transform duration-500">
                {vacancy.emoji || "💼"}
              </div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm font-bold tracking-widest uppercase">
                  <Link href={`/companies/${vacancy.companyId}`} className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                    <Building2 className="h-4 w-4" />
                    {vacancy.company?.name || "Компания"}
                  </Link>
                  <div className="h-1 w-1 rounded-full bg-white/20" />
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {vacancy.location}
                  </span>
                  {isExternal && <TagBadge label="API" variant="purple" className="py-0.5 px-2 h-auto" />}
                </div>
                <h1 className="font-heading text-4xl md:text-6xl font-black tracking-tight">{vacancy.title}</h1>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <SalaryBadge salary={vacancy.salary} className="text-2xl font-black bg-emerald-500/10 text-emerald-400 border-emerald-500/20" />
                  <div className="flex items-center gap-2 text-muted-foreground/60 font-medium">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {new Date(vacancy.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0 mt-8 md:mt-0">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn(
                    "h-14 w-14 shrink-0 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all",
                    isSaved && "text-red-400 border-red-400/30 bg-red-400/10"
                  )}
                  onClick={handleSave}
                >
                  <Heart className={cn("h-6 w-6", isSaved && "fill-current")} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14 shrink-0 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all text-white"
                >
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
              <Button 
                onClick={handleApply}
                disabled={isApplied}
                className={cn(
                  "h-14 px-10 rounded-2xl font-black text-xl whitespace-nowrap w-full sm:w-auto transition-all shadow-2xl",
                  isApplied 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "bg-primary hover:bg-primary/90 text-white shadow-primary/20 border-0"
                )}
              >
                {isApplied ? (
                  <span className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6" />
                    Өтініш жіберілді
                  </span>
                ) : (
                  "Өтініш беру"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3 space-y-10">
            <Card className="border-white/5 bg-card/60 backdrop-blur-xl shadow-2xl">
              <CardContent className="p-10">
                <h3 className="font-heading text-2xl font-black mb-8 flex items-center gap-3">
                   <span className="h-8 w-1 bg-primary rounded-full" />
                   Вакансия туралы
                </h3>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground/90 leading-relaxed text-lg">
                  <p className="whitespace-pre-line">{vacancy.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="w-full lg:w-1/3">
            <div className="sticky top-24 space-y-8">
              <Card className="border-white/5 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden">
                <div className="h-2 bg-primary/20 w-full" />
                <CardContent className="p-8">
                  <h3 className="font-heading font-black text-xl mb-6">Жалпы ақпарат</h3>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 group">
                      <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-0.5">Жұмыс форматы</div>
                        <div className="font-black text-lg">{vacancy.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 group">
                      <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Building2 className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest mb-0.5">Сала</div>
                        <div className="font-black text-lg">{vacancy.category}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {vacancy.companyId && (
                <Card className="border-white/5 bg-card/60 backdrop-blur-xl shadow-xl overflow-hidden group">
                  <CardContent className="p-8">
                    <h3 className="font-heading font-black text-xl mb-6">Компания</h3>
                    <div className="flex items-center gap-5 mb-8">
                      <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-2 group-hover:rotate-3 transition-transform">
                        {vacancy.company?.logo?.startsWith('http') ? (
                           <img src={vacancy.company.logo} alt="" className="h-full w-full object-contain" />
                        ) : (
                           <span className="text-3xl">{vacancy.company?.logo || "🏢"}</span>
                        )}
                      </div>
                      <div>
                        <Link href={`/companies/${vacancy.companyId}`} className="font-black text-xl hover:text-primary transition-all decoration-primary/30 decoration-2 underline-offset-4 hover:underline">
                          {vacancy.company?.name || "Компания"}
                        </Link>
                        <div className="text-sm text-muted-foreground font-medium mt-1">{vacancy.company?.industry}</div>
                      </div>
                    </div>
                    <Link href={`/companies/${vacancy.companyId}`} className="w-full block">
                      <Button variant="outline" className="w-full h-12 rounded-xl font-bold border-white/10 bg-white/5 hover:bg-primary hover:text-white hover:border-primary transition-all">
                        Компания профилі
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
