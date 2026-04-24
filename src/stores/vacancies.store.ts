import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vacancy } from '@/types';

interface Filters {
  query: string;
  category: string;
  type: string;
  location: string;
  salaryMin: number;
}

interface VacanciesState {
  vacancies: Vacancy[];
  filters: Filters;
  
  // Actions
  fetchVacancies: () => Promise<void>;
  addVacancy: (vacancy: Vacancy) => Promise<void>;
  updateVacancy: (id: string, data: Partial<Vacancy>) => void;
  deleteVacancy: (id: string) => void;
  setFilter: (key: keyof Filters, value: string | number) => void;
  resetFilters: () => void;
  setVacancies: (vacancies: Vacancy[]) => void;
}

const initialFilters: Filters = {
  query: '',
  category: 'all',
  type: 'all',
  location: 'all',
  salaryMin: 0,
};

export const useVacanciesStore = create<VacanciesState>()(
  persist(
    (set) => ({
      vacancies: [],
      filters: initialFilters,

      fetchVacancies: async () => {
        try {
          const res = await fetch('/api/vacancies');
          if (res.ok) {
            const data = await res.json();
            set({ vacancies: data });
          }
        } catch (error) {
          console.error("Failed to fetch vacancies", error);
        }
      },

      addVacancy: async (vacancy) => {
        try {
          const res = await fetch('/api/vacancies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vacancy),
          });
          if (res.ok) {
            const saved = await res.json();
            set((state) => ({ vacancies: [saved, ...state.vacancies] }));
          }
        } catch (error) {
          console.error("Error creating vacancy", error);
        }
      },

      updateVacancy: (id, data) => set((state) => ({
        vacancies: state.vacancies.map(v => v.id === id ? { ...v, ...data } : v)
      })),

      deleteVacancy: (id) => set((state) => ({
        vacancies: state.vacancies.filter(v => v.id !== id)
      })),

      setFilter: (key, value) => set((state) => ({
        filters: { ...state.filters, [key]: value }
      })),

      resetFilters: () => set({ filters: initialFilters }),

      setVacancies: (vacancies) => set({ vacancies }),
    }),
    {
      name: 'jumys-vacancies-storage',
    }
  )
);
