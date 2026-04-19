import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { categoryIcons } from '../constants/icons';

const CategoryIcon = ({ iconKey, color, size = 40, iconSize = 20 }) => {
  const iconName = categoryIcons[iconKey] || 'help-circle-outline';

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color ? `${color}20` : colors.primaryMuted,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={iconSize}
        color={color || colors.primaryDark}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoryIcon;
