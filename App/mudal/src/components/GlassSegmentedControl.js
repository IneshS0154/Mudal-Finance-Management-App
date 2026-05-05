import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import useThemeStore from '../store/themeStore';
import typography from '../constants/typography';

const GlassSegmentedControl = ({ values, selectedIndex, onChange, style }) => {
  const { colors, isDarkMode } = useThemeStore();
  const styles = getStyles(colors, isDarkMode);
  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'ios' && (
        <BlurView intensity={isDarkMode ? 30 : 60} tint={isDarkMode ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
      )}
      <View style={styles.liquidOverlay} />
      
      <View style={styles.inner}>
        {values.map((val, index) => {
          const isSelected = selectedIndex === index;
          return (
            <TouchableOpacity
              key={index}
              style={[styles.segment, isSelected && styles.segmentActive]}
              onPress={() => onChange(index)}
              activeOpacity={0.8}
            >
              <Text style={[styles.text, isSelected && styles.textActive]}>
                {val}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const getStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 24,
    backgroundColor: Platform.OS === 'ios' ? (isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.3)') : colors.surfaceMuted,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  liquidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderTopColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.8)',
  },
  inner: {
    flex: 1,
    flexDirection: 'row',
    padding: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  segmentActive: {
    backgroundColor: colors.primaryDark,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  text: {
    ...typography.smallBold,
    color: colors.textSecondary,
  },
  textActive: {
    color: colors.textOnDark,
  },
});

export default GlassSegmentedControl;
