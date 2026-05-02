import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import PillButton from '../../components/PillButton';
import CategoryIcon from '../../components/CategoryIcon';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';

const GoalDetailScreen = ({ navigation, route }) => {
  const { goal } = route.params;
  const { user } = useAuthStore();
  const currency = user?.currency || 'LKR';

  const progress = Math.min(goal.currentAmount / goal.targetAmount, 1);
  const percentage = Math.round(progress * 100);
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Goal Details</Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('AddGoal', { goal })}
            style={styles.editBtn}
          >
            <Ionicons name="pencil" size={20} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.hero}>
          <CategoryIcon 
            iconKey={goal.category?.icon || 'goal'} 
            color={goal.category?.color || colors.primary} 
            size={80} 
            iconSize={36} 
          />
          <Text style={styles.title}>{goal.title}</Text>
          <Text style={styles.percentage}>{percentage}% Complete</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Target</Text>
              <Text style={styles.statValue}>{formatCurrency(goal.targetAmount, currency)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Saved</Text>
              <Text style={styles.statValue}>{formatCurrency(goal.currentAmount, currency)}</Text>
            </View>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${percentage}%` }]} />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoText}>Remaining</Text>
            <Text style={styles.infoValue}>{formatCurrency(remaining, currency)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Plan Details</Text>
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{goal.durationMonths} Months</Text>
            </View>
          </View>
          <View style={[styles.detailRow, { marginTop: 16 }]}>
            <View style={styles.detailIcon}>
              <Ionicons name="cash-outline" size={20} color={colors.success} />
            </View>
            <View>
              <Text style={styles.detailLabel}>Monthly Deduction</Text>
              <Text style={styles.detailValue}>{formatCurrency(goal.monthlyDeduction, currency)}</Text>
            </View>
          </View>
          <Text style={styles.note}>
            This amount will be automatically deducted every month when your salary is added.
          </Text>
        </View>

        {goal.status === 'completed' && (
          <View style={styles.completedBanner}>
            <Ionicons name="checkmark-circle" size={24} color={colors.success} />
            <Text style={styles.completedText}>Congratulations! You've reached your goal.</Text>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  editBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 32 },
  title: { ...typography.h1, color: colors.text },
  percentage: { ...typography.bodyMedium, color: colors.success, marginTop: 4, fontWeight: '700' },
  card: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16, elevation: 3, borderWidth: 1, borderColor: colors.borderLight },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statItem: {},
  statLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: 4 },
  statValue: { ...typography.h3, color: colors.text },
  progressBarBg: { height: 12, backgroundColor: colors.backgroundDark, borderRadius: 6, overflow: 'hidden', marginBottom: 16 },
  progressBarFill: { height: '100%', backgroundColor: colors.success, borderRadius: 6 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoText: { ...typography.small, color: colors.textSecondary },
  infoValue: { ...typography.smallBold, color: colors.text },
  sectionTitle: { ...typography.h4, color: colors.text, marginBottom: 20 },
  detailRow: { flexDirection: 'row', alignItems: 'center' },
  detailIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.backgroundDark, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  detailLabel: { ...typography.caption, color: colors.textSecondary },
  detailValue: { ...typography.bodyMedium, color: colors.text, fontWeight: '600' },
  note: { ...typography.caption, color: colors.textTertiary, marginTop: 24, textAlign: 'center', fontStyle: 'italic' },
  completedBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.successLight, marginHorizontal: 20, padding: 16, borderRadius: 16, marginTop: 8 },
  completedText: { ...typography.smallBold, color: colors.success, marginLeft: 10, flex: 1 },
});

export default GoalDetailScreen;
