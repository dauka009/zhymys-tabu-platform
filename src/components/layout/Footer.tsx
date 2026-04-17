import Link from "next/link";
import { Briefcase, Instagram, Send, Linkedin, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-sm group-hover:shadow-md transition-all">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="font-heading text-xl font-extrabold tracking-tight">
                Жұмыс<span className="text-primary">Тап</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Қазақстандағы ең ірі жұмыс табу платформасы. Жетекші компаниялар мен үздік мамандарды байланыстырамыз.
            </p>
            <div className="flex gap-2 mt-2">
              <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary">
                <Send className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary">
                <Facebook className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-lg">Платформа</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Басты бет</Link></li>
              <li><Link href="/vacancies" className="hover:text-primary transition-colors">Вакансиялар</Link></li>
              <li><Link href="/companies" className="hover:text-primary transition-colors">Компаниялар</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Байланыс</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-lg">Жұмыс берушілерге</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/cabinet" className="hover:text-primary transition-colors">Вакансия жариялау</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Тарифтер</Link></li>
              <li><Link href="/resumes" className="hover:text-primary transition-colors">CV базасы</Link></li>
              <li><Link href="/branding" className="hover:text-primary transition-colors">Брендинг</Link></li>
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="font-heading font-semibold text-lg">Іздеушілерге</h4>
            <ul className="flex flex-col gap-3 text-sm text-muted-foreground">
              <li><Link href="/vacancies" className="hover:text-primary transition-colors">Жұмыс іздеу</Link></li>
              <li><Link href="/cabinet/resume" className="hover:text-primary transition-colors">CV жасау</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Кеңестер</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Мансап тесті</Link></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ЖұмысТап. Барлық құқықтар қорғалған.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">Құпиялылық саясаты</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Пайдалану шарттары</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
