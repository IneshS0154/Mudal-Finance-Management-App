import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../constants/colors';

const ScreenWrapper = ({ children, backgroundColor }) => (
  <SafeAreaView style={[styles.container, { backgroundColor: backgroundColor || colors.background }]} edges={['top']}>
    {children}
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenWrapper;
