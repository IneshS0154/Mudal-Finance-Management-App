import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../store/themeStore';
import typography from '../constants/typography';
import CategoryIcon from './CategoryIcon';
import { formatCurrency } from '../utils/formatCurrency';

const RecurringItem = ({ item, currency = 'LKR', onPress }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const cat = item.category || {};
  const dueDate = new Date(item.nextDueDate);
  const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const dueLabel =
    daysUntil <= 0 ? 'Due today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`;

  const isIncome = item.type === 'income';
  const catColor = cat.color || (isIncome ? colors.success : colors.danger);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>

      <CategoryIcon 
        iconKey={cat.icon || 'repeat'} 
        color={catColor} 
        size={46} 
        iconSize={22} 
      />

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metaRow}>
          {/* Type badge */}
          <View style={[styles.badge, isIncome ? styles.badgeIncome : styles.badgeExpense]}>
            <Ionicons
              name={isIncome ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
              size={10}
              color={isIncome ? colors.success : colors.danger}
            />
            <Text style={[styles.badgeText, isIncome ? styles.badgeTextIncome : styles.badgeTextExpense]}>
              {isIncome ? 'Income' : 'Expense'}
            </Text>
          </View>

          {/* Frequency badge */}
          <View style={styles.freqBadge}>
            <Text style={styles.freqText}>{item.frequency}</Text>
          </View>
        </View>

        {/* Due label */}
        <Text style={styles.dueText}>{dueLabel}</Text>
      </View>

      {/* Right side: amount */}
      <View style={styles.right}>
        <Text style={[styles.amount, isIncome ? styles.amountIncome : styles.amountExpense]}>
          {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors) => StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 18, padding: 14, marginBottom: 10,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  info: { flex: 1, marginLeft: 12 },
  title: { ...typography.bodyMedium, color: colors.text, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 3 },

  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
  },
  badgeExpense: { backgroundColor: colors.dangerLight },
  badgeIncome: { backgroundColor: colors.successLight },
  badgeText: { fontSize: 10, fontWeight: '600' },
  badgeTextExpense: { color: colors.danger },
  badgeTextIncome: { color: colors.success },

  freqBadge: {
    backgroundColor: colors.primaryMuted, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
  },
  freqText: { ...typography.caption, color: colors.primaryDark, textTransform: 'capitalize' },
  dueText: { ...typography.caption, color: colors.textSecondary },

  // right column
  right: { alignItems: 'flex-end', gap: 8, marginLeft: 8 },
  amount: { ...typography.bodySemibold, textAlign: 'right' },
  amountExpense: { color: colors.danger },
  amountIncome: { color: colors.success },
});

export default RecurringItem;
