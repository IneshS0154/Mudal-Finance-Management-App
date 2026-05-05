import React from 'react';
import { View, StyleSheet } from 'react-native';
import useThemeStore from '../store/themeStore';

const ProgressBar = ({ progress = 0, color, height = 6, style }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  
  const barColor = color || colors.primaryDark;

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }, style]}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
            backgroundColor: barColor,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  track: {
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  fill: {},
});

export default ProgressBar;
