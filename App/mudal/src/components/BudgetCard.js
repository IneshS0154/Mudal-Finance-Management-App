import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import typography from '../constants/typography';
import CategoryIcon from './CategoryIcon';
import ProgressBar from './ProgressBar';
import { formatCurrency } from '../utils/formatCurrency';

const BudgetCard = ({ budget, currency = 'LKR', onPress }) => {
  const { category, limit, spent = 0 } = budget;
  const progress = limit > 0 ? spent / limit : 0;
  const remaining = limit - spent;
  const isOver = progress > 1;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topRow}>
        <CategoryIcon iconKey={category?.icon || 'other'} color={category?.color} size={42} iconSize={20} />
        <View style={styles.info}>
          <Text style={styles.catName}>{category?.name || 'Category'}</Text>
          <Text style={styles.remaining}>
            {isOver ? 'Over by ' : ''}{formatCurrency(Math.abs(remaining), currency)} {isOver ? '' : 'left'}
          </Text>
        </View>
        <View style={styles.amountCol}>
          <Text style={styles.spent}>{formatCurrency(spent, currency)}</Text>
          <Text style={styles.limit}>of {formatCurrency(limit, currency)}</Text>
        </View>
      </View>
      <ProgressBar
        progress={Math.min(progress, 1)}
        color={isOver ? colors.danger : progress > 0.8 ? colors.warning : category?.color || colors.primaryDark}
        height={6}
        style={styles.progressBar}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  info: { flex: 1, marginLeft: 12 },
  catName: { ...typography.bodyMedium, color: colors.text },
  remaining: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  amountCol: { alignItems: 'flex-end' },
  spent: { ...typography.bodySemibold, color: colors.text },
  limit: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  progressBar: {},
});

export default BudgetCard;
