"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserCircle, Briefcase, FileText, Settings, Heart, Bell, LogOut, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  const { isAuth, role, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

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
    { name: "Менің компаниям", href: "/cabinet/company", icon: Building2 },
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

                {/* Жүйеден шығу батырмасы */}
                <div className="pt-2 mt-2 border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left font-medium text-red-500 hover:bg-red-500/10"
                  >
                    <LogOut className="h-5 w-5" />
                    Жүйеден шығу
                  </button>
                </div>
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
