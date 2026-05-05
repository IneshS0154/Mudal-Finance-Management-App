import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../constants/theme';

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDarkMode: false,
      colors: lightColors,
      toggleTheme: () => {
        const newIsDark = !get().isDarkMode;
        set({
          isDarkMode: newIsDark,
          colors: newIsDark ? darkColors : lightColors,
        });
      },
      setTheme: (isDark) => {
        set({
          isDarkMode: isDark,
          colors: isDark ? darkColors : lightColors,
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useThemeStore;
