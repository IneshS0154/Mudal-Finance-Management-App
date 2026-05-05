import React from 'react';
import { NativeTabs, Label, Icon } from 'expo-router/unstable-native-tabs';
import useThemeStore from '../../src/store/themeStore';
import { Platform } from 'react-native';

export default function TabLayout() {
  const { colors, isDarkMode } = useThemeStore();

  return (
    <NativeTabs
      translucent={true}
      tabBarStyle={{
        backgroundColor: Platform.OS === 'ios' ? 'transparent' : (isDarkMode ? '#1E1E1E' : '#FFFFFF'),
      }}
      // Change active color to primary green
      tintColor={colors.primary}
    >
      <NativeTabs.Trigger name="index" options={{ title: 'Home' }}>
        <Label>Home</Label>
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="analytics" options={{ title: 'Statistic' }}>
        <Label>Statistic</Label>
        <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="transactions" options={{ title: 'Activity' }}>
        <Label>Activity</Label>
        <Icon sf={{ default: 'arrow.left.arrow.right', selected: 'arrow.left.arrow.right' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="budgets" options={{ title: 'Budget' }}>
        <Label>Budget</Label>
        <Icon sf={{ default: 'creditcard', selected: 'creditcard.fill' }} />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile" options={{ title: 'Profile' }}>
        <Label>Profile</Label>
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
