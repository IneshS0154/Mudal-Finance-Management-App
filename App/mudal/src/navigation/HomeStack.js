import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { slideFromRight } from './transitions';
import HomeScreen from '../screens/home/HomeScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={slideFromRight}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
