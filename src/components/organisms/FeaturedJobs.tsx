"use client";

import { useVacanciesStore } from "@/stores/vacancies.store";
import { VacancyCard } from "@/components/molecules/VacancyCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export function FeaturedJobs() {
  const { vacancies } = useVacanciesStore();
  const featured = vacancies.slice(0, 4);

  return (
    <section className="py-20 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold text-primary bg-primary/5 mb-4">
              🔥 Ыстық вакансиялар
            </div>
            <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
              Бүгінгі таңдаулы вакансиялар
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Жетекші компаниялардан жаңа жарияланған жұмыс орындары. Сіз үшін арнайы іріктелген.
            </p>
          </div>
          <Link href="/vacancies" className="hidden md:block">
            <Button variant="outline" className="gap-2 rounded-full hover:bg-primary hover:text-white transition-colors">
              Барлық вакансияларды көру <MoveRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {featured.map((vacancy) => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link href="/vacancies">
            <Button variant="outline" size="lg" className="gap-2 rounded-full w-full">
              Барлық вакансияларды көру <MoveRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
