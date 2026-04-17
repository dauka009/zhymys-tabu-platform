"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useApplicationsStore } from "@/stores/applications.store";
import { useVacanciesStore } from "@/stores/vacancies.store";
import { Button } from "@/components/ui/button";
import { ApplicationStatus } from "@/types";
import { FileText, Briefcase, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/components/atoms/TagBadge";

export default function CabinetPage() {
  const { user, role } = useAuthStore();
  const { applications, savedVacancies } = useApplicationsStore();
  const { vacancies } = useVacanciesStore();

  const seekerApps = applications.filter(a => a.userId === user?.id);
  const pendingApps = seekerApps.filter(a => a.status === 'pending');
  const savedCount = savedVacancies.length;

  if (role === 'employer') {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-2xl font-bold">Басты бақылау тақтасы</h2>
            <p className="text-muted-foreground mt-1">Тайлайн мен статистикаңызды қараңыз</p>
          </div>
          <Link href="/cabinet/vacancies/new">
            <Button className="bg-gradient-to-r from-primary to-indigo-600 font-bold">
              Жаңа вакансия қосу
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-2xl border bg-muted/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm text-muted-foreground">Белсенді вакансия</div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border bg-muted/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <div className="text-3xl font-bold">48</div>
                <div className="text-sm text-muted-foreground">Жаңа өтініштер</div>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-2xl border bg-muted/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-3xl font-bold">1.2K</div>
                <div className="text-sm text-muted-foreground">Қаралымдар</div>
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
