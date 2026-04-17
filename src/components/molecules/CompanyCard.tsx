import { Company } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Users, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import { TagBadge } from "@/components/atoms/TagBadge";

export function CompanyCard({ company }: { company: Company }) {
  // Demo mock count logic based on id
  const mockVacanciesCount = parseInt(company.id.split('_')[1] || "1") * 2 + 1;

  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border hover:border-primary/50 relative">
        <div className="absolute top-0 right-0 p-4">
          <TagBadge label={`${mockVacanciesCount} вакансия`} variant="blue" icon={<Briefcase className="h-3 w-3" />} />
        </div>
        <CardContent className="p-6 pt-10 flex flex-col h-full bg-gradient-to-b from-transparent to-muted/10">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-white shadow-sm border flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 relative z-10 overflow-hidden">
              {company.logo || "🏢"}
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl group-hover:text-primary transition-colors line-clamp-1">{company.name}</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{company.industry}</p>
            </div>
          </div>
          
          <div className="flex-1 mt-2">
            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
              {company.description}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t pt-4">
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{company.location}</span>
            </div>
            {company.size && (
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{company.size} қызметкер</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
