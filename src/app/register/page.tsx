"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schemas";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "seeker",
    },
    mode: "onBlur"
  });

  const { register, handleSubmit, formState: { errors, touchedFields }, watch, setValue } = form;

  const password = watch("password");

  const getPasswordStrength = () => {
    if (!password) return { val: 0, text: "Күші: жоқ", color: "bg-muted" };
    if (password.length < 4) return { val: 20, text: "Өте әлсіз", color: "bg-red-500" };
    if (password.length < 6) return { val: 40, text: "Әлсіз", color: "bg-amber-500" };
    if (password.length < 8) return { val: 65, text: "Орташа", color: "bg-blue-500" };
    return { val: 100, text: "Күшті 💪", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength();

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
        }),
      });

      if (res.ok) {
        const { user } = await res.json();
        login(user);
        toast.success("Тіркелу сәтті өтті! Қош келдіңіз!");
        router.push("/cabinet");
      } else {
        const err = await res.json();
        if (err.error?.includes('email')) {
          form.setError("email", { message: err.error });
        }
        toast.error(err.error || "Тіркелу кезінде қате шықты");
      }
    } catch (error) {
      toast.error("Сервермен байланыс жоқ");
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center p-4 bg-muted/30 min-h-[calc(100vh-70px)]">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="font-heading text-2xl font-bold">Жүйеге тіркелу</CardTitle>
          <CardDescription>
            Қазақстандағы ең ірі мансап алаңына қосылыңыз
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="seeker" onValueChange={(v) => setValue("role", v as "seeker" | "employer")} className="w-full">
          <div className="px-6 pb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="seeker">Іздеушімін</TabsTrigger>
              <TabsTrigger value="employer">Жұмыс берушімін</TabsTrigger>
            </TabsList>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              <div className="space-y-2">
                <Label htmlFor="name">Аты-жөні немесе Компания атауы</Label>
                <div className="relative">
                  <Input id="name" placeholder="Мысалы: Азамат немесе Kaspi.kz" {...register("name")} 
                    className={errors.name ? "border-red-500 focus-visible:ring-red-500" : (touchedFields.name && !errors.name ? "border-emerald-500" : "")} 
                  />
                  {touchedFields.name && !errors.name && <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-emerald-500" />}
                </div>
                {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email адресі</Label>
                <div className="relative">
                  <Input id="email" type="email" placeholder="example@mail.com" {...register("email")}
                    className={errors.email ? "border-red-500 focus-visible:ring-red-500" : (touchedFields.email && !errors.email ? "border-emerald-500" : "")}
                  />
                  {touchedFields.email && !errors.email && <CheckCircle2 className="absolute right-3 top-2.5 h-4 w-4 text-emerald-500" />}
                </div>
                {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Құпиясөз</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} {...register("password")}
                    className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                  />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
                      <span>Құпиясөз күші:</span>
                      <span className={strength.val === 100 ? "text-emerald-500" : ""}>{strength.text}</span>
                    </div>
                    <Progress value={strength.val} className="h-1.5" indicatorColor={strength.color} />
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-500 font-medium mt-1">{errors.password.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Құпиясөзді растаңыз</Label>
                <Input id="confirmPassword" type={showPassword ? "text" : "password"} {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : (touchedFields.confirmPassword && !errors.confirmPassword ? "border-emerald-500" : "")}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 font-medium mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <Button type="submit" className="w-full mt-6 bg-gradient-to-r from-primary to-indigo-600 font-bold hover:shadow-lg transition-transform active:scale-[0.98]">
                Тіркелу
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Немесе</span></div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button variant="outline" type="button" className="w-full font-medium" disabled>Google</Button>
              <Button variant="outline" type="button" className="w-full font-medium" disabled>LinkedIn</Button>
            </div>
            
            <p className="text-sm text-center text-muted-foreground mt-4">
              Аккаунтыңыз бар ма?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">Кіру</Link>
            </p>
          </CardFooter>
        </Tabs>
      </Card>
    </main>
  );
}
