"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useApplicationsStore } from "@/stores/applications.store";
import { useVacanciesStore } from "@/stores/vacancies.store";
import { Button } from "@/components/ui/button";
import { ApplicationStatus } from "@/types";
import { FileText, Briefcase, Eye, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/components/atoms/TagBadge";
import { useState, useEffect } from "react";
export default function CabinetPage() {
  const { user, role } = useAuthStore();
  const { applications, savedVacancies } = useApplicationsStore();
  const { vacancies } = useVacanciesStore();

  const seekerApps = applications.filter(a => a.userId === user?.id);
  const pendingApps = seekerApps.filter(a => a.status === 'pending');
  const savedCount = savedVacancies.length;

  const [stats, setStats] = useState({
    activeVacancies: 0,
    newApplications: 0,
    totalViews: 0
  });
  const [loadingStats, setLoadingStats] = useState(role === 'employer');

  useEffect(() => {
    if (role === 'employer' && user?.id) {
      fetch(`/api/employer/stats?employerId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          setStats(data);
          setLoadingStats(false);
        })
        .catch(err => {
          console.error(err);
          setLoadingStats(false);
        });
    }
  }, [role, user?.id]);

  if (role === 'employer') {
    return (
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="font-heading text-3xl font-black tracking-tight">Басты бақылау тақтасы</h2>
            <p className="text-muted-foreground mt-1 font-medium">Тайлайн мен статистикаңызды қараңыз</p>
          </div>
          <Link href="/cabinet/vacancies/new">
            <Button className="h-12 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-xl shadow-primary/20 gap-2 border-0">
              <Plus className="h-5 w-5" /> Жаңа вакансия қосу
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Active Vacancies */}
          <div className="group p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <div className="text-4xl font-black tracking-tighter">
                  {loadingStats ? "..." : stats.activeVacancies}
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Белсенді вакансия</div>
              </div>
            </div>
          </div>

          {/* New Applications */}
          <div className="group p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/5">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <div className="text-4xl font-black tracking-tighter">
                  {loadingStats ? "..." : stats.newApplications}
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Жаңа өтініштер</div>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="group p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-sm hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Eye className="h-7 w-7" />
              </div>
              <div>
                <div className="text-4xl font-black tracking-tighter">
                  {loadingStats ? "..." : stats.totalViews > 999 ? `${(stats.totalViews / 1000).toFixed(1)}K` : stats.totalViews}
                </div>
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Қаралымдар</div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-heading text-xl font-bold mb-4">Соңғы өтініштер</h3>
        <div className="text-center p-12 border border-dashed rounded-xl text-muted-foreground">
          Сұраныста кандидаттар тізімі болады. Бұл демода көрсетілмеген.
        </div>
      </div>
    );
  }

  // Seeker View
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold">Қайырлы күн, {user?.name}! 👋</h2>
        <p className="text-muted-foreground mt-1">Жұмыс іздеуде сәттілік тілейміз. Бүгін не істейміз?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-primary/5 border shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-indigo-500 font-medium mb-1">Жіберілген өтініштер</div>
            <div className="text-4xl font-extrabold">{seekerApps.length}</div>
            <div className="text-sm text-muted-foreground mt-2">Күтуде: {pendingApps.length}</div>
          </div>
          <Link href="/cabinet/applications" className="mt-6 w-full block">
            <Button variant="outline" className="w-full bg-white dark:bg-card">
              Өтініштерді қарау
            </Button>
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-emerald-500 font-medium mb-1">Сақталған вакансиялар</div>
            <div className="text-4xl font-extrabold">{savedCount}</div>
            <div className="text-sm text-muted-foreground mt-2">Кейінірек қарау үшін</div>
          </div>
          <Link href="/vacancies" className="mt-6 w-full block">
            <Button variant="outline" className="w-full bg-white dark:bg-card border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900">
              Жаңаларын іздеу
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl font-bold">Тарих (Соңғы өтініштер)</h3>
          {seekerApps.length > 0 && (
            <Link href="/cabinet/applications" className="text-sm font-medium text-primary hover:underline">
              Барлығын көру
            </Link>
          )}
        </div>
        
        {seekerApps.length > 0 ? (
          <div className="space-y-3">
            {seekerApps.slice(0, 3).map(app => {
              const vacancy = vacancies.find(v => v.id === app.vacancyId);
              return (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center shrink-0">
                      {vacancy?.emoji || "👔"}
                    </div>
                    <div>
                      <div className="font-bold">{vacancy?.title || "Беймәлім"}</div>
                      <div className="text-sm text-muted-foreground">{vacancy?.company?.name || "Компания"}</div>
                    </div>
                  </div>
                  <TagBadge 
                    label={app.status === 'pending' ? 'Қаралуда' : app.status === 'accepted' ? 'Шақыру' : 'Бас тарту'} 
                    variant={app.status === 'pending' ? 'blue' : app.status === 'accepted' ? 'green' : 'orange'} 
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center p-12 border border-dashed rounded-xl">
            <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </div>
            <h4 className="font-bold mb-1">Өтініштер жоқ</h4>
            <p className="text-sm text-muted-foreground mb-4">Сіз әлі ешқандай жұмысқа өтініш жібермедіңіз.</p>
            <Link href="/vacancies">
              <Button>Жұмыс іздеуді бастау</Button>
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
