import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Vacancy } from '@/types';
import { MOCK_VACANCIES } from '@/lib/mock-data';

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
  addVacancy: (vacancy: Vacancy) => void;
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
      vacancies: MOCK_VACANCIES,
      filters: initialFilters,

      addVacancy: (vacancy) => set((state) => ({ 
        vacancies: [vacancy, ...state.vacancies] 
      })),

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
