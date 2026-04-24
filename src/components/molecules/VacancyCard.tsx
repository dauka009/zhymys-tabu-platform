"use client";

import { Building2, Clock, MapPin, Heart, ExternalLink, CheckCircle2 } from "lucide-react";
import { Vacancy } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SalaryBadge } from "@/components/atoms/SalaryBadge";
import { TagBadge } from "@/components/atoms/TagBadge";
import { useApplicationsStore } from "@/stores/applications.store";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const categoryLabels: Record<string, string> = {
  it: "IT & Tech",
  marketing: "Маркетинг",
  finance: "Қаржы",
  design: "Дизайн",
};

const typeLabels: Record<string, { label: string, variant: 'blue' | 'green' | 'purple' | 'orange' | 'default' }> = {
  full: { label: "Толық күн", variant: "default" },
  part: { label: "Жартылай күн", variant: "orange" },
  remote: { label: "Қашықтан", variant: "green" },
  hybrid: { label: "Гибридті", variant: "purple" },
  internship: { label: "Тағылымдама", variant: "blue" },
};

export function VacancyCard({ vacancy }: { vacancy: Vacancy }) {
  const { isAuth, role, user } = useAuthStore();
  const { savedVacancies, toggleSavedVacancy, apply, applications } = useApplicationsStore();
  
  const isSaved = savedVacancies.includes(vacancy.id);
  const isApplied = applications.some(a => a.vacancyId === vacancy.id && a.userId === user?.id);

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuth) {
      toast.error("Алдымен жүйеге кіріңіз");
      return;
    }
    if (role !== 'seeker') {
      toast.error("Тек іздеушілер өтініш қалдыра алады");
      return;
    }
    
    // Optimistic local check before calling API
    await apply({
      vacancyId: vacancy.id,
      userId: user!.id,
    });
    // Toast handled inside the store's apply() function
  };

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuth) {
      toast.error("Алдымен жүйеге кіріңіз");
      return;
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user!.id, vacancyId: vacancy.id }),
      });

      if (res.ok) {
        const { action } = await res.json();
        // Keep local store in sync
        toggleSavedVacancy(vacancy.id);
        toast.success(action === 'removed' ? "Сақталғандардан өшірілді" : "Сақталғандарға қосылды");
      }
    } catch {
      // Fallback: update local only
      toggleSavedVacancy(vacancy.id);
      toast.success(isSaved ? "Сақталғандардан өшірілді" : "Сақталғандарға қосылды");
    }
  };

  const isExternal = vacancy.id.startsWith("api_");

  return (
    <Link href={`/vacancies/${vacancy.id}`}>
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5 border-border/40 bg-card/40 backdrop-blur-sm hover:border-primary/40",
        isExternal && "border-indigo-100/30 dark:border-indigo-900/30 bg-indigo-50/20 dark:bg-indigo-950/10"
      )}>
        {/* Animated gradient top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-indigo-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        
        <CardContent className="p-6">
          <div className="flex items-start gap-5 flex-col sm:flex-row">
            {/* Improved Logo container */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted/50 border border-border/50 text-3xl shadow-inner group-hover:scale-105 group-hover:bg-primary/5 transition-all duration-300">
              {vacancy.emoji || "💼"}
            </div>

            <div className="flex-1 space-y-4 w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-xl text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                    {vacancy.title}
                    {isExternal && <TagBadge label="API" variant="purple" className="text-[9px] px-1.5 py-0 font-black h-4" />}
                  </h3>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                     <Building2 className="h-3.5 w-3.5" />
                     <span>{vacancy.company?.name || "Global Company"}</span>
                  </div>
                </div>
                <SalaryBadge salary={vacancy.salary} className="text-lg font-bold" />
              </div>

              <div className="flex flex-wrap items-center gap-5 text-[13px] text-muted-foreground/80">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary/60" />
                  {vacancy.location}
                </span>
                {vacancy.type && typeLabels[vacancy.type] && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary/60" />
                    {typeLabels[vacancy.type].label}
                  </span>
                )}
                {vacancy.createdAt && (
                  <span className="ml-auto text-[11px] font-medium opacity-60">
                    {new Date(vacancy.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/20">
                <div className="flex flex-wrap gap-2">
                  <TagBadge 
                    label={categoryLabels[vacancy.category] || vacancy.category} 
                    className="bg-primary/5 text-primary border-primary/10 font-bold"
                  />
                </div>

                <div className="flex items-center gap-2.5">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "rounded-xl h-10 w-10 hover:text-red-500 hover:bg-red-50 transition-all",
                      isSaved && "text-red-500 bg-red-100/50 hover:bg-red-100 dark:bg-red-900/20"
                    )}
                    onClick={handleSave}
                  >
                    <Heart className={cn("h-5 w-5", isSaved && "fill-current")} />
                  </Button>
                  
                  <Button 
                    onClick={handleApply}
                    variant={isApplied ? "outline" : "default"}
                    disabled={isApplied}
                    className={cn(
                      "rounded-xl h-10 px-6 font-bold transition-all shadow-lg",
                      !isApplied && "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20",
                      isApplied && "border-emerald-200 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/50"
                    )}
                  >
                    {isApplied ? (
                      <span className="flex items-center gap-2">
                         <CheckCircle2 className="h-4 w-4" /> Жіберілді
                      </span>
                    ) : (
                      "Өтініш беру"
                    )}
                  </Button>
                </div>
              </div>
              
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
