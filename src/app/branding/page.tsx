"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function BrandingPage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0F172A] to-indigo-950 py-24 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
              Күшті <span className="text-primary italic">HR-бренд</span> — <br />
              табыстың кілті
            </h1>
            <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
              Платформамызда компанияңыздың имиджін қалыптастырыңыз, 
              үздік таланттарды тартыңыз және нарықтағы бәсекелестіктен алға шығыңыз.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-14 px-10 rounded-xl bg-primary font-bold text-lg hover:shadow-xl shadow-primary/20 transition-all">
                Кеңес алу
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-10 rounded-xl bg-white/5 border-white/20 hover:bg-white/10 text-white font-bold text-lg">
                Таныстырылым
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Брендинг құралдары</h2>
          <p className="text-muted-foreground">Біз сіздің компанияңызды ерекше көрсету үшін бәрін жасадық</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
             { title: "Жеке бет", desc: "Компанияның тарихы, мәдениеті мен артықшылықтары көрсетілген кәсіби бет.", icon: CheckCircle2 },
             { title: "Топ-вакансиялар", desc: "Сіздің жұмыс орындарыңыз іздеу тізімінің ең жоғарғы жағында болады.", icon: Star },
             { title: "Медиа-контент", desc: "Фото және видео материалдар арқылы компания атмосферасын көрсетіңіз.", icon: TrendingUp },
             { title: "Статистика", desc: "Кандидаттардың қызығушылығы мен қаралымдар туралы толық есеп.", icon: Users },
           ].map((item, i) => (
             <div key={i} className="p-8 rounded-3xl bg-muted/30 border border-border/50 hover:bg-white dark:hover:bg-card hover:shadow-xl transition-all duration-300">
               <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                 <item.icon className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-bold mb-3">{item.title}</h3>
               <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-muted/20 py-24">
         <div className="container px-4 text-center">
            <h2 className="text-2xl font-bold mb-12 opacity-50">БІЗБЕН ЖҰМЫС ІСТЕЙТІН КОМПАНИЯЛАР</h2>
            <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
               <div className="text-3xl font-black">KASPI.KZ</div>
               <div className="text-3xl font-black">AIR ASTANA</div>
               <div className="text-3xl font-black">FORTE BANK</div>
               <div className="text-3xl font-black">BI GROUP</div>
            </div>
         </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 container px-4 text-center">
         <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary to-indigo-600 rounded-[40px] p-12 text-white shadow-2xl shadow-primary/30">
            <h2 className="text-4xl font-extrabold mb-6">Бүгіннен бастаңыз</h2>
            <p className="text-indigo-100 mb-10 text-lg">
               Біздің мамандар сізге HR-стратегияңызды құруға көмектеседі.
            </p>
            <Button size="lg" className="h-14 px-12 rounded-2xl bg-white text-primary font-bold text-lg hover:bg-indigo-50 transition-colors">
               <Link href="/contact">Квасу беру</Link>
            </Button>
         </div>
      </section>
    </main>
  );
}
