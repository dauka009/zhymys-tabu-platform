import { create } from 'zustand';
import { Company } from '@/types';

interface CompaniesState {
  companies: Company[];
  isLoading: boolean;
  
  fetchCompanies: () => Promise<void>;
  toggleFollow: (companyId: string, userId: string) => Promise<void>;
}

export const useCompaniesStore = create<CompaniesState>((set, get) => ({
  companies: [],
  isLoading: false,

  fetchCompanies: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/companies');
      if (res.ok) {
        const data = await res.json();
        set({ companies: data });
      }
    } catch (e) {
      console.error("Failed to fetch companies", e);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFollow: async (companyId: string, userId: string) => {
    try {
      // Optimistic matching or just call API
      const res = await fetch(`/api/companies/${companyId}/follow?userId=${userId}`);
      const { isFollowing } = await res.json();

      if (isFollowing) {
        // Unfollow
        await fetch(`/api/companies/${companyId}/follow?userId=${userId}`, { method: 'DELETE' });
      } else {
        // Follow
        await fetch(`/api/companies/${companyId}/follow`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
      }
      
      // Update local state if needed (add `isFollowing` to type or manage separately)
    } catch (e) {
      console.error("Follow toggle failed", e);
    }
  }
}));
