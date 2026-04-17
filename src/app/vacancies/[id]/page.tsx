"use client";

import { useVacanciesStore } from "@/stores/vacancies.store";
import { useApplicationsStore } from "@/stores/applications.store";
import { useAuthStore } from "@/stores/auth.store";
import { notFound, useParams } from "next/navigation";
import { TagBadge } from "@/components/atoms/TagBadge";
import { SalaryBadge } from "@/components/atoms/SalaryBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Clock, Heart, ExternalLink, CalendarDays, Share2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function VacancyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { vacancies } = useVacanciesStore();
  const vacancy = vacancies.find(v => v.id === id);
  const { isAuth, role, user } = useAuthStore();
  const { savedVacancies, toggleSavedVacancy, apply, applications } = useApplicationsStore();
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;
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
    toast.success("Өтініш сәтті жіберілді!");
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
    <main className="flex-1 bg-muted/20">
      {/* Header Area */}
      <div className="bg-[#0F172A] py-16 text-white relative">
        <div className="container px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-4xl shadow-xl backdrop-blur-md border border-white/20">
                {vacancy.emoji || "💼"}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="flex items-center gap-2 text-indigo-200">
                    <Building2 className="h-4 w-4" />
                    {vacancy.company?.name || "Global Company"}
                  </span>
                  <span className="flex items-center gap-2 text-indigo-200">
                    <MapPin className="h-4 w-4" />
                    {vacancy.location}
                  </span>
                  {isExternal && <TagBadge label="API" variant="purple" className="py-0 h-5" />}
                </div>
                <h1 className="font-heading text-3xl md:text-5xl font-extrabold mb-4">{vacancy.title}</h1>
                <div className="flex items-center gap-4">
                  <SalaryBadge salary={vacancy.salary} />
                  <span className="text-sm text-indigo-200/60 flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(vacancy.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="icon" 
                className={`h-14 w-14 shrink-0 rounded-2xl border-white/20 bg-white/10 hover:bg-white/20 hover:text-white transition-colors ${isSaved ? "text-red-400 border-red-400/50 bg-red-400/10" : "text-white"}`}
                onClick={handleSave}
              >
                <Heart className={`h-6 w-6 ${isSaved ? "fill-current" : ""}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-14 w-14 shrink-0 rounded-2xl border-white/20 bg-white/10 hover:bg-white/20 hover:text-white transition-colors text-white"
              >
                <Share2 className="h-6 w-6" />
              </Button>
              <Button 
                onClick={handleApply}
                disabled={isApplied}
                className={`h-14 px-8 rounded-2xl font-bold text-lg whitespace-nowrap w-full sm:w-auto transition-all ${
                  isApplied 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20" 
                    : "bg-gradient-to-r from-primary to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/30 text-white border-0"
                }`}
              >
                {isApplied ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Өтініш жіберілді
                  </span>
                ) : isExternal ? (
                  <span className="flex items-center gap-2">
                    Сайтта өтініш беру <ExternalLink className="h-5 w-5" />
                  </span>
                ) : (
                  "Өтініш беру"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <Card>
              <CardContent className="p-8">
                <h3 className="font-heading text-2xl font-bold mb-6">Вакансия туралы</h3>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="whitespace-pre-line leading-relaxed text-[15px]">{vacancy.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="font-heading text-2xl font-bold mb-6">Қойылатын талаптар</h3>
                <ul className="grid gap-3">
                  {vacancy.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-[15px] text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <aside className="w-full lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-heading font-bold text-lg mb-4">Жалпы ақпарат</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Жұмыс форматы</div>
                        <div className="font-medium">{vacancy.type}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Сала</div>
                        <div className="font-medium uppercase">{vacancy.category}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Орналасуы</div>
                        <div className="font-medium">{vacancy.location}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {vacancy.company && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-heading font-bold text-lg mb-4">Компания</h3>
                    <div className="flex items-start gap-4 mb-4">
                      {vacancy.company.logo && (
                        <div className="text-3xl shrink-0">{vacancy.company.logo}</div>
                      )}
                      <div>
                        <Link href={`/companies/${vacancy.company.id}`} className="font-bold hover:text-primary transition-colors">
                          {vacancy.company.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {vacancy.company.description}
                        </p>
                      </div>
                    </div>
                    <Link href={`/companies/${vacancy.company.id}`} className="w-full block">
                      <Button variant="outline" className="w-full">
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
