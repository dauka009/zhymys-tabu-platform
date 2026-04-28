"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ReviewPanel, FieldItem } from "@/components/organisms/ReviewPanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export default function VacancyReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [vacancy, setVacancy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/moderation/vacancies/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setVacancy(data);
      })
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string, comment?: string, fields?: any) => {
    try {
      const res = await fetch(`/api/admin/moderation/vacancies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comment, fields })
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(`Вакансия статусы өзгертілді: ${status}`);
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground">Жүктелуде...</div>;
  if (!vacancy) return <div className="p-12 text-center text-red-500">Вакансия табылмады</div>;

  const fields: FieldItem[] = [
    { key: "title", label: "Атауы", value: vacancy.title },
    { key: "company_name", label: "Компания", value: vacancy.company_name },
    { key: "description", label: "Сипаттама", value: vacancy.description },
    { key: "salary", label: "Жалақы", value: `${vacancy.salary_min || 0} - ${vacancy.salary_max || 0} ${vacancy.currency || 'KZT'}` },
    { key: "employment_type", label: "Жұмыс түрі", value: vacancy.employment_type },
    { key: "requirements", label: "Талаптар", value: vacancy.requirements || "Көрсетілмеген" },
    { key: "responsibilities", label: "Міндеттер", value: vacancy.responsibilities || "Көрсетілмеген" }
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase">Вакансия Модерациясы</div>
            <div className="font-heading text-lg font-bold">{vacancy.title}</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-background rounded-xl p-6 border shadow-sm">
              <h2 className="text-xl font-bold mb-4">Вакансия мәліметтері</h2>
              <div className="space-y-4">
                {fields.map(f => (
                  <div key={f.key}>
                    <div className="text-sm font-medium text-muted-foreground mb-1">{f.label}</div>
                    <div className="bg-muted/30 p-3 rounded-lg text-sm whitespace-pre-wrap">{f.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 sticky top-24 h-[calc(100vh-120px)] pb-8">
            <ReviewPanel
              fields={fields}
              currentStatus={vacancy.status}
              onApprove={() => updateStatus("PUBLISHED")}
              onReject={() => updateStatus("REJECTED")}
              onReturnForFixes={(comment, fieldErrors) => updateStatus("NEEDS_FIX", comment, fieldErrors)}
              onCancel={() => updateStatus("PENDING_REVIEW")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
