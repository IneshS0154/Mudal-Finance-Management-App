import { create } from 'zustand';
import client from '../api/client';

const useRecurringStore = create((set, get) => ({
  recurringItems: [],
  isLoading: false,
  error: null,

  fetchRecurring: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.get('/recurring');
      set({ recurringItems: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch', isLoading: false });
    }
  },

  addRecurring: async (item) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.post('/recurring', item);
      set((state) => ({ recurringItems: [...state.recurringItems, data], isLoading: false }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateRecurring: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.put(`/recurring/${id}`, updates);
      set((state) => ({
        recurringItems: state.recurringItems.map((r) => (r._id === id ? data : r)),
        isLoading: false,
      }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteRecurring: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await client.delete(`/recurring/${id}`);
      set((state) => ({
        recurringItems: state.recurringItems.filter((r) => r._id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useRecurringStore;
