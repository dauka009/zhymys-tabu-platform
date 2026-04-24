"use client";

import { notFound, useParams } from "next/navigation";
import { VacancyCard } from "@/components/molecules/VacancyCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Globe, Phone, ExternalLink, Briefcase, Loader2, Check, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Company, Vacancy } from "@/types";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user, isAuth } = useAuthStore();
  
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Fetch company data from API
    fetch(`/api/companies/${id}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('NotFound');
      })
      .then(data => {
        setCompany(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    // Check following status
    if (isAuth && user) {
      fetch(`/api/companies/${id}/follow?userId=${user.id}`)
        .then(res => res.json())
        .then(data => setIsFollowing(data.isFollowing))
        .catch(err => console.error(err));
    }
  }, [id, isAuth, user]);

  const handleFollow = async () => {
    if (!isAuth) {
      toast.error("Алдымен жүйеге кіріңіз");
      return;
    }

    try {
      if (isFollowing) {
        await fetch(`/api/companies/${id}/follow?userId=${user?.id}`, { method: 'DELETE' });
        setIsFollowing(false);
        toast.success(`${company.name} тізімінен шығарылды`);
      } else {
        await fetch(`/api/companies/${id}/follow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id }),
        });
        setIsFollowing(true);
        toast.success(`${company.name} тізіміне қосылды`);
      }
    } catch (error) {
      toast.error("Қате шықты");
    }
  };

  if (!isClient || loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!company) return notFound();

  const companyVacancies = (company.vacancies || []) as Vacancy[];

  return (
    <main className="flex-1 bg-background pb-20">
      <div className="bg-[#0B0F1A] pt-24 pb-40 text-white relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <Card className="mb-10 shadow-2xl border-white/5 bg-card/60 backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <CardContent className="p-10">
            <div className="flex flex-col md:flex-row gap-10 items-start">
              <div className="flex h-40 w-40 shrink-0 items-center justify-center rounded-[2.5rem] bg-white shadow-2xl shadow-primary/10 border-4 border-white/10 text-7xl -mt-20 md:mt-0 group transition-transform duration-500 hover:scale-105 overflow-hidden">
                {company.logo?.startsWith('http') ? (
                  <img src={company.logo} alt={company.name} className="h-full w-full object-contain p-4" />
                ) : (
                  company.logo || "🏢"
                )}
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                  <div>
                    <h1 className="font-heading text-4xl font-black mb-3 tracking-tight">{company.name}</h1>
                    <div className="flex items-center gap-3">
                      <div className="text-primary font-black tracking-widest uppercase text-xs bg-primary/10 px-3 py-1 rounded-full">{company.industry}</div>
                      <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                      <div className="text-muted-foreground text-sm font-medium">{company.location}</div>
                    </div>
                  </div>
                  <Button 
                    onClick={handleFollow}
                    variant={isFollowing ? "secondary" : "outline"}
                    className={cn(
                      "shrink-0 gap-2 font-black px-10 h-12 rounded-2xl transition-all shadow-lg",
                      isFollowing ? "bg-primary/10 text-primary border-primary/20" : "bg-primary text-white hover:bg-primary/90 border-0"
                    )} 
                  >
                    {isFollowing ? (
                      <>
                        <Check className="h-5 w-5" /> Жазылды
                      </>
                    ) : (
                      <>
                        <Plus className="h-5 w-5" /> Жазылу
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground/80 mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{company.location}</span>
                  </div>
                  {company.size && (
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-primary">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{company.size} қызметкер</span>
                    </div>
                  )}
                  {company.contacts?.website && (
                    <a href={company.contacts.website} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 hover:text-primary transition-all group">
                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors text-primary">
                        <Globe className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Ресми сайт</span>
                      <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-10">
          <div className="w-full lg:w-2/3 space-y-10">
            <Card className="border-white/5 bg-card/40 backdrop-blur-sm">
              <CardContent className="p-10">
                <h2 className="font-heading text-2xl font-black mb-6 flex items-center gap-3">
                  <span className="h-8 w-1 bg-primary rounded-full" />
                  Компания туралы
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground/90 leading-relaxed text-lg">
                  <p className="whitespace-pre-line">{company.description}</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="font-heading text-2xl font-black mb-8 flex items-center gap-3">
                <span className="h-8 w-1 bg-primary rounded-full" />
                Ашық вакансиялар ({companyVacancies.length})
              </h2>
              {companyVacancies.length > 0 ? (
                <div className="grid gap-6">
                  {companyVacancies.map(vacancy => (
                    <VacancyCard key={vacancy.id} vacancy={vacancy} />
                  ))}
                </div>
              ) : (
                <Card className="bg-white/5 border-dashed border-white/10">
                  <CardContent className="p-16 text-center text-muted-foreground">
                    <Briefcase className="h-16 w-16 mx-auto mb-6 opacity-20" />
                    <p className="text-xl font-medium">Қазіргі уақытта компанияда ашық вакансиялар жоқ</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-1/3">
            <Card className="sticky top-24 border-white/5 bg-card/40 backdrop-blur-sm overflow-hidden">
              <div className="h-2 bg-primary/20 w-full" />
              <CardContent className="p-8">
                <h3 className="font-heading font-black text-xl mb-6">Орналасуы</h3>
                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-muted mb-6 border border-white/10 relative group cursor-pointer shadow-inner">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d160249.26129482704!2d71.3093121545465!3d51.14781483863414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424580c4733482bb%3A0xb9eb8a5d117070ef!2sAstana%20020000%2C%20Kazakhstan!5e0!3m2!1sen!2s!4v1714571213456!5m2!1sen!2s" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    className="absolute inset-0 grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-primary/5 pointer-events-none group-hover:bg-transparent transition-colors" />
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                  <MapPin className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                  <span className="text-sm font-medium leading-tight">{company.location}, Қазақстан</span>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
