"use client";

import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Shield, Wallet, Save } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Өзгерістер сәтті сақталды!");
    }, 1000);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="font-heading text-2xl font-bold">Баптаулар</h2>
        <p className="text-muted-foreground mt-1">Аккаунтыңызды және қауіпсіздікті басқару</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8 bg-muted/50 p-1 h-12 rounded-xl">
          <TabsTrigger value="profile" className="rounded-lg gap-2 px-6">
            <User className="h-4 w-4" /> Профиль
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg gap-2 px-6">
            <Bell className="h-4 w-4" /> Хабарламалар
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg gap-2 px-6">
            <Shield className="h-4 w-4" /> Қауіпсіздік
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg gap-2 px-6">
            <Wallet className="h-4 w-4" /> Шот және Төлемдер
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Жеке ақпарат</CardTitle>
              <CardDescription>Бұл ақпарат жұмыс берушілерге көрінеді</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 mb-4">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/20">
                  {user?.name?.charAt(0)}
                </div>
                <Button variant="outline">Суретті өзгерту</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Аты-жөніңіз</Label>
                  <Input defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label>Электронды пошта</Label>
                  <Input defaultValue={user?.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Телефон нөмірі</Label>
                  <Input placeholder="+7 (7xx) xxx-xx-xx" />
                </div>
                <div className="space-y-2">
                  <Label>Тұратын қалаңыз</Label>
                  <Input placeholder="Алматы" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="ghost">Болдырмау</Button>
            <Button onClick={handleSave} disabled={isSaving} className="px-8 font-bold">
              {isSaving ? "Сақталуда..." : "Сақтау"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Хабарлама баптаулары</CardTitle>
              <CardDescription>Қандай хабарламаларды алғыңыз келетінін таңдаңыз</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               {[
                 { label: "Жаңа вакансиялар туралы", active: true },
                 { label: "Өтініш мәртебесі өзгергенде", active: true },
                 { label: "Компаниялардан хабарламалар", active: false },
                 { label: "Маркетингтік ұсыныстар", active: false },
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                    <span className="font-medium">{item.label}</span>
                    <input type="checkbox" defaultChecked={item.active} className="h-5 w-5 accent-primary" />
                 </div>
               ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Құпиясөзді өзгерту</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                  <Label>Қазіргі құпиясөз</Label>
                  <Input type="password" />
               </div>
               <div className="space-y-2">
                  <Label>Жаңа құпиясөз</Label>
                  <Input type="password" />
               </div>
               <Button className="font-bold">Құпиясөзді жаңарту</Button>
            </CardContent>
          </Card>
          
          <Card className="border border-red-500/20 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-red-600">Аккаунтты өшіру</CardTitle>
              <CardDescription>Аккаунт өшірілген соң деректерді қалпына келтіру мүмкін емес.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="destructive">Аккаунтты біржола өшіру</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
