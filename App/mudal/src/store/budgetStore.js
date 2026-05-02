import { create } from 'zustand';
import client from '../api/client';

const useBudgetStore = create((set, get) => ({
  budgets: [],
  isLoading: false,
  error: null,

  fetchBudgets: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.get('/budgets');
      set({ budgets: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch budgets', isLoading: false });
    }
  },

  addBudget: async (budget) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.post('/budgets', budget);
      set((state) => ({ budgets: [...state.budgets, data], isLoading: false }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add budget';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateBudget: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.put(`/budgets/${id}`, updates);
      set((state) => ({
        budgets: state.budgets.map((b) => (b._id === id ? data : b)),
        isLoading: false,
      }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update budget';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteBudget: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await client.delete(`/budgets/${id}`);
      set((state) => ({
        budgets: state.budgets.filter((b) => b._id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete budget';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  getTotalBudget: () => get().budgets.reduce((sum, b) => sum + b.limit, 0),
  getTotalSpent: () => get().budgets.reduce((sum, b) => sum + (b.spent || 0), 0),

  clearError: () => set({ error: null }),
}));

export default useBudgetStore;
