"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { z } from "zod";
import { useAuthStore } from "@/stores/auth.store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { isAuth, user, login, logout } = useAuthStore();
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const { user } = await res.json();
        login(user);
        toast.success("Сәтті кірдіңіз! Қош келдіңіз!");
        router.push("/cabinet");
      } else {
        const err = await res.json();
        toast.error(err.error || "Қате: Email немесе пароль дұрыс емес");
      }
    } catch (error) {
      toast.error("Сервермен байланыс жоқ");
    }
  };

  if (isAuth && user) {
    return (
      <main className="flex-1 flex items-center justify-center p-4 bg-muted/30 min-h-[calc(100vh-70px)]">
        <Card className="w-full max-w-md shadow-xl text-center p-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-primary font-bold">{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <CardTitle className="font-heading text-2xl font-bold mb-2">Сәлем, {user.name}! 👋</CardTitle>
          <CardDescription className="mb-8">Аккаунт: {user.email}</CardDescription>
          
          <div className="grid grid-cols-1 gap-3">
            <Button onClick={() => router.push("/cabinet")} className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-indigo-600">
              Жеке кабинетке өту
            </Button>
            <Button variant="outline" onClick={() => { logout(); toast.info("Жүйеден шықтыңыз"); }} className="w-full h-12 text-base font-bold text-destructive hover:bg-destructive/10">
              Жүйеден шығу
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 flex items-center justify-center p-4 bg-muted/30 min-h-[calc(100vh-70px)]">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-primary">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="font-heading text-2xl font-bold">Жүйеге кіру</CardTitle>
          <CardDescription>Қайта оралғаныңызға қуаныштымыз!</CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            <div className="space-y-2">
              <Label htmlFor="email">Email адресі</Label>
              <Input id="email" type="email" placeholder="Сіздің email" {...register("email")}
                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Құпиясөз</Label>
                <Link href="/forgot-password" className="flex-1 text-right text-xs text-primary hover:underline">Ұмыттыңыз ба?</Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Құпиясөз" {...register("password")}
                  className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-xs text-red-500 font-medium mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              <label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Мені есте сақтау
              </label>
            </div>

            <Button type="submit" className="w-full mt-4 h-12 text-base bg-gradient-to-r from-primary to-indigo-600 font-bold hover:shadow-lg transition-transform active:scale-[0.98]">
              Кіру
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
            Аккаунтыңыз жоқ па?{" "}
            <Link href="/register" className="text-primary font-bold hover:underline">Тіркелу</Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
