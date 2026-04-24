"use client";

import { Company } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Briefcase, Plus, Check } from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/components/atoms/TagBadge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CompanyCard({ company }: { company: Company }) {
  const { user, isAuth } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check follow status on mount
  useEffect(() => {
    if (isAuth && user) {
      fetch(`/api/companies/${company.id}/follow?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setIsFollowing(data.isFollowing))
        .catch(err => console.error(err));
    }
  }, [company.id, isAuth, user]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuth) {
      toast.error("Алдымен жүйеге кіріңіз");
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        const res = await fetch(`/api/companies/${company.id}/follow?userId=${user?.id}`, { method: 'DELETE' });
        if (res.ok) {
          setIsFollowing(false);
          toast.success(`${company.name} тізімінен шығарылды`);
        }
      } else {
        const res = await fetch(`/api/companies/${company.id}/follow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id }),
        });
        if (res.ok) {
          setIsFollowing(true);
          toast.success(`${company.name} тізіміне қосылды`);
        }
      }
    } catch (error) {
      toast.error("Қате шықты");
    } finally {
      setLoading(false);
    }
  };

  const vacanciesCount = company.openVacancies || 0;

  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 relative">
        <div className="absolute top-0 right-0 p-4">
          <TagBadge 
            label={`${vacanciesCount} вакансия`} 
            variant={vacanciesCount > 0 ? "blue" : "gray"} 
            className="font-bold shadow-sm"
          />
        </div>
        <CardContent className="p-7 flex flex-col h-full">
          <div className="flex items-center gap-5 mb-5">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative z-10 overflow-hidden border-2 border-white/10 p-0.5">
              {company.logo?.startsWith('http') ? (
                <img src={company.logo} alt={company.name} className="h-full w-full object-contain p-2" />
              ) : (
                <span className="text-3xl">{company.logo || "🏢"}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-heading font-bold text-xl group-hover:text-primary transition-colors truncate mb-0.5">{company.name}</h3>
              <p className="text-[10px] font-extrabold text-primary uppercase tracking-widest">{company.industry}</p>
            </div>
          </div>
          
          <div className="flex-1 mb-6">
            <p className="text-muted-foreground text-[13px] line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
              {company.description}
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-4 border-t border-border/30 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/70">
                  <MapPin className="h-3.5 w-3.5 text-primary/70" />
                  <span>{company.location}</span>
                </div>
                {company.size && (
                  <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground/70">
                    <Users className="h-3.5 w-3.5 text-primary/70" />
                    <span>{company.size} қызметкер</span>
                  </div>
                )}
              </div>
              
              <Button 
                onClick={handleFollow}
                disabled={loading}
                variant={isFollowing ? "secondary" : "outline"} 
                size="sm" 
                className={cn(
                  "rounded-xl gap-1.5 h-9 px-5 font-bold transition-all border-border/50",
                  isFollowing ? "bg-primary/10 text-primary border-primary/30" : "hover:bg-primary hover:text-white hover:border-primary"
                )}
              >
                {isFollowing ? (
                  <>
                    <Check className="h-4 w-4" /> Жазылды
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Жазылу
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
