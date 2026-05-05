import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useThemeStore from '../store/themeStore';

const ScreenWrapper = ({ children, backgroundColor }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor || colors.background }]} edges={['top']}>
      {children}
    </SafeAreaView>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;
