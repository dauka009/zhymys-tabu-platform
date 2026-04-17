"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle, Briefcase, FileText, Settings, Heart, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  const { isAuth, role } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!isAuth) {
      router.push("/login");
    }
  }, [isAuth, router]);

  if (!isClient || !isAuth) return null;

  const seekerNav = [
    { name: "Басты профиль", href: "/cabinet", icon: UserCircle },
    { name: "Менің өтініштерім", href: "/cabinet/applications", icon: Briefcase },
    { name: "Түйіндеме (CV)", href: "/cabinet/resume", icon: FileText },
    { name: "Сақталған жұмыстар", href: "/cabinet/saved", icon: Heart },
    { name: "Баптаулар", href: "/cabinet/settings", icon: Settings },
  ];

  const employerNav = [
    { name: "Басты бақылау", href: "/cabinet", icon: UserCircle },
    { name: "Менің вакансияларым", href: "/cabinet/vacancies", icon: Briefcase },
    { name: "Кандидаттар", href: "/cabinet/candidates", icon: FileText },
    { name: "Баптаулар", href: "/cabinet/settings", icon: Settings },
  ];

  const navLinks = role === 'seeker' ? seekerNav : employerNav;

  return (
    <div className="flex-1 bg-muted/20 pb-20">
      <div className="bg-[#0F172A] py-12 text-white relative h-48">
        <div className="container px-4 relative z-10 flex justify-between items-center">
          <div>
            <h1 className="font-heading text-3xl font-extrabold md:text-4xl">Жеке кабинет</h1>
            <p className="mt-2 text-indigo-200">Сіздің мансаптық кеңістігіңіз</p>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="container px-4 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-6">
          
          <aside className="w-full lg:w-1/4">
            <div className="bg-card border rounded-2xl p-4 shadow-sm sticky top-24">
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-medium",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          <main className="w-full lg:w-3/4">
            <div className="bg-card border rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
              {children}
            </div>
          </main>
          
        </div>
      </div>
    </div>
  );
}
