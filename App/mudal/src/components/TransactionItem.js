import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useThemeStore from '../store/themeStore';
import typography from '../constants/typography';
import CategoryIcon from './CategoryIcon';
import { formatCurrency } from '../utils/formatCurrency';

const TransactionItem = ({ transaction, currency = 'LKR', onPress }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const isIncome = transaction.type === 'income';
  const cat = transaction.category || {};
  
  const time = new Date(transaction.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  // Fallback to the old CategoryIcon system
  const renderIcon = () => (
    <CategoryIcon
      iconKey={cat.icon || 'other'}
      color={cat.color}
      size={44}
      iconSize={20}
    />
  );

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftIcon}>
        {renderIcon()}
      </View>

      <View style={styles.info}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.title} numberOfLines={1}>{transaction.title}</Text>
          {transaction.isRecurring && (
            <View style={styles.recurringBadge}>
              <MaterialCommunityIcons name="repeat" size={10} color={colors.textOnDark} />
            </View>
          )}
        </View>
        <Text style={styles.time}>{time}</Text>
      </View>

      <Text style={[styles.amount, { color: isIncome ? colors.success : colors.danger }]}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
      </Text>
    </TouchableOpacity>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 2,
  },
  leftIcon: {
    marginRight: 14,
  },
  info: {
    flex: 1,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.text,
  },
  time: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  amount: {
    ...typography.bodySemibold,
    fontSize: 16,
  },
  recurringBadge: {
    backgroundColor: colors.primaryDark,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
});

export default TransactionItem;
