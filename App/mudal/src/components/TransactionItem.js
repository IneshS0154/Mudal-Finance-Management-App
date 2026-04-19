import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import typography from '../constants/typography';
import CategoryIcon from './CategoryIcon';
import { formatCurrency } from '../utils/formatCurrency';

const TransactionItem = ({ transaction, currency = 'LKR', onPress }) => {
  const isIncome = transaction.type === 'income';
  const cat = transaction.category || {};
  const time = new Date(transaction.date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftIcon}>
        <CategoryIcon
          iconKey={cat.icon || 'other'}
          color={cat.color}
          size={44}
          iconSize={20}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{transaction.title}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>

      <Text style={[styles.amount, { color: isIncome ? colors.success : colors.text }]}>
        {isIncome ? '+' : '-'} {formatCurrency(transaction.amount, currency)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
});

export default TransactionItem;
