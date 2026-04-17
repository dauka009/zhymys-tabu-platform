"use client";

import { HeroSection } from "@/components/organisms/HeroSection";
import { LiveTicker } from "@/components/organisms/LiveTicker";
import { FeaturedJobs } from "@/components/organisms/FeaturedJobs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagBadge } from "@/components/atoms/TagBadge";

const categories = [
  { icon: "💻", title: "IT & Бағдарламалау", desc: "Frontend, Backend, DevOps, Data Science және мобильді қосымша әзірлеушілер үшін", tag: "3,240 вакансия", color: "purple" as const },
  { icon: "📊", title: "Маркетинг & SMM", desc: "Digital маркетинг, контент жасау, SEO, таргетолог мамандықтары", tag: "1,890 вакансия", color: "blue" as const },
  { icon: "💰", title: "Қаржы & Банк", desc: "Бухгалтер, қаржы аналитигі, аудитор, несие менеджері", tag: "2,100 вакансия", color: "green" as const },
  { icon: "🎨", title: "Дизайн & Шығармашылық", desc: "Графикалық дизайнер, UX/UI, фотограф, видеограф", tag: "980 вакансия", color: "orange" as const },
  { icon: "⚕️", title: "Медицина & Денсаулық", desc: "Дәрігер, медбике, фармацевт, психолог мамандықтары", tag: "1,450 вакансия", color: "green" as const },
  { icon: "📚", title: "Білім & Оқыту", desc: "Мұғалім, тренер, оқытушы, курс авторы позициялары", tag: "760 вакансия", color: "blue" as const },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <LiveTicker />
      <FeaturedJobs />

      {/* Categories Section */}
      <section className="py-20 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wide uppercase mb-4">
              Санаттар
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-4">
              Сала бойынша жұмыс іздеу
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Өзіңізге сәйкес саланы таңдап, мансабыңызды жаңа белеске көтеріңіз
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                className="group relative bg-card border rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  {cat.icon}
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">{cat.title}</h3>
                <p className="text-muted-foreground mb-6 line-clamp-2">{cat.desc}</p>
                <TagBadge label={cat.tag} variant={cat.color} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 relative overflow-hidden bg-[#0F172A]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-[#0F172A] -z-10" />
        <div className="container px-4 relative z-10 text-center max-w-3xl">
          <div className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-bold tracking-wide mb-6">
            📬 Тегін қызмет
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-white mb-6">
            Жаңа вакансиялардан хабардар болыңыз
          </h2>
          <p className="text-indigo-200/80 text-lg mb-10">
            Аптасына 2 рет — өзіңізге сәйкес вакансиялар тікелей email-ге. Спам жоқ, тек пайдалы ақпарат.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={(e) => {
            e.preventDefault();
            alert("Жазылу сәтті өтті!");
          }}>
            <Input 
              type="text" 
              placeholder="Атыңыз" 
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-xl focus-visible:ring-indigo-500" 
            />
            <Input 
              type="email" 
              placeholder="Email мекенжайы" 
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 rounded-xl focus-visible:ring-indigo-500" 
            />
            <Button type="submit" className="h-12 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl whitespace-nowrap">
              🔔 Жазылу
            </Button>
          </form>
          <p className="text-sm text-indigo-300/50 mt-4">
            Кез-келген уақытта жазылымды тоқтата аласыз.
          </p>
        </div>
      </section>

    </main>
  );
}
