import { create } from 'zustand';
import client from '../api/client';

const USE_MOCK = false;

const MOCK_BUDGETS = [
  { _id: 'bgt_01', category: { _id: 'cat_01', name: 'Food', icon: 'food', color: '#FF6B6B' }, limit: 15000, spent: 1800 },
  { _id: 'bgt_02', category: { _id: 'cat_02', name: 'Travel', icon: 'travel', color: '#4ECDC4' }, limit: 10000, spent: 2500 },
  { _id: 'bgt_03', category: { _id: 'cat_03', name: 'Shopping', icon: 'shopping', color: '#FFE66D' }, limit: 20000, spent: 12000 },
  { _id: 'bgt_04', category: { _id: 'cat_05', name: 'Healthcare', icon: 'healthcare', color: '#49B6FF' }, limit: 8000, spent: 3500 },
  { _id: 'bgt_05', category: { _id: 'cat_06', name: 'Utilities', icon: 'utilities', color: '#54A0FF' }, limit: 5000, spent: 2800 },
  { _id: 'bgt_06', category: { _id: 'cat_04', name: 'Entertainment', icon: 'entertainment', color: '#A66CFF' }, limit: 10000, spent: 7500 },
  { _id: 'bgt_07', category: { _id: 'cat_07', name: 'Rent', icon: 'rent', color: '#5F27CD' }, limit: 35000, spent: 35000 },
];

const useBudgetStore = create((set, get) => ({
  budgets: [],
  isLoading: false,
  error: null,

  fetchBudgets: async () => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      set({ budgets: MOCK_BUDGETS, isLoading: false });
      return;
    }
    try {
      const { data } = await client.get('/budgets');
      set({ budgets: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch budgets', isLoading: false });
    }
  },

  addBudget: async (budget) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const allCats = require('./categoryStore').MOCK_CATEGORIES;
      const cat = allCats.find((c) => c._id === budget.category) || null;
      const newBudget = { ...budget, _id: `bgt_${Date.now()}`, category: cat, spent: 0 };
      set((state) => ({ budgets: [...state.budgets, newBudget], isLoading: false }));
      return { success: true, data: newBudget };
    }
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
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        budgets: state.budgets.map((b) => (b._id === id ? { ...b, ...updates } : b)),
        isLoading: false,
      }));
      return { success: true };
    }
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
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        budgets: state.budgets.filter((b) => b._id !== id),
        isLoading: false,
      }));
      return { success: true };
    }
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
