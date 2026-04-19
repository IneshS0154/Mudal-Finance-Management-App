import React from 'react';
import { View, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const ProgressBar = ({ progress = 0, color = colors.primaryDark, height = 6, style }) => (
  <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
    <View
      style={[
        styles.fill,
        {
          width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
          backgroundColor: color,
          height,
          borderRadius: height / 2,
        },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  track: {
    backgroundColor: colors.backgroundDark,
    overflow: 'hidden',
  },
  fill: {},
});

export default ProgressBar;
