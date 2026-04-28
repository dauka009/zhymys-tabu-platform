"use client";

import { useAuthStore } from "@/stores/auth.store";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, Building2 } from "lucide-react";

export default function CompanyPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({
    displayName: "",
    legalName: "",
    logoUrl: "",
    description: "",
    websiteUrl: "",
  });
  const [reviewStatus, setReviewStatus] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewFields, setReviewFields] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.id) {
      fetchCompany();
    }
  }, [user]);

  const fetchCompany = async () => {
    try {
      const res = await fetch(`/api/employer/company?userId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.company) {
          setFormData({
            displayName: data.company.display_name || "",
            legalName: data.company.legal_name || "",
            logoUrl: data.company.logo_url || "",
            description: data.company.description || "",
            websiteUrl: data.company.website_url || "",
          });
          setReviewStatus(data.company.review_status);
          setReviewComment(data.company.review_comment || "");
          setReviewFields(typeof data.company.review_fields === "string" ? JSON.parse(data.company.review_fields) : (data.company.review_fields || {}));
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/employer/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, userId: user?.id }),
      });

      if (res.ok) {
        toast.success("Компания мәліметтері сәтті сақталды!");
        fetchCompany();
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

  const getStatusBadge = () => {
    switch (reviewStatus) {
      case "APPROVED": return <div className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase">Расталды</div>;
      case "PENDING_REVIEW": return <div className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase">Тексерілуде</div>;
      case "NEEDS_FIX": return <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase">Түзетуді қажет етеді</div>;
      case "REJECTED": return <div className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase">Қабылданбады</div>;
      default: return null;
    }
  };

  if (fetching) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold">Менің компаниям</h2>
            <p className="text-muted-foreground">Компанияңыз туралы ақпаратты толтырыңыз</p>
          </div>
        </div>
        <div>{getStatusBadge()}</div>
      </div>

      {(reviewStatus === "NEEDS_FIX" || reviewStatus === "REJECTED") && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
          <h3 className="font-bold mb-2">Модератор ескертуі:</h3>
          <p className="text-sm mb-4">{reviewComment || "Қателерді түзетіп қайта жіберіңіз."}</p>
          <ul className="list-disc pl-5 text-sm space-y-1">
            {Object.entries(reviewFields).map(([k, v]) => (
              <li key={k}><b>{k}:</b> {v}</li>
            ))}
          </ul>
        </div>
      )}

      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="displayName">Компания атауы</Label>
                <Input 
                  id="displayName" 
                  placeholder="Мысалы: Kaspi.kz" 
                  value={formData.displayName}
                  onChange={e => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  required
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalName">Заңды атауы (ЖШС, АҚ)</Label>
                <Input 
                  id="legalName" 
                  placeholder="Мысалы: Kaspi.kz ЖШС" 
                  value={formData.legalName}
                  onChange={e => setFormData(prev => ({ ...prev, legalName: e.target.value }))}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="logoUrl">Логотип сілтемесі (URL)</Label>
                <Input 
                  id="logoUrl" 
                  placeholder="https://mysite.com/logo.png" 
                  value={formData.logoUrl}
                  onChange={e => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="h-12 rounded-xl"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="websiteUrl">Сайт сілтемесі (URL)</Label>
                <Input 
                  id="websiteUrl" 
                  placeholder="https://kaspi.kz" 
                  value={formData.websiteUrl}
                  onChange={e => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                  className="h-12 rounded-xl"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Сипаттама</Label>
                <Textarea 
                  id="description" 
                  placeholder="Компанияңыз туралы қысқаша мәлімет..." 
                  className="min-h-[150px] rounded-xl resize-none"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading} className="rounded-xl px-12 h-12 gap-2 shadow-lg shadow-primary/20">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                {reviewStatus === "NEEDS_FIX" ? "Түзетіп қайта жіберу" : "Сақтау"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
