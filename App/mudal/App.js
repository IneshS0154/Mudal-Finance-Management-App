import React from 'react';
import { Platform } from 'react-native';

// Polyfill for window and document to fix Metro HMR crash in some Expo environments
if (Platform.OS !== 'web') {
  if (typeof window !== 'undefined') {
    if (!window.location) {
      window.location = {
        protocol: 'http:',
        hostname: 'localhost',
        port: '8081',
        href: 'http://localhost:8081/',
        origin: 'http://localhost:8081',
      };
    }
  }
  if (typeof document === 'undefined') {
    global.document = {
      getElementsByTagName: () => [],
      createElement: () => ({ style: {} }),
    };
  }
}

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
