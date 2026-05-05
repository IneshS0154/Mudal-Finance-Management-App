import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet } from 'react-native';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../store/themeStore';
import HomeStack from './HomeStack';
import AnalyticsStack from './AnalyticsStack';
import TransactionsStack from './TransactionsStack';
import BudgetsStack from './BudgetsStack';
import ProfileStack from './ProfileStack';

const Tab = createBottomTabNavigator();

// Screens where the tab bar should be hidden (sub-screens)
const HIDDEN_SCREENS = [
  'AddTransaction', 'TransactionDetail',
  'AddBudget', 'Recurring', 'AddRecurring', 'Goals', 'AddGoal', 'GoalDetail',
  'EditProfile', 'ChangePassword', 'Categories', 'AddCategory',
];

const getTabBarVisible = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route);
  if (HIDDEN_SCREENS.includes(routeName)) return false;
  return true;
};

const MainTabs = () => {
  const { colors, isDarkMode } = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarBackground: () => (
          Platform.OS === 'ios' ? (
            <BlurView
              tint={isDarkMode ? 'dark' : 'light'}
              intensity={80}
              style={StyleSheet.absoluteFill}
            />
          ) : null
        ),
        tabBarStyle: {
          position: Platform.OS === 'ios' ? 'absolute' : 'relative',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : (isDarkMode ? '#1E1E1E' : '#FFFFFF'),
          borderTopColor: colors.borderLight,
          display: getTabBarVisible(route) ? 'flex' : 'none',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AnalyticsTab') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'TransactionsTab') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (route.name === 'BudgetsTab') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="AnalyticsTab" component={AnalyticsStack} options={{ tabBarLabel: 'Statistic' }} />
      <Tab.Screen name="TransactionsTab" component={TransactionsStack} options={{ tabBarLabel: 'Activity' }} />
      <Tab.Screen name="BudgetsTab" component={BudgetsStack} options={{ tabBarLabel: 'Budget' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};

export default MainTabs;
