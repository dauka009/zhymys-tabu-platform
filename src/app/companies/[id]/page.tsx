"use client";

import { notFound, useParams } from "next/navigation";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import { useVacanciesStore } from "@/stores/vacancies.store";
import { VacancyCard } from "@/components/molecules/VacancyCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Globe, Phone, ExternalLink, Briefcase } from "lucide-react";
import { useState, useEffect } from "react";

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const company = MOCK_COMPANIES.find(c => c.id === id);
  const { vacancies } = useVacanciesStore();
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;
  if (!company) return notFound();

  // Find vacancies for this company
  const companyVacancies = vacancies.filter(v => v.companyId === id);

  return (
    <main className="flex-1 bg-muted/20 pb-20">
      <div className="bg-[#0F172A] pt-20 pb-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-indigo-900/40" />
      </div>

      <div className="container px-4 -mt-24 relative z-10">
        <Card className="mb-8 shadow-xl border-t-4 border-t-primary">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-white shadow-md border text-6xl shadow-primary/20 -mt-16 md:mt-0">
                {company.logo || "🏢"}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                  <div>
                    <h1 className="font-heading text-3xl font-extrabold mb-2">{company.name}</h1>
                    <div className="text-primary font-medium tracking-wide uppercase">{company.industry}</div>
                  </div>
                  <Button className="shrink-0 gap-2 font-bold px-8 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white" variant="outline">
                    Жазылу
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mt-6">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{company.location}</span>
                  </div>
                  {company.size && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{company.size} қызметкер</span>
                    </div>
                  )}
                  {company.contacts.website && (
                    <a href={company.contacts.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Globe className="h-4 w-4" />
                      <span>{company.contacts.website.replace("https://", "")}</span>
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  )}
                  {company.contacts.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{company.contacts.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 space-y-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="font-heading text-2xl font-bold mb-4">Компания туралы</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <p>{company.description}</p>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="font-heading text-2xl font-bold mb-6">Ашық вакансиялар ({companyVacancies.length})</h2>
              {companyVacancies.length > 0 ? (
                <div className="grid gap-4">
                  {companyVacancies.map(vacancy => (
                    <VacancyCard key={vacancy.id} vacancy={vacancy} />
                  ))}
                </div>
              ) : (
                <Card className="bg-muted/50 border-dashed">
                  <CardContent className="p-12 text-center text-muted-foreground">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Қазіргі уақытта компанияда ашық вакансиялар жоқ</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <aside className="w-full lg:w-1/3">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-heading font-bold text-lg mb-4">Орналасуы</h3>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted mb-4 border relative group cursor-pointer">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d160249.26129482704!2d71.3093121545465!3d51.14781483863414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x424580c4733482bb%3A0xb9eb8a5d117070ef!2sAstana%20020000%2C%20Kazakhstan!5e0!3m2!1sen!2s!4v1714571213456!5m2!1sen!2s" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <p className="text-sm text-muted-foreground flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                  {company.location}, Қазақстан
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
