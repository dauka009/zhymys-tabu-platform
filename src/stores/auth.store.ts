import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, User } from '@/types';

interface AuthState {
  isAuth: boolean;
  user: User | null;
  role: Role | null;
  login: (user: User) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuth: false,
      user: null,
      role: null,

      login: (user) => set({ isAuth: true, user, role: user.role }),
      
      logout: () => set({ isAuth: false, user: null, role: null }),
      
      updateProfile: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      })),
    }),
    {
      name: 'jumys-auth-storage', // name of the item in the storage (must be unique)
    }
  )
);
