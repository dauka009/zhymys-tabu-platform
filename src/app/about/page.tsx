"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Shield, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "Қолжетімділік",
      description: "Барлық пайдаланушыларға теңдей мүмкіндік беру."
    },
    {
      icon: <Target className="h-8 w-8 text-green-500" />,
      title: "Нәтижелік",
      description: "Сапалы әрі жылдам жұмысқа орналасуға көмектесу."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Сенімділік",
      description: "Компаниялар мен үміткерлердің қауіпсіздігі."
    },
    {
      icon: <Zap className="h-8 w-8 text-amber-500" />,
      title: "Инновация",
      description: "Заманауи технологияларды қолдану арқылы процестерді оңтайландыру."
    }
  ];

  return (
    <main className="flex-1 bg-muted/10">
      {/* Hero Section */}
      <div className="bg-[#0F172A] py-24 text-white relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-indigo-900/40" />
        <div className="container relative z-10 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
            Біз туралы
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Жұмыс іздеушілер мен компанияларды байланыстыратын заманауи цифрлық платформа
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container px-4 py-20 text-center space-y-8">
        <h2 className="text-3xl font-bold leading-tight">Біздің миссиямыз</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed">
          Біздің басты мақсатымыз – әрбір маманның өз арманындағы жұмысын табуына және 
          компаниялардың ең үздік таланттарды тартуына көмектесу. Жұмыс іздеу процесін 
          ашық, жылдам әрі тиімді ету арқылы еліміздің еңбек нарығын дамытамыз.
        </p>
      </div>

      {/* Values Section */}
      <div className="bg-background py-20 border-t">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Біздің құндылықтарымыз</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((item, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-2xl bg-muted group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-xl">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
