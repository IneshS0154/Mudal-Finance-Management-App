import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import colors from '../constants/colors';
import typography from '../constants/typography';

const PillButton = ({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const getStyle = () => {
    switch (variant) {
      case 'outline':
        return {
          bg: colors.surface,
          text: colors.text,
          border: colors.border,
        };
      case 'secondary':
        return {
          bg: colors.backgroundDark,
          text: colors.primaryDark,
          border: 'transparent',
        };
      case 'danger':
        return {
          bg: colors.danger,
          text: colors.textOnDark,
          border: 'transparent',
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: colors.primaryDark,
          border: 'transparent',
        };
      case 'accent':
        return {
          bg: colors.primary,
          text: colors.primaryDeep,
          border: 'transparent',
        };
      default:
        return {
          bg: colors.primaryDark,
          text: colors.textOnDark,
          border: 'transparent',
        };
    }
  };

  const s = getStyle();
  const isSmall = size === 'small';
  const isMedium = size === 'medium';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        {
          backgroundColor: s.bg,
          borderColor: s.border,
          borderWidth: variant === 'outline' ? 1.5 : 0,
          height: isSmall ? 40 : isMedium ? 48 : 56,
          paddingHorizontal: isSmall ? 20 : 24,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={s.text} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={[styles.text, { color: s.text }, isSmall && styles.textSmall]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    ...typography.button,
  },
  textSmall: {
    ...typography.buttonSmall,
  },
  icon: {
    marginRight: 2,
  },
});

export default PillButton;
