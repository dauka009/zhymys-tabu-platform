"use client";

import { Building2, Clock, MapPin, Heart, ExternalLink } from "lucide-react";
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

  const handleApply = (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuth) {
      toast.error("Алдымен жүйеге кіріңіз");
      return;
    }
    toggleSavedVacancy(vacancy.id);
    toast.success(isSaved ? "Сақталғандардан өшірілді" : "Сақталғандарға қосылды");
  };

  const isExternal = vacancy.id.startsWith("api_");

  return (
    <Link href={`/vacancies/${vacancy.id}`}>
      <Card className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50",
        isExternal && "border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20"
      )}>
        {/* Animated highlight line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-500 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
        
        <CardContent className="p-6">
          <div className="flex items-start gap-4 flex-col sm:flex-row">
            {/* Logo placeholder */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted text-2xl shadow-sm group-hover:bg-primary/10 transition-colors">
              {vacancy.emoji || "💼"}
            </div>

            <div className="flex-1 space-y-3 w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                  {vacancy.title}
                  {isExternal && <TagBadge label="API" variant="purple" className="text-[10px] px-1.5 py-0" />}
                </h3>
                <SalaryBadge salary={vacancy.salary} />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  {vacancy.company?.name || "Global Company"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {vacancy.location}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
                <div className="flex flex-wrap gap-2">
                  <TagBadge 
                    label={categoryLabels[vacancy.category] || vacancy.category} 
                  />
                  {vacancy.type && typeLabels[vacancy.type] && (
                    <TagBadge 
                      label={typeLabels[vacancy.type].label} 
                      variant={typeLabels[vacancy.type].variant}
                      icon={<Clock className="h-3 w-3" />}
                    />
                  )}
                  {vacancy.createdAt && (
                    <span className="text-xs text-muted-foreground self-center ml-2">
                      {new Date(vacancy.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn(
                      "rounded-full hover:text-red-500",
                      isSaved && "text-red-500 bg-red-100 hover:bg-red-200 dark:bg-red-900/30"
                    )}
                    onClick={handleSave}
                  >
                    <Heart className={cn("h-4 w-4", isSaved && "fill-current")} />
                  </Button>
                  
                  <Button 
                    onClick={handleApply}
                    variant={isApplied ? "outline" : "default"}
                    disabled={isApplied}
                    className={cn(
                      "rounded-full transition-all",
                      !isApplied && "bg-gradient-to-r from-primary to-indigo-600 hover:shadow-md hover:-translate-y-0.5",
                      isApplied && "border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:border-emerald-800"
                    )}
                  >
                    {isApplied ? (
                      "Өтініш жіберілді"
                    ) : isExternal ? (
                      <span className="flex items-center gap-1">
                        Өтініш беру <ExternalLink className="h-3 w-3" />
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
