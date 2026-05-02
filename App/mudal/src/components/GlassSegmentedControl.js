import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import colors from '../constants/colors';
import typography from '../constants/typography';

const GlassSegmentedControl = ({ values, selectedIndex, onChange, style }) => {
  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'ios' && (
        <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
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

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 24,
    backgroundColor: Platform.OS === 'ios' ? 'rgba(255, 255, 255, 0.3)' : colors.backgroundDark,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
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
