import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/themeStore';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import BudgetCard from '../../components/BudgetCard';
import ProgressBar from '../../components/ProgressBar';
import EmptyState from '../../components/EmptyState';
import PillButton from '../../components/PillButton';
import GlassSegmentedControl from '../../components/GlassSegmentedControl';
import useBudgetStore from '../../store/budgetStore';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';

const SECTIONS = [
  { key: 'budgets', label: 'Budgets', icon: 'wallet-outline' },
  { key: 'recurring', label: 'Recurring', icon: 'repeat' },
  { key: 'goals', label: 'Goals', icon: 'flag-outline' },
];

const BudgetsScreen = ({ navigation }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const { user } = useAuthStore();
  const { budgets, fetchBudgets } = useBudgetStore();
  const [refreshing, setRefreshing] = useState(false);
  const currency = user?.currency || 'LKR';

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);
  const totalRemaining = totalBudget - totalSpent;
  const overallProgress = totalBudget > 0 ? totalSpent / totalBudget : 0;

  useEffect(() => { fetchBudgets(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true); await fetchBudgets(); setRefreshing(false);
  }, []);

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryDark} />}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Budget</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddBudget')} style={styles.headerAddBtn}>
            <Ionicons name="add" size={24} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Pro Segment Nav */}
        <GlassSegmentedControl 
          values={SECTIONS.map(s => s.label)}
          selectedIndex={0}
          onChange={(index) => {
            const s = SECTIONS[index];
            if (s.key === 'recurring') navigation.navigate('Recurring');
            if (s.key === 'goals') navigation.navigate('Goals');
          }}
          style={{ marginTop: 8 }}
        />

        {/* Overview */}
        {budgets.length > 0 && (
          <View style={styles.overviewCard}>
            <View style={styles.overviewRow}>
              <View>
                <Text style={styles.overviewLabel}>Total Budget</Text>
                <Text style={styles.overviewAmount}>{formatCurrency(totalBudget, currency)}</Text>
              </View>
              <View style={styles.overviewRight}>
                <Text style={styles.overviewLabel}>Remaining</Text>
                <Text style={[styles.overviewRemaining, totalRemaining < 0 && { color: colors.danger }]}>
                  {formatCurrency(Math.abs(totalRemaining), currency)}
                </Text>
              </View>
            </View>
            <ProgressBar
              progress={Math.min(overallProgress, 1)}
              color={overallProgress > 1 ? colors.danger : overallProgress > 0.8 ? colors.warning : colors.primaryDark}
              height={8}
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.overviewSpent}>
              {formatCurrency(totalSpent, currency)} spent of {formatCurrency(totalBudget, currency)}
            </Text>
          </View>
        )}

        <View style={styles.list}>
          {budgets.length > 0 ? (
            budgets.map((b) => <BudgetCard key={b._id} budget={b} currency={currency} onPress={() => navigation.navigate('AddBudget', { budget: b })} />)
          ) : (
            <EmptyState icon="wallet-outline" title="No Budgets Set" subtitle="Set monthly budgets for your spending categories">
              <PillButton title="Create Budget" onPress={() => navigation.navigate('AddBudget')} size="medium" />
            </EmptyState>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const getStyles = (colors) => StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { ...typography.h1, color: colors.text },
  headerAddBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  segments: {
    flexDirection: 'row', marginHorizontal: 20, backgroundColor: '#FFFFFF',
    borderRadius: 24, padding: 6, marginBottom: 24, 
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)',
  },
  segment: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 18, gap: 6,
  },
  segmentActive: { backgroundColor: colors.primaryDark, shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  segmentText: { ...typography.smallMedium, color: colors.textTertiary },
  segmentTextActive: { color: colors.textOnDark, fontWeight: '600' },
  overviewCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 24, padding: 22, marginBottom: 24,
    shadowColor: colors.shadowMedium, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 18, elevation: 3,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  overviewRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  overviewLabel: { ...typography.caption, color: colors.textSecondary },
  overviewAmount: { ...typography.amountMedium, color: colors.text, marginTop: 4 },
  overviewRight: { alignItems: 'flex-end' },
  overviewRemaining: { ...typography.amountSmall, color: colors.success, marginTop: 4 },
  overviewSpent: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  list: { paddingHorizontal: 20 },
});

export default BudgetsScreen;
