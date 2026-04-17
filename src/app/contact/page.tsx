"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "@/lib/schemas";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = form;

  const onSubmit = (data: ContactFormValues) => {
    console.log("Contact form sub:", data);
    toast.success("Хабарламаңыз сәтті жіберілді! Жақын арада жауап береміз.");
    reset();
  };

  return (
    <main className="flex-1 bg-muted/20">
      {/* Hero Header */}
      <div className="bg-[#0F172A] py-20 text-white relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-indigo-900/40" />
        <div className="container relative z-10 text-center">
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700">Бізбен байланысыңыз</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            Кез келген сұрағыңыз бар ма? Немесе ұсынысыңыз? Біз әрқашан көмектесуге дайынбыз.
          </p>
        </div>
      </div>

      <div className="container px-4 py-16 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-4">
             <Card className="border-0 shadow-lg bg-primary text-primary-foreground overflow-hidden group">
               <CardContent className="p-8 relative">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <MapPin className="h-32 w-32" />
                 </div>
                 <h3 className="text-2xl font-bold mb-6">Байланыс деректері</h3>
                 <div className="space-y-6 relative z-10">
                   <div className="flex gap-4">
                     <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shadow-lg backdrop-blur-md">
                        <MapPin className="h-6 w-6" />
                     </div>
                     <div>
                       <div className="font-bold opacity-80 text-xs uppercase tracking-widest mb-1">Мекен-жайымыз</div>
                       <p className="font-medium">Астана қ., Мангилик Ел, 55/11<br />Astana Hub, 2-қабат</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shadow-lg backdrop-blur-md">
                        <Phone className="h-6 w-6" />
                     </div>
                     <div>
                       <div className="font-bold opacity-80 text-xs uppercase tracking-widest mb-1">Телефон</div>
                       <p className="font-medium">+7 (7172) 00-00-00</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shadow-lg backdrop-blur-md">
                        <Mail className="h-6 w-6" />
                     </div>
                     <div>
                       <div className="font-bold opacity-80 text-xs uppercase tracking-widest mb-1">Email</div>
                       <p className="font-medium">info@jumystap.kz</p>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>

             <Card className="border-0 shadow-lg">
               <CardContent className="p-8">
                 <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                    <Clock className="h-5 w-5" /> Жұмыс уақыты
                 </h3>
                 <div className="space-y-2 text-muted-foreground font-medium">
                    <div className="flex justify-between"><span>Дүйсенбі - Жұма:</span> <span>09:00 - 18:00</span></div>
                    <div className="flex justify-between"><span>Сенбі:</span> <span>10:00 - 14:00</span></div>
                    <div className="flex justify-between text-red-500"><span>Жексенбі:</span> <span>Демалыс</span></div>
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl lg:h-full">
              <CardContent className="p-8 md:p-12">
                <h2 className="text-3xl font-extrabold mb-2">Хабарлама қалдырыңыз</h2>
                <p className="text-muted-foreground mb-10">Біздің команда 24 сағат ішінде сізге жауап береді.</p>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Атыңыз</Label>
                      <Input id="name" {...register("name")} placeholder="Сіздің атыңыз" 
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register("email")} placeholder="example@mail.com" 
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Хабарлама</Label>
                    <Textarea 
                      id="message" 
                      {...register("message")} 
                      placeholder="Қалай көмектесе аламыз?" 
                      className={`min-h-[150px] ${errors.message ? "border-red-500" : ""}`}
                    />
                    {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-12 h-14 bg-primary font-bold text-lg rounded-xl shadow-lg shadow-primary/20 transition-all hover:-translate-y-1">
                    {isSubmitting ? "Жіберілуде..." : <span className="flex items-center gap-2">Жіберу <Send className="h-5 w-5" /></span>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* Map Placeholder */}
        <div className="mt-16 rounded-3xl overflow-hidden h-[400px] border shadow-2xl relative group">
           <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2506.014282361623!2d71.4326581!3d51.1278148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4245842823a242c7%3A0x6e9a0ee30f084be1!2sAstana%20Hub!5e0!3m2!1sen!2s!4v1714574912345!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute bottom-6 left-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border md:flex hidden items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-1000">
             <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white">
                <CheckCircle2 className="h-6 w-6" />
             </div>
             <div className="text-sm font-bold">Офисіміз осында орналасқан! 📍</div>
          </div>
        </div>
      </div>
    </main>
  );
}
