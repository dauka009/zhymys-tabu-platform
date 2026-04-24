"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users, Briefcase, ShieldAlert, Trash2, Edit2,
  Search, RefreshCw, CheckCircle, XCircle, Activity,
  ChevronDown, LogOut
} from "lucide-react";
import { toast } from "sonner";

type AdminTab = "users" | "vacancies" | "companies";

interface AdminUser {
  id: string; email: string; full_name: string;
  role: string; status: string; created_at: string;
}
interface AdminVacancy {
  id: string; title: string; status: string;
  company_name: string; employment_type: string; created_at: string;
}
interface AdminCompany {
  id: string; display_name: string; legal_name: string; owner_email: string; vacancies_count: number; created_at: string;
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  EMPLOYER: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  SEEKER: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700",
  SUSPENDED: "bg-amber-100 text-amber-700",
  BANNED: "bg-red-100 text-red-700",
  PUBLISHED: "bg-emerald-100 text-emerald-700",
  DRAFT: "bg-gray-100 text-gray-700",
  ARCHIVED: "bg-red-100 text-red-700",
  CLOSED: "bg-amber-100 text-amber-700",
};

export default function AdminPage() {
  const { isAuth, user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [tab, setTab] = useState<AdminTab>("users");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [vacancies, setVacancies] = useState<AdminVacancy[]>([]);
  const [companies, setCompanies] = useState<AdminCompany[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalVacancies, setTotalVacancies] = useState(0);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Auth guard — client-side
  useEffect(() => {
    if (!mounted) return;
    if (!isAuth) { router.replace("/login"); return; }
    if (user?.role !== "admin") { router.replace("/access-denied"); return; }
  }, [mounted, isAuth, user, router]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, ...(roleFilter && { role: roleFilter }) });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotalUsers(data.total || 0);
    } catch { toast.error("Пайдаланушыларды жүктеу қатесі"); }
    finally { setLoading(false); }
  }, [search, roleFilter]);

  const fetchVacancies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, ...(statusFilter && { status: statusFilter }) });
      const res = await fetch(`/api/admin/vacancies?${params}`);
      const data = await res.json();
      setVacancies(data.vacancies || []);
      setTotalVacancies(data.total || 0);
    } catch { toast.error("Вакансияларды жүктеу қатесі"); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search });
      const res = await fetch(`/api/admin/companies?${params}`);
      const data = await res.json();
      setCompanies(data.companies || []);
      setTotalCompanies(data.total || 0);
    } catch { toast.error("Компанияларды жүктеу қатесі"); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => {
    if (!mounted || user?.role !== "admin") return;
    if (tab === "users") fetchUsers();
    else if (tab === "vacancies") fetchVacancies();
    else fetchCompanies();
  }, [tab, mounted, user, fetchUsers, fetchVacancies, fetchCompanies]);

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`"${email}" пайдаланушысын жою?`)) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Пайдаланушы жойылды"); fetchUsers(); }
    else toast.error("Жою кезінде қате шықты");
  };

  const handleUpdateUserRole = async (id: string, role: string) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, role }),
    });
    if (res.ok) { toast.success("Рөл өзгертілді"); setEditingUser(null); fetchUsers(); }
    else toast.error("Рөлді өзгерту кезінде қате шықты");
  };

  const handleVacancyStatus = async (id: string, status: string) => {
    const res = await fetch("/api/admin/vacancies", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) { toast.success(`Вакансия статусы: ${status}`); fetchVacancies(); }
    else toast.error("Статус өзгерту кезінде қате");
  };

  const handleDeleteVacancy = async (id: string, title: string) => {
    if (!confirm(`"${title}" вакансиясын жою?`)) return;
    const res = await fetch(`/api/admin/vacancies?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Вакансия жойылды"); fetchVacancies(); }
    else toast.error("Жою кезінде қате шықты");
  };

  const handleDeleteCompany = async (id: string, name: string) => {
    if (!confirm(`"${name}" компаниясын жою? Бұл барлық байланысқан вакансияларды өшіруі мүмкін!`)) return;
    const res = await fetch(`/api/admin/companies?id=${id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Компания жойылды"); fetchCompanies(); }
    else toast.error("Жою кезінде қате шықты");
  };

  if (!mounted || !isAuth || user?.role !== "admin") return null;

  return (
    <main className="min-h-screen bg-muted/20">
      {/* Top bar */}
      <div className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-red-500/10 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Admin Panel</div>
              <div className="font-heading text-sm font-extrabold">ЖұмысТап Басқару</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs text-muted-foreground">
              {user?.email}
            </span>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 uppercase">
              ADMIN
            </span>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => { logout(); router.push("/login"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Пайдаланушылар", value: totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Вакансиялар", value: totalVacancies, icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10" },
            { label: "Белсенді сессия", value: 1, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Рөлдер саны", value: 3, icon: ShieldAlert, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((s, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center shrink-0`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                  <div className="text-xl font-extrabold">{s.value}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === "users" ? "default" : "outline"}
            onClick={() => { setTab("users"); setSearch(""); setRoleFilter(""); }}
            className="gap-2 rounded-xl"
          >
            <Users className="h-4 w-4" /> Пайдаланушылар
          </Button>
          <Button
            variant={tab === "companies" ? "default" : "outline"}
            onClick={() => { setTab("companies"); setSearch(""); }}
            className="gap-2 rounded-xl"
          >
            <Activity className="h-4 w-4" /> Компаниялар
          </Button>
          <Button
            variant={tab === "vacancies" ? "default" : "outline"}
            onClick={() => { setTab("vacancies"); setSearch(""); setStatusFilter(""); }}
            className="gap-2 rounded-xl"
          >
            <Briefcase className="h-4 w-4" /> Вакансиялар
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={tab === "users" ? "Аты немесе Email іздеу..." : tab === "companies" ? "Компания атауы..." : "Вакансия атауы..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (tab === "users" ? fetchUsers() : tab === "companies" ? fetchCompanies() : fetchVacancies())}
                className="pl-9 rounded-xl"
              />
            </div>
            {tab === "users" && (
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-2 text-sm"
              >
                <option value="">Барлық рөлдер</option>
                <option value="ADMIN">Admin</option>
                <option value="EMPLOYER">Employer</option>
                <option value="SEEKER">Seeker</option>
              </select>
            )}
            {tab === "vacancies" && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border bg-background px-3 py-2 text-sm"
              >
                <option value="">Барлық статус</option>
                <option value="PUBLISHED">Жарияланған</option>
                <option value="DRAFT">Жоба</option>
                <option value="ARCHIVED">Қабылданбаған (Archived)</option>
                <option value="CLOSED">Жабылған</option>
              </select>
            )}
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => tab === "users" ? fetchUsers() : tab === "companies" ? fetchCompanies() : fetchVacancies()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Жаңарту
            </Button>
          </CardContent>
        </Card>

        {/* USERS TABLE */}
        {tab === "users" && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Пайдаланушылар тізімі</CardTitle>
              <CardDescription>Жалпы: {totalUsers} пайдаланушы</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-4 font-semibold text-muted-foreground">Аты-жөні</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Email</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Рөл</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Статус</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Тіркелген</th>
                      <th className="text-right p-4 font-semibold text-muted-foreground">Әрекет</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Жүктелуде...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">Пайдаланушылар табылмады</td></tr>
                    ) : users.map((u) => (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium">{u.full_name || "—"}</td>
                        <td className="p-4 text-muted-foreground">{u.email}</td>
                        <td className="p-4">
                          {editingUser?.id === u.id ? (
                            <select
                              defaultValue={u.role}
                              onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                              className="rounded-lg border bg-background px-2 py-1 text-xs"
                            >
                              <option value="ADMIN">ADMIN</option>
                              <option value="EMPLOYER">EMPLOYER</option>
                              <option value="SEEKER">SEEKER</option>
                            </select>
                          ) : (
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-700"}`}>
                              {u.role}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_COLORS[u.status] || ""}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">
                          {new Date(u.created_at).toLocaleDateString("kk-KZ")}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-blue-500/10 hover:text-blue-500"
                              title="Рөлді өзгерту"
                              onClick={() => setEditingUser(editingUser?.id === u.id ? null : u)}
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                              title="Жою"
                              onClick={() => handleDeleteUser(u.id, u.email)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* VACANCIES TABLE */}
        {tab === "vacancies" && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Вакансиялар тізімі</CardTitle>
              <CardDescription>Жалпы: {totalVacancies} вакансия</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-4 font-semibold text-muted-foreground">Вакансия</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Компания</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Статус</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Жарияланды</th>
                      <th className="text-right p-4 font-semibold text-muted-foreground">Модерация</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Жүктелуде...</td></tr>
                    ) : vacancies.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Вакансиялар табылмады</td></tr>
                    ) : vacancies.map((v) => (
                      <tr key={v.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium max-w-[200px] truncate">{v.title}</td>
                        <td className="p-4 text-muted-foreground">{v.company_name || "—"}</td>
                        <td className="p-4">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${STATUS_COLORS[v.status] || ""}`}>
                            {v.status}
                          </span>
                        </td>
                        <td className="p-4 text-muted-foreground text-xs">
                          {new Date(v.created_at).toLocaleDateString("kk-KZ")}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500"
                              title="Бекіту (PUBLISHED)"
                              onClick={() => handleVacancyStatus(v.id, "PUBLISHED")}
                            >
                              <CheckCircle className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-amber-500/10 hover:text-amber-500"
                              title="Қабылдамау (ARCHIVED)"
                              onClick={() => handleVacancyStatus(v.id, "ARCHIVED")}
                            >
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                              title="Жою"
                              onClick={() => handleDeleteVacancy(v.id, v.title)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* COMPANIES TABLE */}
        {tab === "companies" && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Компаниялар тізімі</CardTitle>
              <CardDescription>Жалпы: {totalCompanies} компания</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left p-4 font-semibold text-muted-foreground">Компания атауы</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Заңды атауы</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Иесі (Email)</th>
                      <th className="text-left p-4 font-semibold text-muted-foreground">Вакансиялар саны</th>
                      <th className="text-right p-4 font-semibold text-muted-foreground">Әрекет</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Жүктелуде...</td></tr>
                    ) : companies.length === 0 ? (
                      <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Компаниялар табылмады</td></tr>
                    ) : companies.map((c) => (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium">{c.display_name}</td>
                        <td className="p-4 text-muted-foreground">{c.legal_name || "—"}</td>
                        <td className="p-4 text-muted-foreground">{c.owner_email || "—"}</td>
                        <td className="p-4 font-bold">{c.vacancies_count}</td>
                        <td className="p-4">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost" size="icon"
                              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                              title="Жою"
                              onClick={() => handleDeleteCompany(c.id, c.display_name)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
