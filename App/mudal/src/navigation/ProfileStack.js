import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { slideFromRight, slideFromBottom } from './transitions';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import CategoriesScreen from '../screens/profile/CategoriesScreen';
import AddCategoryScreen from '../screens/profile/AddCategoryScreen';

const Stack = createStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={slideFromRight}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="AddCategory" component={AddCategoryScreen} options={slideFromBottom} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
