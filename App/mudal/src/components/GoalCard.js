import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import typography from '../constants/typography';
import CategoryIcon from './CategoryIcon';
import { formatCurrency } from '../utils/formatCurrency';

const GoalCard = ({ goal, currency, onPress }) => {
  const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);
  const percentage = Math.round(progress * 100);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <CategoryIcon 
          iconKey={goal.category?.icon || 'goal'} 
          color={goal.category?.color || colors.primary} 
          size={48} 
          iconSize={22} 
        />
        <View style={styles.titleArea}>
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.status}>
            {goal.status === 'completed' ? 'Target Reached!' : `${goal.durationMonths} months plan`}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{percentage}%</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressLabels}>
          <Text style={styles.current}>{formatCurrency(goal.currentAmount, currency)}</Text>
          <Text style={styles.target}>of {formatCurrency(goal.targetAmount, currency)}</Text>
        </View>
        
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <Ionicons name="calendar-outline" size={14} color={colors.textTertiary} />
        <Text style={styles.footerText}>Next deduction: {formatCurrency(goal.monthlyDeduction, currency)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface, borderRadius: 22, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: colors.borderLight,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  header: { flexDirection: 'row', alignItems: 'center' },
  titleArea: { flex: 1, marginLeft: 12 },
  title: { ...typography.h4, color: colors.text },
  status: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  badge: { backgroundColor: colors.successLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { ...typography.smallBold, color: colors.success },
  progressSection: { marginTop: 20 },
  progressLabels: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 10 },
  current: { ...typography.h3, color: colors.text },
  target: { ...typography.caption, color: colors.textTertiary, marginLeft: 6 },
  progressBarBg: { height: 8, backgroundColor: colors.backgroundDark, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: colors.success, borderRadius: 4 },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.borderLight },
  footerText: { ...typography.caption, color: colors.textTertiary, marginLeft: 6 },
});

export default GoalCard;
