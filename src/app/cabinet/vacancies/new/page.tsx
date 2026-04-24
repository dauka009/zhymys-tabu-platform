"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";

export default function NewVacancyPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary_min: "",
    salary_max: "",
    category: "it",
    employment_type: "FULL_TIME",
    work_mode: "REMOTE",
    emoji: "💼",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          employerId: user?.id,
          salary: {
            min: Number(formData.salary_min),
            max: formData.salary_max ? Number(formData.salary_max) : undefined,
            currency: "KZT"
          }
        }),
      });

      if (res.ok) {
        toast.success("Вакансия сәтті қосылды!");
        router.push("/cabinet/vacancies");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Қате шықты");
      }
    } catch (err) {
      toast.error("Сервермен байланыс жоқ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/cabinet/vacancies">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <div>
          <h2 className="font-heading text-2xl font-bold">Жаңа вакансия қосу</h2>
          <p className="text-muted-foreground">Барлық өрістерді толтырыңыз</p>
        </div>
      </div>

      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="title">Вакансия атауы</Label>
                <Input 
                  id="title" 
                  placeholder="Мысалы: Senior React Developer" 
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label>Санат</Label>
                <Select value={formData.category} onValueChange={v => setFormData(prev => ({ ...prev, category: v }))}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Санатты таңдаңыз" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="it">IT & Технологиялар</SelectItem>
                    <SelectItem value="marketing">Маркетинг</SelectItem>
                    <SelectItem value="finance">Қаржы</SelectItem>
                    <SelectItem value="design">Дизайн</SelectItem>
                    <SelectItem value="other">Басқа</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Жұмыс түрі</Label>
                <Select value={formData.employment_type} onValueChange={v => setFormData(prev => ({ ...prev, employment_type: v }))}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Таңдаңыз" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL_TIME">Толық күн (Full-time)</SelectItem>
                    <SelectItem value="PART_TIME">Жартылай күн (Part-time)</SelectItem>
                    <SelectItem value="INTERNSHIP">Тағылымдама (Internship)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Жұмыс режимі</Label>
                <Select value={formData.work_mode} onValueChange={v => setFormData(prev => ({ ...prev, work_mode: v }))}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder="Таңдаңыз" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REMOTE">Қашықтан (Remote)</SelectItem>
                    <SelectItem value="HYBRID">Гибрид (Hybrid)</SelectItem>
                    <SelectItem value="ONSITE">Офис (On-site)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Эмодзи / Иконка</Label>
                <Input 
                  value={formData.emoji}
                  onChange={e => setFormData(prev => ({ ...prev, emoji: e.target.value }))}
                  placeholder="💼"
                  className="h-12 rounded-xl text-center text-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_min">Жалақы (минималды)</Label>
                <Input 
                  id="salary_min" 
                  type="number"
                  placeholder="300000" 
                  value={formData.salary_min}
                  onChange={e => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_max">Жалақы (максималды - міндетті емес)</Label>
                <Input 
                  id="salary_max" 
                  type="number"
                  placeholder="500000" 
                  value={formData.salary_max}
                  onChange={e => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Сипаттама</Label>
                <Textarea 
                  id="description" 
                  placeholder="Жұмыс шарттары, талаптар мен міндеттер..." 
                  className="min-h-[200px] rounded-xl resize-none"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <Link href="/cabinet/vacancies">
                <Button variant="outline" type="button" className="rounded-xl px-8 h-12">Бас тарту</Button>
              </Link>
              <Button type="submit" disabled={loading} className="rounded-xl px-12 h-12 gap-2 shadow-lg shadow-primary/20">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Жариялау
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
