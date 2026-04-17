"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

// StatBox Component
interface StatBoxProps {
  target: number;
  suffix?: string;
  label: string;
}

export function StatBox({ target, suffix = "", label }: StatBoxProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 2000;

    const animation = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setCount(Math.floor(easeProgress * target));

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }, [target]);

  return (
    <div className="text-center group p-4 rounded-xl transition-all hover:bg-white/5">
      <strong className="block font-heading text-3xl font-extrabold text-white mb-1 group-hover:scale-110 transition-transform">
        {count.toLocaleString('ru-KZ')}{suffix}
      </strong>
      <span className="text-sm font-medium text-white/50 tracking-wide uppercase">{label}</span>
    </div>
  );
}

// SearchBar Component
export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    router.push(`/vacancies?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="fade-up-3 flex flex-col md:flex-row gap-2 bg-background p-2 rounded-3xl md:rounded-full shadow-[0_8px_40px_rgba(0,0,0,0.3)] max-w-4xl mx-auto w-full transition-shadow hover:shadow-[0_8px_50px_rgba(108,99,255,0.3)] border border-border">
      
      <div className="flex-1 flex items-center bg-transparent px-4 py-2 border-b md:border-b-0 md:border-r border-border">
        <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
        <Input 
          className="border-0 shadow-none focus-visible:ring-0 px-0 h-12 text-base" 
          placeholder="Мамандық, компания немесе кілт сөз..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex-1 flex items-center bg-transparent px-4 py-2 border-b md:border-b-0 md:border-r border-border">
        <MapPin className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
        <Input 
          className="border-0 shadow-none focus-visible:ring-0 px-0 h-12 text-base" 
          placeholder="Қала (мыс: Астана)" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <Button type="submit" className="h-12 md:h-14 px-8 rounded-2xl md:rounded-full font-bold bg-gradient-to-r from-primary to-indigo-600 hover:shadow-lg transition-transform hover:scale-105 active:scale-95 text-base m-1">
        Жұмыс іздеу
      </Button>
      
    </form>
  );
}
