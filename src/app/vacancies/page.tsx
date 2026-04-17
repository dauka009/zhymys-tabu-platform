import { FilterPanel } from "@/components/organisms/FilterPanel";
import { VacancyList } from "@/components/organisms/VacancyList";

export const metadata = {
  title: "Вакансиялар — ЖұмысТап",
  description: "Барлық қолжетімді жұмыс орындары",
};

export default function VacanciesPage() {
  return (
    <main className="flex-1 bg-muted/20">
      <div className="bg-[#0F172A] py-12 text-white shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        <div className="container px-4 relative z-10">
          <h1 className="font-heading text-3xl font-extrabold md:text-4xl">Вакансиялар</h1>
          <p className="mt-2 text-indigo-200">Сізге сәйкес келетін арман жұмысын табыңыз</p>
        </div>
      </div>

      <div className="container px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <aside className="w-full lg:w-1/3 xl:w-1/4">
            <FilterPanel />
          </aside>
          <div className="w-full lg:w-2/3 xl:w-3/4">
            <VacancyList />
          </div>
        </div>
      </div>
    </main>
  );
}
