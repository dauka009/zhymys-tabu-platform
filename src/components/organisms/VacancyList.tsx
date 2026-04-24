"use client";

import { useVacanciesStore } from "@/stores/vacancies.store";
import { VacancyCard } from "@/components/molecules/VacancyCard";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useState, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import { SearchBar } from "@/components/molecules/index";

export function VacancyList({ initialData }: { initialData?: any[] }) {
  const { vacancies, filters, setVacancies } = useVacanciesStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Егер серверден (DB) нақты мәліметтер келген болса, Zustand-ты жаңартамыз
    if (initialData && initialData.length > 0) {
      setVacancies(initialData);
    }
  }, [initialData, setVacancies]);

  const filteredData = useMemo(() => {
    let result = vacancies;

    if (filters.query) {
      const fuse = new Fuse(result, {
        keys: ["title", "company.name", "location", "description"],
        threshold: 0.3,
      });
      result = fuse.search(filters.query).map(r => r.item);
    }

    if (filters.category !== 'all') {
      result = result.filter(v => v.category === filters.category);
    }
    if (filters.type !== 'all') {
      result = result.filter(v => v.type === filters.type);
    }
    if (filters.salaryMin > 0) {
      result = result.filter(v => (v.salary.min >= filters.salaryMin) || (v.salary.max && v.salary.max >= filters.salaryMin));
    }

    return result;
  }, [vacancies, filters]);

  if (!isClient) return <div className="animate-pulse h-96 bg-muted rounded-xl" />;

  if (filteredData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-6xl mb-4">🏜️</div>
        <h3 className="font-heading text-xl font-bold mb-2">Ештеңе табылмады</h3>
        <p className="text-muted-foreground">Сүзгілерді өзгертіп көріңіз немесе басқа сөзбен іздеңіз</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-sm font-medium text-muted-foreground">
        Табылды: <span className="text-foreground">{filteredData.length}</span> вакансия
      </div>
      
      <div className="flex flex-col gap-4 w-full">
        {filteredData.map(vacancy => (
          <VacancyCard key={vacancy.id} vacancy={vacancy} />
        ))}
      </div>
    </div>
  );
}
