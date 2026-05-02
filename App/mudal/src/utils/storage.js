import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const storage = {
  async getItemAsync(key) {
    if (isWeb) {
      const value = localStorage.getItem(key);
      return value !== null ? value : null;
    }
    return await SecureStore.getItemAsync(key);
  },

  async setItemAsync(key, value) {
    if (isWeb) {
      localStorage.setItem(key, value);
      return;
    }
    return await SecureStore.setItemAsync(key, value);
  },

  async deleteItemAsync(key) {
    if (isWeb) {
      localStorage.removeItem(key);
      return;
    }
    return await SecureStore.deleteItemAsync(key);
  },
};

export default storage;
