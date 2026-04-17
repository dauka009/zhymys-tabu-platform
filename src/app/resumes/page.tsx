"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Briefcase, GraduationCap, Filter, User } from "lucide-react";
import { TagBadge } from "@/components/atoms/TagBadge";
import Link from "next/link";

// Mock Resumes for the Demo
const MOCK_RESUMES = [
  {
    id: "res_1",
    name: "Азамат Қайратов",
    job: "Senior Frontend Developer",
    location: "Алматы",
    skills: ["React", "TypeScript", "Next.js", "Tailwind"],
    experience: "8 жыл",
    education: "ҚБТУ (KBTU)",
    description: "Ірі финтех жобаларда тәжірибем бар. Масштабталатын интерфейстер құруға маманданғанмын."
  },
  {
    id: "res_2",
    name: "Әйгерім Серікқызы",
    job: "Product Designer (UI/UX)",
    location: "Астана",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping"],
    experience: "4 жыл",
    education: "Назарбаев Университеті",
    description: "Қолданушыға ыңғайлы және эстетикалық жағымды мобильді қосымшалар жасаймын."
  },
  {
    id: "res_3",
    name: "Дәурен Мұрат",
    job: "Backend Developer (Node.js)",
    location: "Шымкент / Қашықтықтан",
    skills: ["Node.js", "PostgreSQL", "Docker", "AWS"],
    experience: "6 жыл",
    education: "Сәтбаев Университеті",
    description: "Жоғары жүктемелі серверлік шешімдер мен микросервистік архитектурамен жұмыс."
  },
  {
    id: "res_4",
    name: "Диана Бауыржан",
    job: "Data Analyst",
    location: "Алматы",
    skills: ["Python", "SQL", "Tableau", "Statistics"],
    experience: "3 жыл",
    education: "Нархоз Университеті",
    description: "Деректерді талдау арқылы бизнес шешімдерін оңтайландыру."
  },
  {
    id: "res_5",
    name: "Ерлан Самат",
    job: "QA Automation Engineer",
    location: "Астана",
    skills: ["Cypress", "Selenium", "Java", "CI/CD"],
    experience: "5 жыл",
    education: "МУИТ (IITU)",
    description: "Автоматтандырылған тестілеу жүйелерін құру және сапаны бақылау."
  }
];

export default function ResumesPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredResumes = useMemo(() => {
    return MOCK_RESUMES.filter(res => {
      const matchesQuery = res.job.toLowerCase().includes(query.toLowerCase()) || 
                          res.name.toLowerCase().includes(query.toLowerCase()) ||
                          res.skills.some(s => s.toLowerCase().includes(query.toLowerCase()));
      return matchesQuery;
    });
  }, [query]);

  return (
    <main className="flex-1 bg-muted/20 pb-20">
      <div className="bg-[#0F172A] py-16 text-white text-center">
        <div className="container px-4">
          <h1 className="font-heading text-4xl font-extrabold mb-4">Резюме базасы</h1>
          <p className="text-indigo-200 mb-8 max-w-xl mx-auto">
            Біздің платформадағы үміткерлердің кәсіби профильдерін қарап шығыңыз. 
            Ең үздік мамандарды фильтрлер арқылы оңай табыңыз.
          </p>
          
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Мамандық немесе дағдылар..." 
                  className="pl-12 h-12 bg-white text-foreground rounded-xl"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
             </div>
             <Button className="h-12 px-8 rounded-xl bg-primary font-bold">Іздеу</Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
           
           {/* Filters Sidebar */}
           <aside className="w-full lg:w-1/4">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" /> Сүзгілер
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-3">
                      <label className="text-sm font-bold">Орналасқан жері</label>
                      <select className="w-full bg-muted p-3 rounded-lg text-sm border-0 focus:ring-1 ring-primary outline-none">
                        <option>Барлық қалалар</option>
                        <option>Алматы</option>
                        <option>Астана</option>
                        <option>Шымкент</option>
                        <option>Қашықтықтан</option>
                      </select>
                   </div>
                   <div className="space-y-3">
                      <label className="text-sm font-bold">Жұмыс тәжірибесі</label>
                      <div className="space-y-2">
                        {["Тәжірибесіз", "1-3 жыл", "3-5 жыл", "5 жылдан көп"].map(opt => (
                           <div key={opt} className="flex items-center gap-2">
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                              <span className="text-sm">{opt}</span>
                           </div>
                        ))}
                      </div>
                   </div>
                   <Button variant="outline" className="w-full" onClick={() => setQuery("")}>Тазарту</Button>
                </CardContent>
              </Card>
           </aside>

           {/* Results List */}
           <div className="flex-1 space-y-4">
              <div className="flex justify-between items-center mb-6">
                 <div className="text-sm font-medium text-muted-foreground">
                    Табылды: <span className="text-foreground">{filteredResumes.length} маман</span>
                 </div>
                 <select className="text-sm bg-transparent border-0 font-medium outline-none">
                    <option>Жаңартылғандар бойынша</option>
                    <option>Ескілері бойынша</option>
                 </select>
              </div>

              {filteredResumes.map(res => (
                <Card key={res.id} className="hover:shadow-lg transition-shadow border-0 shadow-sm overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                       <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
                          <User className="h-8 w-8" />
                       </div>
                       <div className="flex-1 space-y-3">
                          <div className="flex justify-between items-start">
                             <div>
                                <h3 className="text-xl font-bold">{res.job}</h3>
                                <p className="text-primary font-bold text-sm tracking-wide">{res.name}</p>
                             </div>
                             <Button variant="ghost" className="text-primary font-bold hover:bg-primary/10">Профильді ашу</Button>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                             <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {res.location}</div>
                             <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {res.experience}</div>
                             <div className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {res.education}</div>
                          </div>

                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 italic italic-muted">
                            "{res.description}"
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-2">
                             {res.skills.map(skill => (
                               <TagBadge key={skill} label={skill} variant="blue" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20" />
                             ))}
                          </div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredResumes.length === 0 && (
                <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed">
                   <div className="text-6xl mb-4">🔍</div>
                   <h3 className="text-xl font-bold">Сәйкес мамандар табылмады</h3>
                   <p className="text-muted-foreground">Іздеу параметрлерін өзгертіп көріңіз</p>
                </div>
              )}
           </div>

        </div>
      </div>
    </main>
  );
}
