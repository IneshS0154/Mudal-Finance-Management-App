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

  // Initialize from user data
  setCategories: (categories) => set({ categories }),

  fetchCategories: async () => {
    // Categories are now part of the user object in authStore
    // We can pull them from the backend profile
    set({ isLoading: true, error: null });
    try {
      const { data } = await client.get('/users/profile');
      const userCats = data.data.categories || [];
      // If no categories, use some defaults? 
      // For now just set what's there
      set({ categories: userCats, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch categories', isLoading: false });
    }
  },

  addCategory: async (category) => {
    set({ isLoading: true, error: null });
    try {
      const currentCats = get().categories;
      const updatedCats = [...currentCats, category];
      
      const { data } = await client.put('/users/profile', { categories: updatedCats });
      const newCats = data.data.categories;
      set({ categories: newCats, isLoading: false });
      return { success: true, data: newCats[newCats.length - 1] };
    } catch (err) {
      set({ error: 'Failed to add category', isLoading: false });
      return { success: false };
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCats = get().categories.filter(c => c._id !== id);
      await client.put('/users/profile', { categories: updatedCats });
      set({ categories: updatedCats, isLoading: false });
      return { success: true };
    } catch (err) {
      set({ error: 'Failed to delete category', isLoading: false });
      return { success: false };
    }
  },

  getExpenseCategories: () => get().categories.filter((c) => c.type === 'expense'),
  getIncomeCategories: () => get().categories.filter((c) => c.type === 'income'),

  clearError: () => set({ error: null }),
}));

export { MOCK_CATEGORIES };
export default useCategoryStore;
