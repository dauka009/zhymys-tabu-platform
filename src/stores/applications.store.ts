import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Application, ApplicationStatus, Resume } from '@/types';

interface ApplicationsState {
  applications: Application[];
  savedVacancies: string[]; // array of vacancy ids
  resume: Resume | null;
  
  // Actions
  apply: (application: Omit<Application, 'id' | 'date' | 'status'>) => void;
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

      apply: (appData) => set((state) => {
        // Prevent double applying
        if (state.applications.some(a => a.vacancyId === appData.vacancyId && a.userId === appData.userId)) {
          return state;
        }

        const newApp: Application = {
          ...appData,
          id: `app_${Date.now()}`,
          date: new Date().toISOString(),
          status: 'pending',
        };
        return { applications: [newApp, ...state.applications] };
      }),

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
