import { create } from 'zustand';
import client from '../api/client';

const USE_MOCK = true;

const MOCK_CATEGORIES = [
  { _id: 'cat_01', name: 'Food', icon: 'food', color: '#FF6B6B', type: 'expense' },
  { _id: 'cat_02', name: 'Travel', icon: 'travel', color: '#4ECDC4', type: 'expense' },
  { _id: 'cat_03', name: 'Shopping', icon: 'shopping', color: '#FFE66D', type: 'expense' },
  { _id: 'cat_04', name: 'Entertainment', icon: 'entertainment', color: '#A66CFF', type: 'expense' },
  { _id: 'cat_05', name: 'Healthcare', icon: 'healthcare', color: '#49B6FF', type: 'expense' },
  { _id: 'cat_06', name: 'Utilities', icon: 'utilities', color: '#54A0FF', type: 'expense' },
  { _id: 'cat_07', name: 'Rent', icon: 'rent', color: '#5F27CD', type: 'expense' },
  { _id: 'cat_08', name: 'Groceries', icon: 'groceries', color: '#10AC84', type: 'expense' },
  { _id: 'cat_09', name: 'Transport', icon: 'transport', color: '#01A3A4', type: 'expense' },
  { _id: 'cat_10', name: 'Subscriptions', icon: 'subscriptions', color: '#6C5CE7', type: 'expense' },
  { _id: 'cat_11', name: 'Salary', icon: 'salary', color: '#34C759', type: 'income' },
  { _id: 'cat_12', name: 'Freelance', icon: 'freelance', color: '#00B894', type: 'income' },
  { _id: 'cat_13', name: 'Bonus', icon: 'bonus', color: '#FDCB6E', type: 'income' },
  { _id: 'cat_14', name: 'Refund', icon: 'refund', color: '#81ECEC', type: 'income' },
];

const useCategoryStore = create((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      set({ categories: MOCK_CATEGORIES, isLoading: false });
      return;
    }
    try {
      const { data } = await client.get('/categories');
      set({ categories: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch categories', isLoading: false });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const newCat = { ...category, _id: `cat_${Date.now()}` };
      set((state) => ({ categories: [...state.categories, newCat], isLoading: false }));
      return { success: true, data: newCat };
    }
    try {
      const { data } = await client.post('/categories', category);
      set((state) => ({ categories: [...state.categories, data], isLoading: false }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add category';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateCategory: async (id, updates) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        categories: state.categories.map((c) => (c._id === id ? { ...c, ...updates } : c)),
        isLoading: false,
      }));
      return { success: true };
    }
    try {
      const { data } = await client.put(`/categories/${id}`, updates);
      set((state) => ({
        categories: state.categories.map((c) => (c._id === id ? data : c)),
        isLoading: false,
      }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update category';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== id),
        isLoading: false,
      }));
      return { success: true };
    }
    try {
      await client.delete(`/categories/${id}`);
      set((state) => ({
        categories: state.categories.filter((c) => c._id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete category';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  getExpenseCategories: () => get().categories.filter((c) => c.type === 'expense'),
  getIncomeCategories: () => get().categories.filter((c) => c.type === 'income'),

  clearError: () => set({ error: null }),
}));

export { MOCK_CATEGORIES };
export default useCategoryStore;
