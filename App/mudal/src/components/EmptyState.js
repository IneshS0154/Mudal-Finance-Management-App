import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../store/themeStore';
import typography from '../constants/typography';

const EmptyState = ({ icon = 'receipt-outline', title, subtitle, children }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={32} color={colors.textSecondary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {children && <View style={styles.action}>{children}</View>}
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32,
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: 22, backgroundColor: colors.backgroundDark,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  title: { ...typography.h3, color: colors.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  action: { marginTop: 20 },
});

export default EmptyState;
