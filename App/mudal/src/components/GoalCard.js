import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import typography from '../constants/typography';
import ProgressBar from './ProgressBar';
import { formatCurrency } from '../utils/formatCurrency';

const GoalCard = ({ goal, currency = 'LKR', onPress }) => {
  const progress = goal.targetAmount > 0 ? goal.savedAmount / goal.targetAmount : 0;
  const percentage = Math.round(progress * 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)));

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="flag" size={18} color={colors.primaryDark} />
        </View>
        <View style={styles.info}>
          <Text style={styles.goalName}>{goal.name}</Text>
          <Text style={styles.daysLeft}>{daysLeft} days left</Text>
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <ProgressBar
        progress={Math.min(progress, 1)}
        color={colors.primary}
        height={6}
        style={styles.progressBar}
      />

      <View style={styles.bottomRow}>
        <Text style={styles.saved}>{formatCurrency(goal.savedAmount, currency)} saved</Text>
        <Text style={styles.target}>of {formatCurrency(goal.targetAmount, currency)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, borderRadius: 18, padding: 18, marginBottom: 12,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  iconCircle: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primaryMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  info: { flex: 1, marginLeft: 12 },
  goalName: { ...typography.bodyMedium, color: colors.text },
  daysLeft: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  percentage: { ...typography.h3, color: colors.primaryDark },
  progressBar: { marginBottom: 10 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between' },
  saved: { ...typography.smallMedium, color: colors.success },
  target: { ...typography.small, color: colors.textSecondary },
});

export default GoalCard;
