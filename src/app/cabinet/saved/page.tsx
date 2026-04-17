"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useApplicationsStore } from "@/stores/applications.store";
import { useVacanciesStore } from "@/stores/vacancies.store";
import { VacancyCard } from "@/components/molecules/VacancyCard";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function SavedVacanciesPage() {
  const { savedVacancies } = useApplicationsStore();
  const { vacancies } = useVacanciesStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  const savedList = vacancies.filter(v => savedVacancies.includes(v.id));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold">Сақталған вакансиялар</h2>
        <p className="text-muted-foreground mt-1">Сіз таңдаған және кейінге сақтаған жұмыс орындары</p>
      </div>

      {savedList.length > 0 ? (
        <div className="grid gap-4">
          {savedList.map(vacancy => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
          <div className="text-5xl mb-4">💖</div>
          <h3 className="text-xl font-bold mb-2">Сақталғандар тізімі бос</h3>
          <p className="text-muted-foreground mb-6">Вакансияларды қарау кезінде ұнағандарын жүрекшемен белгілеңіз</p>
        </div>
      )}
    </div>
  );
}
