"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { ReviewPanel, FieldItem } from "@/components/organisms/ReviewPanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

export default function CompanyReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/moderation/companies/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setCompany(data);
      })
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: string, comment?: string, fields?: any) => {
    try {
      const res = await fetch(`/api/admin/moderation/companies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, comment, fields })
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success(`Компания статусы өзгертілді: ${status}`);
      router.push("/admin");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground">Жүктелуде...</div>;
  if (!company) return <div className="p-12 text-center text-red-500">Компания табылмады</div>;

  const fields: FieldItem[] = [
    { key: "display_name", label: "Компания атауы", value: company.display_name },
    { key: "legal_name", label: "Заңды атауы", value: company.legal_name },
    { key: "description", label: "Сипаттама", value: company.description },
    { key: "website_url", label: "Сайт", value: company.website_url },
    { key: "industry", label: "Саласы", value: Array.isArray(company.industry) ? company.industry.join(", ") : (company.industry || "Көрсетілмеген") }
  ];

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="text-xs text-muted-foreground font-medium uppercase">Компания Модерациясы</div>
            <div className="font-heading text-lg font-bold">{company.display_name}</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-background rounded-xl p-6 border shadow-sm">
              <h2 className="text-xl font-bold mb-4">Компания мәліметтері</h2>
              <div className="space-y-4">
                {fields.map(f => (
                  <div key={f.key}>
                    <div className="text-sm font-medium text-muted-foreground mb-1">{f.label}</div>
                    <div className="bg-muted/30 p-3 rounded-lg text-sm">{f.value || "Көрсетілмеген"}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 sticky top-24 h-[calc(100vh-120px)] pb-8">
            <ReviewPanel
              fields={fields}
              currentStatus={company.review_status}
              onApprove={() => updateStatus("APPROVED")}
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
