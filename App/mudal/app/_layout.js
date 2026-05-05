import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import useAuthStore from '../src/store/authStore';
import useThemeStore from '../src/store/themeStore';

export default function RootLayout() {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const { token, isCheckingAuth, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isCheckingAuth) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!token && !inAuthGroup) {
      setTimeout(() => router.replace('/(auth)/index'), 0);
    } else if (token && inAuthGroup) {
      setTimeout(() => router.replace('/(tabs)'), 0);
    }
  }, [token, isCheckingAuth, segments]);

  if (isCheckingAuth) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors?.primaryDark || '#000'} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const getStyles = (colors) => StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors?.background || '#fff',
  },
});
