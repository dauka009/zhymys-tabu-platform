"use client";

import { useEffect, useState, useMemo } from "react";
import { useCompaniesStore } from "@/stores/companies.store";
import { CompanyCard } from "@/components/molecules/CompanyCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export default function CompaniesPage() {
  const { companies, fetchCompanies, isLoading } = useCompaniesStore();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredCompanies = useMemo(() => {
    if (!search) return companies;
    const s = search.toLowerCase();
    return companies.filter(c => 
      c.name.toLowerCase().includes(s) || 
      c.industry.toLowerCase().includes(s) ||
      c.description.toLowerCase().includes(s)
    );
  }, [companies, search]);

  return (
    <main className="flex-1 bg-muted/20 pb-20">
      <div className="bg-[#0F172A] py-16 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent" />
        <div className="container px-4 relative z-10 text-center">
          <h1 className="font-heading text-3xl font-extrabold md:text-5xl mb-6">Үздік компаниялар</h1>
          <p className="text-indigo-200 text-lg max-w-2xl mx-auto mb-10">Топ жұмыс берушілерді тауып, олардың ашық вакансияларын қараңыз</p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Компания атауы немесе саласы..." 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-14 pl-12 rounded-2xl text-lg focus-visible:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="container px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold">Барлық компаниялар</h2>
          <span className="text-muted-foreground">{filteredCompanies.length} компания табылды</span>
        </div>
        
        {isLoading && companies.length === 0 ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCompanies.map(comp => (
              <CompanyCard key={comp.id} company={comp} />
            ))}
          </div>
        )}

        {!isLoading && filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-bold">Компаниялар табылмады</h3>
            <p className="text-muted-foreground">Басқаша іздеп көріңіз</p>
          </div>
        )}
      </div>
    </main>
  );
}
