import { create } from 'zustand';
import storage from '../utils/storage';
import client from '../api/client';

// ── Mock mode: set to true to bypass backend ──
const USE_MOCK = false;

const MOCK_USER = {
  _id: 'mock_user_001',
  name: 'Inesh',
  email: 'user@mail.com',
  currency: 'LKR',
  createdAt: new Date().toISOString(),
};

const MOCK_PASSWORD = 'user1234';
const MOCK_TOKEN = 'mock_jwt_token_for_testing';

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isLoading: false,
  isCheckingAuth: true,
  error: null,

  // Initialize — check for stored token on app launch
  initialize: async () => {
    try {
      const token = await storage.getItemAsync('authToken');
      if (token) {
        if (USE_MOCK) {
          set({ user: MOCK_USER, token, isCheckingAuth: false });
          return;
        }
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await client.get('/users/profile');
        set({ user: data.data, token, isCheckingAuth: false });
      } else {
        set({ isCheckingAuth: false });
      }
    } catch (err) {
      await storage.deleteItemAsync('authToken');
      delete client.defaults.headers.common['Authorization'];
      set({ user: null, token: null, isCheckingAuth: false });
    }
  },

  // Register
  register: async ({ name, email, password, currency }) => {
    set({ isLoading: true, error: null });

    if (USE_MOCK) {
      const mockUser = { ...MOCK_USER, name, email, currency: currency || 'LKR' };
      await storage.setItemAsync('authToken', MOCK_TOKEN);
      set({ user: mockUser, token: MOCK_TOKEN, isLoading: false });
      return { success: true };
    }

    try {
      const { data } = await client.post('/auth/register', { name, email, password, currency: currency || 'LKR' });
      const { token, user } = data;
      await storage.setItemAsync('authToken', token);
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Login
  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });

    if (USE_MOCK) {
      // Simulate delay
      await new Promise((r) => setTimeout(r, 600));
      if (email === 'user@mail.com' && password === 'user1234') {
        await storage.setItemAsync('authToken', MOCK_TOKEN);
        set({ user: MOCK_USER, token: MOCK_TOKEN, isLoading: false });
        return { success: true };
      }
      const message = 'Invalid email or password';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }

    try {
      const { data } = await client.post('/auth/login', { email, password });
      const { token, user } = data;
      await storage.setItemAsync('authToken', token);
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user, token, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Logout
  logout: async () => {
    await storage.deleteItemAsync('authToken');
    delete client.defaults.headers.common['Authorization'];
    set({ user: null, token: null, error: null });
  },

  // Update profile
  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      set((state) => ({ user: { ...state.user, ...updates }, isLoading: false }));
      return { success: true };
    }
    try {
      const { data } = await client.put('/users/profile', updates);
      set({ user: data.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Change password
  changePassword: async ({ currentPassword, newPassword }) => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      set({ isLoading: false });
      return { success: true };
    }
    try {
      await client.put('/users/change-password', { currentPassword, newPassword });
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Password change failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  // Delete account
  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    if (USE_MOCK) {
      await storage.deleteItemAsync('authToken');
      set({ user: null, token: null, isLoading: false });
      return { success: true };
    }
    try {
      await client.delete('/users/account');
      await storage.deleteItemAsync('authToken');
      delete client.defaults.headers.common['Authorization'];
      set({ user: null, token: null, isLoading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Account deletion failed';
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
