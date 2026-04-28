"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export interface FieldItem {
  key: string;
  label: string;
  value: any;
}

interface ReviewPanelProps {
  fields: FieldItem[];
  onApprove: () => void;
  onReject: () => void;
  onReturnForFixes: (comment: string, fieldErrors: Record<string, string>) => void;
  currentStatus?: string;
  onCancel?: () => void;
}

export function ReviewPanel({ fields, onApprove, onReject, onReturnForFixes, currentStatus, onCancel }: ReviewPanelProps) {
  const [generalComment, setGeneralComment] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const toggleFieldError = (key: string, errorText: string) => {
    setFieldErrors(prev => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = errorText;
      }
      return next;
    });
  };

  const handleReturn = () => {
    if (!generalComment && Object.keys(fieldErrors).length === 0) {
      alert("Ескерту немесе қателерді көрсетіңіз");
      return;
    }
    onReturnForFixes(generalComment, fieldErrors);
  };

  if (currentStatus && currentStatus !== "PENDING_REVIEW") {
    let message = "";
    let colorClass = "";
    if (currentStatus === "APPROVED" || currentStatus === "PUBLISHED") {
      message = "✅ Бекітілді";
      colorClass = "text-emerald-600 bg-emerald-50 border-emerald-200";
    } else if (currentStatus === "NEEDS_FIX") {
      message = "⚠️ Қайтарып жіберілді";
      colorClass = "text-amber-600 bg-amber-50 border-amber-200";
    } else if (currentStatus === "REJECTED") {
      message = "❌ Қабылданбады";
      colorClass = "text-red-600 bg-red-50 border-red-200";
    }

    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Модерация күйі</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center gap-4">
          <div className={`p-6 border rounded-xl text-center ${colorClass}`}>
            <div className="font-bold text-lg mb-2">{message}</div>
            <p className="text-sm opacity-80 mb-6">Жұмыс беруші өзгерістер енгізіп, қайта жібергенше күтуде...</p>
            {onCancel && (
              <Button onClick={onCancel} variant="outline" className="w-full bg-white shadow-sm">
                Болдырмау (Отмена)
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Модерация</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6 overflow-y-auto">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Өрістерді тексеру (Checklist)</h3>
          {fields.map(field => (
            <div key={field.key} className="border rounded-lg p-3 space-y-2 bg-muted/20">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-muted-foreground">{field.label}</div>
                  <div className="text-sm font-medium mt-1 break-words">
                    {typeof field.value === "string" && field.value.length > 100
                      ? field.value.substring(0, 100) + "..."
                      : String(field.value || "—")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant={fieldErrors[field.key] ? "destructive" : "ghost"}
                    className="h-7 w-7 rounded-full"
                    onClick={() => toggleFieldError(field.key, "Дұрыс толтырылмаған")}
                  >
                    {fieldErrors[field.key] ? <AlertCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              {fieldErrors[field.key] && (
                <Textarea
                  value={fieldErrors[field.key]}
                  onChange={e => setFieldErrors(prev => ({ ...prev, [field.key]: e.target.value }))}
                  placeholder="Қатені сипаттаңыз..."
                  className="h-16 text-sm"
                />
              )}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Жалпы комментарий</Label>
          <Textarea
            value={generalComment}
            onChange={e => setGeneralComment(e.target.value)}
            placeholder="Жалпы ескертулер немесе ұсыныстар..."
            className="h-24"
          />
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <Button onClick={onApprove} className="w-full bg-emerald-600 hover:bg-emerald-700">
            <CheckCircle className="w-4 h-4 mr-2" />
            Бекіту (Approve / Publish)
          </Button>
          <Button onClick={handleReturn} variant="outline" className="w-full text-amber-600 border-amber-200 hover:bg-amber-50">
            <AlertCircle className="w-4 h-4 mr-2" />
            Қайтарып жіберу (Needs Fix)
          </Button>
          <Button onClick={onReject} variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            <XCircle className="w-4 h-4 mr-2" />
            Қабылдамау (Reject)
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
