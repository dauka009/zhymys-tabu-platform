"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useApplicationsStore } from "@/stores/applications.store";
import { useVacanciesStore } from "@/stores/vacancies.store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TagBadge } from "@/components/atoms/TagBadge";
import { Building2, MapPin, Calendar, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function ApplicationsPage() {
  const { user } = useAuthStore();
  const { applications, withdraw } = useApplicationsStore();
  const { vacancies } = useVacanciesStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  const myApps = applications.filter(a => a.userId === user?.id);

  const handleWithdraw = (id: string) => {
    if (confirm("Өтінішті қайтарып алғыңыз келетініне сенімдісіз бе?")) {
      withdraw(id);
      toast.info("Өтініш қайтарып алынды");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold">Менің өтініштерім</h2>
        <p className="text-muted-foreground mt-1">Осы уақытқа дейін жіберілген барлық өтініштер тізімі</p>
      </div>

      {myApps.length > 0 ? (
        <div className="space-y-4">
          {myApps.map(app => {
            const vacancy = vacancies.find(v => v.id === app.vacancyId);
            return (
              <Card key={app.id} className="overflow-hidden border-l-4 border-l-primary hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center text-2xl shrink-0">
                        {vacancy?.emoji || "💼"}
                      </div>
                      <div className="space-y-1">
                        <Link href={`/vacancies/${app.vacancyId}`} className="font-bold text-lg hover:text-primary transition-colors">
                          {vacancy?.title || "Вакансия өшірілген"}
                        </Link>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {vacancy?.company?.name || "Компания"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {vacancy?.location || "Қазақстан"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(app.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                      <TagBadge 
                        label={app.status === 'pending' ? 'Қаралуда' : app.status === 'accepted' ? 'Шақыру' : 'Бас тарту'} 
                        variant={app.status === 'pending' ? 'blue' : app.status === 'accepted' ? 'green' : 'orange'} 
                        className="text-xs uppercase px-3"
                      />
                      <div className="flex gap-2">
                         <Button variant="ghost" size="icon" onClick={() => handleWithdraw(app.id)} className="text-muted-foreground hover:text-red-500 rounded-full h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                         </Button>
                         <Link href={`/vacancies/${app.vacancyId}`}>
                           <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full h-8 w-8">
                              <ExternalLink className="h-4 w-4" />
                           </Button>
                         </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-xl font-bold mb-2">Өтініштер тізімі бос</h3>
          <p className="text-muted-foreground mb-6">Жұмыс тауып, алғашқы өтінішіңізді жіберіңіз</p>
          <Link href="/vacancies">
            <Button>Вакансияларды қарау</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
