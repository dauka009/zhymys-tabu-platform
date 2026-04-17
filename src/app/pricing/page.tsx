"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap, Building2, Rocket } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Тегін",
    price: "0",
    description: "Шағын бизнес немесе алғашқы қадамдар үшін",
    icon: Zap,
    features: [
      "1 белсенді вакансия",
      "Стандартты іздеу",
      "7 күнге жариялау",
      "Базалық статистика",
      "Email қолдау"
    ],
    buttonText: "Тегін бастау",
    highlight: false
  },
  {
    name: "Стандарт",
    price: "15,000",
    description: "Өсіп келе жатқан компаниялар үшін ең қолайлы",
    icon: Building2,
    features: [
      "10 белсенді вакансия",
      "Тізімнің жоғарғы жағында 3 күн",
      "30 күнге жариялау",
      "Профильдерді қарау (50/ай)",
      "Приоритетті қолдау"
    ],
    buttonText: "Таңдау",
    highlight: true
  },
  {
    name: "Премиум",
    price: "45,000",
    description: "Үлкен корпорациялар мен HR агенттіктер үшін",
    icon: Rocket,
    features: [
      "Шексіз вакансиялар",
      "Тізімнің жоғарғы жағында үнемі",
      "CV базасына толық қол жетімділік",
      "Персоналды HR-менеджер",
      "Employer Branding құралдары"
    ],
    buttonText: "Байланысу",
    highlight: false
  }
];

export default function PricingPage() {
  return (
    <main className="flex-1 bg-muted/20 pb-20">
      {/* Header Section */}
      <div className="bg-[#0F172A] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-indigo-900/40" />
        <div className="container relative z-10 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold mb-6 animate-fade-up">Тарифтік жоспарлар</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto animate-fade-up delay-100">
            Сіздің компанияңыздың көлеміне қарамастан, бізде тиімді шешім бар. 
            Тиімді тарифті таңдап, ең үздік мамандарды бүгін табыңыз.
          </p>
        </div>
      </div>

      <div className="container px-4 py-16 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <Card 
              key={plan.name} 
              className={`border-0 shadow-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                plan.highlight ? "ring-2 ring-primary scale-105 z-10" : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider py-1 px-8 rotate-45 translate-x-[25px] translate-y-[10px]">
                    Popuar
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pt-10">
                <div className={`h-14 w-14 rounded-2xl mx-auto flex items-center justify-center mb-4 ${
                  plan.highlight ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  <plan.icon className="h-7 w-7" />
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <CardDescription className="min-h-[40px] mt-2">{plan.description}</CardDescription>
                <div className="mt-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1 font-medium">₸ / ай</span>
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
                        plan.highlight ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                      }`}>
                        <Check className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="px-8 pb-10">
                <Button 
                  className={`w-full h-12 rounded-xl font-bold transition-all ${
                    plan.highlight 
                      ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" 
                      : "variant-outline"
                  }`}
                  asChild
                >
                  <Link href="/contact">{plan.buttonText}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ Section Placeholder */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold mb-4">Сұрақтарыңыз бар ма?</h2>
          <p className="text-muted-foreground mb-8">Біздің менеджерлер сізге көмектесуге әрқашан дайын.</p>
          <Button variant="outline" className="rounded-xl px-8 h-12" asChild>
            <Link href="/contact">Квасу беру</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
