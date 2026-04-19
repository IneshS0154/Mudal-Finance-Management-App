import { create } from 'zustand';
import client from '../api/client';

const USE_MOCK = true;

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

const MOCK_GOALS = [
  { _id: 'goal_01', name: 'MacBook Pro', targetAmount: 450000, savedAmount: 125000, deadline: daysFromNow(120), monthlyContribution: 30000 },
  { _id: 'goal_02', name: 'Emergency Fund', targetAmount: 200000, savedAmount: 82000, deadline: daysFromNow(180), monthlyContribution: 15000 },
  { _id: 'goal_03', name: 'Trip to Japan', targetAmount: 350000, savedAmount: 45000, deadline: daysFromNow(300), monthlyContribution: 20000 },
];

const useGoalStore = create((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      set({ goals: MOCK_GOALS, isLoading: false });
      return;
    }
    try {
      const { data } = await client.get('/goals');
      set({ goals: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch goals', isLoading: false });
    }
  },

  addGoal: async (goal) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const newGoal = { ...goal, _id: `goal_${Date.now()}`, savedAmount: 0 };
      set((state) => ({ goals: [...state.goals, newGoal], isLoading: false }));
      return { success: true, data: newGoal };
    }
    try {
      const { data } = await client.post('/goals', goal);
      set((state) => ({ goals: [...state.goals, data], isLoading: false }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add goal';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  contribute: async (id, amount) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        goals: state.goals.map((g) =>
          g._id === id ? { ...g, savedAmount: g.savedAmount + amount } : g
        ),
        isLoading: false,
      }));
      return { success: true };
    }
    try {
      const { data } = await client.post(`/goals/${id}/contribute`, { amount });
      set((state) => ({
        goals: state.goals.map((g) => (g._id === id ? data : g)),
        isLoading: false,
      }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to contribute';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateGoal: async (id, updates) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        goals: state.goals.map((g) => (g._id === id ? { ...g, ...updates } : g)),
        isLoading: false,
      }));
      return { success: true };
    }
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
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        goals: state.goals.filter((g) => g._id !== id),
        isLoading: false,
      }));
      return { success: true };
    }
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

  clearError: () => set({ error: null }),
}));

export default useGoalStore;
