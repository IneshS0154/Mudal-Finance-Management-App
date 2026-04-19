import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { slideFromRight } from './transitions';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';

const Stack = createStackNavigator();

const AnalyticsStack = () => {
  return (
    <Stack.Navigator screenOptions={slideFromRight}>
      <Stack.Screen name="Analytics" component={AnalyticsScreen} />
    </Stack.Navigator>
  );
};

export default AnalyticsStack;
