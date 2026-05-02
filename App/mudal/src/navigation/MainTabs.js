import React from 'react';
import { createBottomTabNavigator, useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import CustomTabBar from '../components/CustomTabBar';
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
  return (
    <Tab.Navigator
      tabBar={(props) => {
        // Check if tab bar should be visible for the current route
        const focusedRoute = props.state.routes[props.state.index];
        const isVisible = getTabBarVisible(focusedRoute);
        if (!isVisible) return null;
        return <CustomTabBar {...props} />;
      }}
      screenOptions={{
        headerShown: false,
        animation: 'shift',
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} />
      <Tab.Screen name="AnalyticsTab" component={AnalyticsStack} />
      <Tab.Screen name="TransactionsTab" component={TransactionsStack} />
      <Tab.Screen name="BudgetsTab" component={BudgetsStack} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainTabs;
