import { create } from 'zustand';
import client from '../api/client';

const USE_MOCK = true;

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

const MOCK_RECURRING = [
  { _id: 'rec_01', title: 'Water Bill', amount: 1200, category: { _id: 'cat_06', name: 'Utilities', icon: 'utilities', color: '#54A0FF' }, frequency: 'monthly', nextDueDate: daysFromNow(5), startDate: daysFromNow(-25), isActive: true },
  { _id: 'rec_02', title: 'Electricity Bill', amount: 3500, category: { _id: 'cat_06', name: 'Utilities', icon: 'utilities', color: '#54A0FF' }, frequency: 'monthly', nextDueDate: daysFromNow(12), startDate: daysFromNow(-18), isActive: true },
  { _id: 'rec_03', title: 'Netflix Subscription', amount: 1100, category: { _id: 'cat_10', name: 'Subscriptions', icon: 'subscriptions', color: '#6C5CE7' }, frequency: 'monthly', nextDueDate: daysFromNow(8), startDate: daysFromNow(-22), isActive: true },
  { _id: 'rec_04', title: 'Internet Bill', amount: 2500, category: { _id: 'cat_06', name: 'Utilities', icon: 'utilities', color: '#54A0FF' }, frequency: 'monthly', nextDueDate: daysFromNow(3), startDate: daysFromNow(-27), isActive: true },
  { _id: 'rec_05', title: 'Gym Membership', amount: 5000, category: { _id: 'cat_05', name: 'Healthcare', icon: 'healthcare', color: '#49B6FF' }, frequency: 'monthly', nextDueDate: daysFromNow(18), startDate: daysFromNow(-12), isActive: false },
];

const useRecurringStore = create((set, get) => ({
  recurringItems: [],
  isLoading: false,
  error: null,

  fetchRecurring: async () => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      set({ recurringItems: MOCK_RECURRING, isLoading: false });
      return;
    }
    try {
      const { data } = await client.get('/recurring');
      set({ recurringItems: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch', isLoading: false });
    }
  },

  addRecurring: async (item) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const allCats = require('./categoryStore').MOCK_CATEGORIES;
      const cat = allCats.find((c) => c._id === item.category) || null;
      const newItem = { ...item, _id: `rec_${Date.now()}`, category: cat, isActive: true, nextDueDate: item.startDate };
      set((state) => ({ recurringItems: [...state.recurringItems, newItem], isLoading: false }));
      return { success: true, data: newItem };
    }
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
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        recurringItems: state.recurringItems.map((r) => (r._id === id ? { ...r, ...updates } : r)),
        isLoading: false,
      }));
      return { success: true };
    }
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
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        recurringItems: state.recurringItems.filter((r) => r._id !== id),
        isLoading: false,
      }));
      return { success: true };
    }
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
