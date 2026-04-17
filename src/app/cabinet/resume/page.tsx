"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useApplicationsStore } from "@/stores/applications.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Save, FileText, User, Briefcase, GraduationCap, Code } from "lucide-react";
import { toast } from "sonner";

export default function ResumePage() {
  const { user } = useAuthStore();
  const { resume, saveResume } = useApplicationsStore();
  const [isClient, setIsClient] = useState(false);

  // Local state for the form
  const [formData, setFormData] = useState({
    personal: {
      name: user?.name || "",
      phone: "",
      about: "",
    },
    skills: [] as string[],
    experience: [] as { id: string; job: string; company: string; period: string; description: string }[],
    education: [] as { id: string; institution: string; degree: string; period: string }[]
  });

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    setIsClient(true);
    if (resume) {
      setFormData(resume);
    }
  }, [resume]);

  if (!isClient) return null;

  const handleSave = () => {
    saveResume({
      ...formData,
      id: resume?.id || `res_${Date.now()}`,
      userId: user!.id,
      updatedAt: new Date().toISOString()
    });
    toast.success("Түйіндеме сәтті сақталды!");
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: `exp_${Date.now()}`, job: "", company: "", period: "", description: "" }
      ]
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }));
  };

  const removeExperience = (id: string) => {
    setFormData(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }));
  };

  return (
    <div className="p-8 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h2 className="font-heading text-2xl font-bold">Түйіндеме (CV)</h2>
          <p className="text-muted-foreground mt-1">Жұмыс берушілер үшін кәсіби профиліңізді толтырыңыз</p>
        </div>
        <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 gap-2 px-8 rounded-xl font-bold transition-all hover:shadow-lg">
          <Save className="h-4 w-4" />
          Сақтау
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Personal Info */}
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" /> Жеке ақпарат
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Толық аты-жөніңіз</Label>
                <Input 
                  value={formData.personal.name} 
                  onChange={(e) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, name: e.target.value } }))}
                  placeholder="Аты-жөніңіз"
                />
              </div>
              <div className="space-y-2">
                <Label>Телефон нөмірі</Label>
                <Input 
                  value={formData.personal.phone} 
                  onChange={(e) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, phone: e.target.value } }))}
                  placeholder="+7 (700) 000-00-00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Мен туралы / Мақсатым</Label>
              <Textarea 
                value={formData.personal.about}
                onChange={(e) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, about: e.target.value } }))}
                placeholder="Тәжірибеңіз бен дағдыларыңыз туралы қысқаша мәлімет..."
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" /> Кәсіби дағдылар
            </CardTitle>
            <CardDescription>Техникалық және жұмсақ (soft) дағдыларды қосыңыз</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Input 
                value={newSkill} 
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Мысалы: React, Python, UI Design"
                onKeyDown={(e) => e.key === 'Enter' && addSkill()}
              />
              <Button onClick={addSkill} variant="secondary">Қосу</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map(skill => (
                <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium animate-in fade-in zoom-in duration-200">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {formData.skills.length === 0 && (
                <p className="text-sm text-muted-foreground">Ешқандай дағды қосылмаған</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" /> Жұмыс тәжірибесі
              </CardTitle>
            </div>
            <Button onClick={addExperience} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Қосу
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={exp.id} className="p-6 border rounded-2xl relative bg-muted/10">
                <button 
                  onClick={() => removeExperience(exp.id)}
                  className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Лауазым</Label>
                    <Input 
                      value={exp.job} 
                      onChange={(e) => updateExperience(exp.id, "job", e.target.value)}
                      placeholder="Мысалы: Senior Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Компания</Label>
                    <Input 
                      value={exp.company} 
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder="Kaspi.kz"
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Label>Кезең</Label>
                  <Input 
                    value={exp.period} 
                    onChange={(e) => updateExperience(exp.id, "period", e.target.value)}
                    placeholder="2021 — Қазіргі уақыт"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Сипаттама</Label>
                  <Textarea 
                    value={exp.description} 
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    placeholder="Қандай жетістіктерге жеттіңіз?"
                  />
                </div>
              </div>
            ))}
            {formData.experience.length === 0 && (
              <div className="text-center py-10 text-muted-foreground italic">
                Жұмыс тәжірибесі көрсетілмеген
              </div>
            )}
          </CardContent>
        </Card>

      </div>
      
      {/* Floating Save button for mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Button onClick={handleSave} className="h-14 w-14 rounded-full shadow-2xl bg-emerald-600">
          <Save className="h-6 w-6" />
        </Button>
      </div>

    </div>
  );
}
