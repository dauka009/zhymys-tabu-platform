"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useVacanciesStore } from "@/stores/vacancies.store";
import { useApplicationsStore } from "@/stores/applications.store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldAlert, 
  Settings,
  MoreVertical,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const data = [
  { name: 'Дүй', apps: 400, vacancies: 24 },
  { name: 'Сей', apps: 300, vacancies: 13 },
  { name: 'Сәр', apps: 200, vacancies: 98 },
  { name: 'Бей', apps: 278, vacancies: 39 },
  { name: 'Жұм', apps: 189, vacancies: 48 },
  { name: 'Сен', apps: 239, vacancies: 38 },
  { name: 'Жек', apps: 349, vacancies: 43 },
];

export default function AdminPage() {
  const { isAuth, user } = useAuthStore();
  const { vacancies } = useVacanciesStore();
  const { applications } = useApplicationsStore();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Note: In real app, check for role === 'admin'
  }, []);

  if (!isClient) return null;

  return (
    <main className="flex-1 bg-muted/20 p-6 md:p-10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
             <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                <ShieldAlert className="h-4 w-4" />
                ADMIN PANEL v2.4
             </div>
             <h1 className="font-heading text-3xl font-extrabold">Платформа Басқару</h1>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="gap-2 rounded-xl">
                <Activity className="h-4 w-4" /> Log-тар
             </Button>
             <Button className="gap-2 bg-primary rounded-xl font-bold">
                <Settings className="h-4 w-4" /> Баптаулар
             </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
           {[
             { title: "Жалпы вакансия", value: vacancies.length + 1200, icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+12%" },
             { title: "Пайдаланушылар", value: "85,432", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", trend: "+5.4%" },
             { title: "Өтініштер", value: applications.length + 4829, icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+20%" },
             { title: "Белсенділік", value: "94%", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10", trend: "+2.1%" },
           ].map((stat, i) => (
             <Card key={i} className="border-0 shadow-sm hover:shadow-md transition-shadow transition-transform hover:-translate-y-1">
               <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className={`h-12 w-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                       <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full">
                       <ArrowUpRight className="h-3 w-3" /> {stat.trend}
                    </div>
                 </div>
                 <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.title}</div>
                 <div className="text-3xl font-extrabold mt-1">{stat.value}</div>
               </CardContent>
             </Card>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Chart */}
           <Card className="lg:col-span-2 border-0 shadow-lg">
             <CardHeader>
               <CardTitle>Белсенділік статистикасы</CardTitle>
               <CardDescription>Соңғы 7 күндегі өтініштер динамикасы</CardDescription>
             </CardHeader>
             <CardContent className="h-[350px] pt-10">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
                    <Tooltip cursor={{fill: 'rgba(108,99,255,0.05)'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    <Bar dataKey="apps" fill="#6C63FF" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
             </CardContent>
           </Card>

           {/* Moderation List */}
           <Card className="border-0 shadow-lg">
             <CardHeader>
               <div className="flex justify-between items-center">
                  <CardTitle>Модерация</CardTitle>
                  <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-4 w-4" /></Button>
               </div>
               <CardDescription>Тексеруді қажет ететін вакансиялар</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                {[
                  { title: "React Developer", company: "A-Tech", status: "Күтуде" },
                  { title: "Manager SMM", company: "Local Store", status: "Күтуде" },
                  { title: "Accountant", company: "Fin Group", status: "Тексерілді" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center group">
                     <div>
                        <div className="font-bold group-hover:text-primary transition-colors">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.company}</div>
                     </div>
                     <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${item.status === 'Күтуде' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {item.status}
                     </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-4 rounded-xl font-bold">Барлығын көру</Button>
             </CardContent>
           </Card>
        </div>

      </div>
    </main>
  );
}
