"use client";

import Link from "next/link";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth.store";

export default function AccessDeniedPage() {
  const { user, isAuth } = useAuthStore();

  return (
    <main className="flex-1 flex items-center justify-center min-h-[calc(100vh-120px)] p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="h-12 w-12 text-destructive" />
          </div>
        </div>

        {/* Text */}
        <h1 className="font-heading text-3xl font-extrabold mb-3">
          Қатынас тыйым салынған
        </h1>
        <p className="text-muted-foreground text-lg mb-2">
          <span className="font-bold text-destructive">Access Denied</span>
        </p>
        <p className="text-muted-foreground mb-2">
          Бұл бетке кіруге рұқсатыңыз жоқ.
        </p>

        {isAuth && user && (
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-sm text-muted-foreground">
            Сіздің рөліңіз:{" "}
            <span className="font-bold text-foreground uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-md">
              {user.role}
            </span>
            <br />
            Бұл бет тек{" "}
            <span className="font-bold text-foreground">ADMIN</span> рөлі үшін
            қолжетімді.
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="outline" className="gap-2 rounded-xl w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Басты бетке
            </Button>
          </Link>
          <Link href="/cabinet">
            <Button className="gap-2 rounded-xl w-full sm:w-auto bg-gradient-to-r from-primary to-indigo-600">
              <ArrowLeft className="h-4 w-4" />
              Жеке кабинет
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
