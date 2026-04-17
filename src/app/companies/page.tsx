import { MOCK_COMPANIES } from "@/lib/mock-data";
import { CompanyCard } from "@/components/molecules/CompanyCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const metadata = {
  title: "Компаниялар — ЖұмысТап",
  description: "Үздік жұмыс берушілер",
};

export default function CompaniesPage() {
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
              placeholder="Компания атауы немесе саласы..." 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-14 pl-12 rounded-2xl text-lg focus-visible:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="container px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading text-2xl font-bold">Барлық компаниялар</h2>
          <span className="text-muted-foreground">{MOCK_COMPANIES.length} компания табылды</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_COMPANIES.map(comp => (
            <CompanyCard key={comp.id} company={comp} />
          ))}
        </div>
      </div>
    </main>
  );
}
