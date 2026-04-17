import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Дұрыс email енгізіңіз." }),
  password: z.string().min(6, { message: "Кемінде 6 символ қажет." }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Атыңызды енгізіңіз." }),
  email: z.string().email({ message: "Дұрыс email енгізіңіз." }),
  password: z.string().min(8, { message: "Құпиясөз кемінде 8 символ болуы керек." }),
  confirmPassword: z.string(),
  role: z.enum(["seeker", "employer"], { message: "Рольді таңдаңыз." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Құпиясөздер сәйкес келмейді.",
  path: ["confirmPassword"],
});

export const vacancySchema = z.object({
  title: z.string().min(3, { message: "Тақырып өте қысқа." }),
  category: z.string().min(1, { message: "Санатын таңдаңыз." }),
  type: z.enum(["full", "part", "remote", "hybrid", "internship"]),
  location: z.string().min(2, { message: "Қаланы енгізіңіз." }),
  salaryMin: z.coerce.number().min(0, { message: "Терең мән енгізіңіз." }),
  salaryMax: z.coerce.number().optional(),
  description: z.string().min(10, { message: "Сипаттама кемінде 10 символ болуы керек." }),
  requirements: z.string(), // Will be split by newlines
});

export const contactSchema = z.object({
  name: z.string().min(2, { message: "Атыңызды енгізіңіз." }),
  email: z.string().email({ message: "Дұрыс email енгізіңіз." }),
  message: z.string().min(10, { message: "Хабарлама кемінде 10 символ болуы керек." }),
});

export const resumeSchema = z.object({
  personal: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    about: z.string().optional(),
  }),
  skills: z.array(z.string()).min(1, { message: "Кемінде бір дағды қосыңыз." }),
});
