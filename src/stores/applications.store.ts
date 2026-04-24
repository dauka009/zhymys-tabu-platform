import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Application, ApplicationStatus, Resume } from '@/types';

interface ApplicationsState {
  applications: Application[];
  savedVacancies: string[]; // array of vacancy ids
  resume: Resume | null;
  
  // Actions
  fetchApplications: (userId?: string) => Promise<void>;
  apply: (application: Omit<Application, 'id' | 'date' | 'status'>) => Promise<void>;
  withdraw: (id: string) => void;
  updateStatus: (id: string, status: ApplicationStatus) => void;
  
  toggleSavedVacancy: (vacancyId: string) => void;
  
  saveResume: (resume: Resume) => void;
}

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set) => ({
      applications: [],
      savedVacancies: [],
      resume: null,

      fetchApplications: async (userId) => {
        try {
          const res = await fetch(`/api/applications${userId ? '?userId=' + userId : ''}`);
          if (res.ok) {
            const data = await res.json();
            set({ applications: data });
          }
        } catch (error) {
          console.error("Failed to fetch applications", error);
        }
      },

      apply: async (appData) => {
        try {
          // Prevent double applying locally first
          if (useApplicationsStore.getState().applications.some(a => a.vacancyId === appData.vacancyId && a.userId === appData.userId)) {
            alert('Сіз бұл вакансияға өтінім беріп қойдыңыз.');
            return;
          }

          const res = await fetch('/api/applications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(appData),
          });
          
          if (res.ok) {
            const newApp = await res.json();
            set((state) => ({ applications: [newApp, ...state.applications] }));
            alert('Өтінім сәтті жіберілді!');
          } else {
            const err = await res.json();
            alert(err.error || 'Қате шықты');
          }
        } catch (error) {
          console.error("Failed to apply", error);
          alert('Сервермен байланыс жоқ');
        }
      },

      withdraw: (id) => set((state) => ({
        applications: state.applications.filter(a => a.id !== id)
      })),

      updateStatus: (id, status) => set((state) => ({
        applications: state.applications.map(a => 
          a.id === id ? { ...a, status } : a
        )
      })),

      toggleSavedVacancy: (vacancyId) => set((state) => {
        const isSaved = state.savedVacancies.includes(vacancyId);
        return {
          savedVacancies: isSaved 
            ? state.savedVacancies.filter(id => id !== vacancyId)
            : [...state.savedVacancies, vacancyId]
        };
      }),

      saveResume: (resume) => set({ resume }),
    }),
    {
      name: 'jumys-applications-storage',
    }
  )
);
