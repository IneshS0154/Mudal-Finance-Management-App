import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useThemeStore from '../store/themeStore';
import typography from '../constants/typography';

const SectionHeader = ({ title, actionText, onAction }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {actionText && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.action}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    ...typography.h2,
    color: colors.text,
  },
  action: {
    ...typography.smallMedium,
    color: colors.primaryDark,
  },
});

export default SectionHeader;
