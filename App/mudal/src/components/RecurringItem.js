import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import typography from '../constants/typography';
import { formatCurrency } from '../utils/formatCurrency';
import CategoryIcon from './CategoryIcon';

const RecurringItem = ({ item, currency = 'LKR', onPress, onEdit, onDelete }) => {
  const cat = item.category || {};
  const dueDate = new Date(item.nextDueDate);
  const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const dueLabel =
    daysUntil <= 0 ? 'Due today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`;

  const isIncome = item.type === 'income';
  const catColor = cat.color || (isIncome ? colors.success : colors.danger);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>

      {/* Icon */}
      {cat.icon ? (
        <CategoryIcon
          iconKey={cat.icon}
          color={catColor}
          size={46}
          iconSize={22}
        />
      ) : (
        <View style={[styles.iconCircle, { backgroundColor: `${catColor}20` }]}>
          <Ionicons name="repeat" size={20} color={catColor} />
        </View>
      )}

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

      {/* Right side: amount + action icons */}
      <View style={styles.right}>
        <Text style={[styles.amount, isIncome ? styles.amountIncome : styles.amountExpense]}>
          {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
        </Text>

        {(onEdit || onDelete) && (
          <View style={styles.actionRow}>
            {/* Edit icon */}
            {onEdit && (
              <TouchableOpacity
                style={[styles.iconBtn, styles.iconBtnEdit]}
                onPress={(e) => { e.stopPropagation?.(); onEdit(); }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="pencil" size={13} color={colors.primaryDark} />
              </TouchableOpacity>
            )}

            {/* Delete icon */}
            {onDelete && (
              <TouchableOpacity
                style={[styles.iconBtn, styles.iconBtnDelete]}
                onPress={(e) => { e.stopPropagation?.(); onDelete(); }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={13} color={colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 18, padding: 14, marginBottom: 10,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  iconCircle: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  emojiText: { fontSize: 22 },

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

  actionRow: { flexDirection: 'row', gap: 6 },
  iconBtn: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBtnEdit: { backgroundColor: colors.primaryMuted },
  iconBtnDelete: { backgroundColor: colors.dangerLight },
});

export default RecurringItem;
