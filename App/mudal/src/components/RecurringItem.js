import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import typography from '../constants/typography';
import CategoryIcon from './CategoryIcon';
import { formatCurrency } from '../utils/formatCurrency';

const RecurringItem = ({ item, currency = 'LKR', onPress }) => {
  const cat = item.category || {};
  const dueDate = new Date(item.nextDueDate);
  const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const dueLabel = daysUntil <= 0 ? 'Due today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <CategoryIcon iconKey={cat.icon || 'other'} color={cat.color} size={44} iconSize={20} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.freqBadge}>
            <Text style={styles.freqText}>{item.frequency}</Text>
          </View>
          <Text style={styles.dueText}>{dueLabel}</Text>
        </View>
      </View>
      <Text style={styles.amount}>{formatCurrency(item.amount, currency)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 18, padding: 16, marginBottom: 10,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  info: { flex: 1, marginLeft: 12 },
  title: { ...typography.bodyMedium, color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  freqBadge: {
    backgroundColor: colors.primaryMuted, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  freqText: { ...typography.caption, color: colors.primaryDark, textTransform: 'capitalize' },
  dueText: { ...typography.caption, color: colors.textSecondary },
  amount: { ...typography.bodySemibold, color: colors.text },
});

export default RecurringItem;
