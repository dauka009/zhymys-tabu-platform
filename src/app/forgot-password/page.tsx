"use client";

import { useState } from "react";
import Link from "next/link";
import { Briefcase, Mail, KeyRound, CheckCircle, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Step = "email" | "code" | "newpass" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  /* ── 1-қадам: Email жіберу ── */
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email енгізіңіз");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Қате шықты");
      toast.success("Код жіберілді! Email-ді тексеріңіз.");
      if (data.previewUrl) setPreviewUrl(data.previewUrl);
      setStep("code");
    } catch {
      toast.error("Сервермен байланыс жоқ");
    } finally {
      setLoading(false);
    }
  };

  /* ── 2-қадам: Кодты СЕРВЕР арқылы тексеру ── */
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return toast.error("6 таңбалы код енгізіңіз");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Код дұрыс емес");
      toast.success("Код расталды! Жаңа құпиясөз орнатыңыз.");
      setStep("newpass");
    } catch {
      toast.error("Сервермен байланыс жоқ");
    } finally {
      setLoading(false);
    }
  };

  /* ── 3-қадам: Жаңа құпиясөз ── */
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return toast.error("Кемінде 8 символ қажет");
    if (newPassword !== confirmPassword) return toast.error("Құпиясөздер сәйкес емес");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error || "Қате шықты");
      toast.success("Құпиясөз жаңартылды!");
      setStep("done");
    } catch {
      toast.error("Сервермен байланыс жоқ");
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = { email: 1, code: 2, newpass: 3, done: 3 }[step];

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0F172A] p-4">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(108,99,255,0.2)_0%,transparent_70%)]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-600 shadow-lg shadow-primary/30">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold text-white">
            Жұмыс<span className="text-primary">Тап</span>
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Progress steps */}
          {step !== "done" && (
            <div className="flex items-center gap-2 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s < stepIndex ? "bg-green-500 text-white" :
                    s === stepIndex ? "bg-primary text-white shadow-lg shadow-primary/40" :
                    "bg-white/10 text-white/40"
                  }`}>
                    {s < stepIndex ? "✓" : s}
                  </div>
                  {s < 3 && (
                    <div className={`flex-1 h-0.5 rounded-full transition-all ${s < stepIndex ? "bg-green-500" : "bg-white/10"}`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── STEP 1: Email ── */}
          {step === "email" && (
            <>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-2xl font-extrabold text-white">Құпиясөзді ұмыттыңыз ба?</h1>
                <p className="text-white/50 mt-2 text-sm">Email-іңізді енгізіңіз — растау коды жіберіледі.</p>
              </div>
              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <Label className="text-white/70 text-sm">Email адресі</Label>
                  <Input
                    type="email"
                    placeholder="sizin@email.kz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-primary h-12"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-indigo-600 shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Код жіберу"}
                </Button>
              </form>
            </>
          )}

          {/* ── STEP 2: Code ── */}
          {step === "code" && (
            <>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-4">
                  <KeyRound className="h-7 w-7 text-indigo-400" />
                </div>
                <h1 className="text-2xl font-extrabold text-white">Кодты енгізіңіз</h1>
                <p className="text-white/50 mt-2 text-sm">
                  <span className="text-white font-medium">{email}</span> адресіне 6 таңбалы код жіберілді.
                </p>
              </div>

              {/* Тестілік preview URL */}
              {previewUrl && (
                <div className="mb-4 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-yellow-300 text-xs font-medium mb-1">🧪 Тестілік режим — нақты email жоқ</p>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-yellow-400 underline text-xs break-all"
                  >
                    Emailді осы жерден көру →
                  </a>
                </div>
              )}

              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div>
                  <Label className="text-white/70 text-sm">6 таңбалы код</Label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="● ● ● ● ● ●"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-primary h-14 text-center text-2xl font-bold tracking-[0.5em]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:opacity-90"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Растау"}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="w-full text-white/40 text-sm hover:text-white/70 transition-colors"
                >
                  Кодты қайта жіберу
                </button>
              </form>
            </>
          )}

          {/* ── STEP 3: New password ── */}
          {step === "newpass" && (
            <>
              <div className="mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <KeyRound className="h-7 w-7 text-purple-400" />
                </div>
                <h1 className="text-2xl font-extrabold text-white">Жаңа құпиясөз</h1>
                <p className="text-white/50 mt-2 text-sm">Жаңа, күшті құпиясөз ойлап табыңыз.</p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label className="text-white/70 text-sm">Жаңа құпиясөз</Label>
                  <div className="relative mt-1.5">
                    <Input
                      type={showPass ? "text" : "password"}
                      placeholder="Кемінде 8 символ"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-primary h-12 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-3 text-white/40 hover:text-white/80"
                    >
                      {showPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label className="text-white/70 text-sm">Растау</Label>
                  <Input
                    type="password"
                    placeholder="Қайталаңыз"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5 bg-white/10 border-white/20 text-white placeholder:text-white/30 focus:border-primary h-12"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base font-bold bg-gradient-to-r from-purple-600 to-primary shadow-lg hover:opacity-90"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Сақтау"}
                </Button>
              </form>
            </>
          )}

          {/* ── DONE ── */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
              <h1 className="text-2xl font-extrabold text-white mb-2">Дайын! 🎉</h1>
              <p className="text-white/50 text-sm mb-8">Құпиясөзіңіз сәтті жаңартылды.</p>
              <Button
                onClick={() => router.push("/login")}
                className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-indigo-600"
              >
                Жүйеге кіру
              </Button>
            </div>
          )}

          {/* Back link */}
          {step !== "done" && (
            <div className="mt-6 text-center">
              <Link href="/login" className="flex items-center justify-center gap-1.5 text-white/40 text-sm hover:text-white/70 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Кіру бетіне оралу
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
