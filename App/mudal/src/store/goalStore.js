import { create } from 'zustand';
import client from '../api/client';

const useGoalStore = create((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.get('/goals');
      set({ goals: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch', isLoading: false });
    }
  },

  addGoal: async (goalData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.post('/goals', goalData);
      set((state) => ({ goals: [data, ...state.goals], isLoading: false }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add goal';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateGoal: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.put(`/goals/${id}`, updates);
      set((state) => ({
        goals: state.goals.map((g) => (g._id === id ? data : g)),
        isLoading: false,
      }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update goal';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteGoal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await client.delete(`/goals/${id}`);
      set((state) => ({
        goals: state.goals.filter((g) => g._id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete goal';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },
}));

export default useGoalStore;
