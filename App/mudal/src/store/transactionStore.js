import { create } from 'zustand';
import client from '../api/client';

const USE_MOCK = false;

// Helper to build dates relative to today
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

const MOCK_TRANSACTIONS = [
  { _id: 'txn_01', type: 'income', amount: 150000, title: 'Monthly Salary', category: { _id: 'cat_11', name: 'Salary', icon: 'salary', color: '#34C759' }, date: daysAgo(1), notes: 'April salary' },
  { _id: 'txn_02', type: 'expense', amount: 2500, title: 'Uber to Office', category: { _id: 'cat_02', name: 'Travel', icon: 'travel', color: '#4ECDC4' }, date: daysAgo(0), notes: '' },
  { _id: 'txn_03', type: 'expense', amount: 850, title: 'Lunch at Cafe', category: { _id: 'cat_01', name: 'Food', icon: 'food', color: '#FF6B6B' }, date: daysAgo(0), notes: '' },
  { _id: 'txn_04', type: 'expense', amount: 4200, title: 'Grocery Shopping', category: { _id: 'cat_08', name: 'Groceries', icon: 'groceries', color: '#10AC84' }, date: daysAgo(1), notes: 'Weekly groceries' },
  { _id: 'txn_05', type: 'expense', amount: 1500, title: 'Netflix + Spotify', category: { _id: 'cat_10', name: 'Subscriptions', icon: 'subscriptions', color: '#6C5CE7' }, date: daysAgo(2), notes: '' },
  { _id: 'txn_06', type: 'income', amount: 25000, title: 'Freelance Project', category: { _id: 'cat_12', name: 'Freelance', icon: 'freelance', color: '#00B894' }, date: daysAgo(3), notes: 'Logo design project' },
  { _id: 'txn_07', type: 'expense', amount: 12000, title: 'New Headphones', category: { _id: 'cat_03', name: 'Shopping', icon: 'shopping', color: '#FFE66D' }, date: daysAgo(4), notes: '' },
  { _id: 'txn_08', type: 'expense', amount: 3500, title: 'Doctor Visit', category: { _id: 'cat_05', name: 'Healthcare', icon: 'healthcare', color: '#49B6FF' }, date: daysAgo(5), notes: 'Checkup' },
  { _id: 'txn_09', type: 'expense', amount: 2800, title: 'Electricity Bill', category: { _id: 'cat_06', name: 'Utilities', icon: 'utilities', color: '#54A0FF' }, date: daysAgo(6), notes: '' },
  { _id: 'txn_10', type: 'expense', amount: 1200, title: 'Bus Pass', category: { _id: 'cat_09', name: 'Transport', icon: 'transport', color: '#01A3A4' }, date: daysAgo(7), notes: '' },
  { _id: 'txn_11', type: 'expense', amount: 7500, title: 'Movie Night', category: { _id: 'cat_04', name: 'Entertainment', icon: 'entertainment', color: '#A66CFF' }, date: daysAgo(10), notes: '' },
  { _id: 'txn_12', type: 'income', amount: 5000, title: 'Birthday Gift', category: { _id: 'cat_13', name: 'Bonus', icon: 'bonus', color: '#FDCB6E' }, date: daysAgo(12), notes: '' },
  { _id: 'txn_13', type: 'expense', amount: 35000, title: 'Rent Payment', category: { _id: 'cat_07', name: 'Rent', icon: 'rent', color: '#5F27CD' }, date: daysAgo(15), notes: 'April rent' },
  { _id: 'txn_14', type: 'expense', amount: 950, title: 'Coffee & Snacks', category: { _id: 'cat_01', name: 'Food', icon: 'food', color: '#FF6B6B' }, date: daysAgo(16), notes: '' },
  { _id: 'txn_15', type: 'income', amount: 2000, title: 'Refund from Store', category: { _id: 'cat_14', name: 'Refund', icon: 'refund', color: '#81ECEC' }, date: daysAgo(20), notes: '' },
];

const useTransactionStore = create((set, get) => ({
  transactions: [],
  isLoading: false,
  error: null,

  fetchTransactions: async (filters = {}) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set({ transactions: MOCK_TRANSACTIONS, isLoading: false });
      return;
    }
    try {
      const { data } = await client.get('/transactions', { params: filters });
      set({ transactions: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch', isLoading: false });
    }
  },

  addTransaction: async (transaction) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      // Resolve category from store
      const allCats = require('./categoryStore').MOCK_CATEGORIES;
      const cat = allCats.find((c) => c._id === transaction.category) || null;
      const newTxn = {
        ...transaction,
        _id: `txn_${Date.now()}`,
        category: cat,
      };
      set((state) => ({
        transactions: [newTxn, ...state.transactions],
        isLoading: false,
      }));
      return { success: true, data: newTxn };
    }
    try {
      const { data } = await client.post('/transactions', transaction);
      set((state) => ({
        transactions: [data, ...state.transactions],
        isLoading: false,
      }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  updateTransaction: async (id, updates) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        transactions: state.transactions.map((t) => (t._id === id ? { ...t, ...updates } : t)),
        isLoading: false,
      }));
      return { success: true };
    }
    try {
      const { data } = await client.put(`/transactions/${id}`, updates);
      set((state) => ({
        transactions: state.transactions.map((t) => (t._id === id ? data : t)),
        isLoading: false,
      }));
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  deleteTransaction: async (id) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        transactions: state.transactions.filter((t) => t._id !== id),
        isLoading: false,
      }));
      return { success: true };
    }
    try {
      await client.delete(`/transactions/${id}`);
      set((state) => ({
        transactions: state.transactions.filter((t) => t._id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  getRecentTransactions: (limit = 5) => {
    return get().transactions.slice(0, limit);
  },

  clearError: () => set({ error: null }),
}));

export default useTransactionStore;
