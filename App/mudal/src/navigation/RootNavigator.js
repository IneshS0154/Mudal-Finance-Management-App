import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthStack from './AuthStack';
import MainTabs from './MainTabs';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const { token, isCheckingAuth, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (isCheckingAuth) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyleInterpolator: ({ current }) => ({ cardStyle: { opacity: current.progress } }), transitionSpec: { open: { animation: 'timing', config: { duration: 400 } }, close: { animation: 'timing', config: { duration: 300 } } } }}>
      {token ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

const getStyles = (colors) => StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});

export default RootNavigator;
