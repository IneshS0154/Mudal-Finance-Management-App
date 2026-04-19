import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import MiniChart from '../../components/MiniChart';
import CategoryIcon from '../../components/CategoryIcon';
import useTransactionStore from '../../store/transactionStore';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';

const PERIODS = [
  { key: 'week', label: 'W' },
  { key: 'month', label: 'M' },
  { key: 'year', label: 'Y' },
];

const AnalyticsScreen = () => {
  const { user } = useAuthStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const [period, setPeriod] = useState('month');
  const currency = user?.currency || 'LKR';

  useEffect(() => { fetchTransactions(); }, []);

  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  // Category breakdown
  const categoryMap = {};
  expenses.forEach((t) => {
    const name = t.category?.name || 'Other';
    if (!categoryMap[name]) categoryMap[name] = { ...t.category, total: 0 };
    categoryMap[name].total += t.amount;
  });
  const categoryBreakdown = Object.values(categoryMap).sort((a, b) => b.total - a.total);

  const chartData = [30, 45, 25, 60, 35, 50, 40, 55, 30, 45, 65, 35];

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Statistics</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryLabel}>Total Spending</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(totalExpense, currency)}</Text>
            </View>
            <View style={styles.changeChip}>
              <Ionicons name="trending-down" size={14} color={colors.danger} />
              <Text style={styles.changeText}>-12%</Text>
            </View>
          </View>

          {/* Period Selector */}
          <View style={styles.periodRow}>
            {PERIODS.map((p) => (
              <TouchableOpacity
                key={p.key}
                style={[styles.periodBtn, period === p.key && styles.periodBtnActive]}
                onPress={() => setPeriod(p.key)}
              >
                <Text style={[styles.periodText, period === p.key && styles.periodTextActive]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chart */}
          <View style={styles.chartContainer}>
            <MiniChart data={chartData} width={320} height={120} color={colors.primary} />
          </View>
        </View>

        {/* Income vs Expense */}
        <View style={styles.compRow}>
          <View style={styles.compCard}>
            <View style={[styles.compDot, { backgroundColor: colors.success }]} />
            <Text style={styles.compLabel}>Income</Text>
            <Text style={styles.compValue}>{formatCurrency(totalIncome, currency)}</Text>
          </View>
          <View style={styles.compCard}>
            <View style={[styles.compDot, { backgroundColor: colors.danger }]} />
            <Text style={styles.compLabel}>Expense</Text>
            <Text style={styles.compValue}>{formatCurrency(totalExpense, currency)}</Text>
          </View>
        </View>

        {/* Category Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Category Breakdown</Text>
          <View style={styles.breakdownCard}>
            {categoryBreakdown.map((cat, i) => {
              const pct = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0;
              return (
                <View key={cat.name || i}>
                  <View style={styles.breakdownRow}>
                    <CategoryIcon iconKey={cat.icon || 'other'} color={cat.color} size={40} iconSize={18} />
                    <View style={styles.breakdownInfo}>
                      <Text style={styles.breakdownName}>{cat.name}</Text>
                      <View style={styles.breakdownBarTrack}>
                        <View style={[styles.breakdownBarFill, { width: `${pct}%`, backgroundColor: cat.color || colors.primaryDark }]} />
                      </View>
                    </View>
                    <View style={styles.breakdownRight}>
                      <Text style={styles.breakdownAmount}>{formatCurrency(cat.total, currency)}</Text>
                      <Text style={styles.breakdownPct}>{pct}%</Text>
                    </View>
                  </View>
                  {i < categoryBreakdown.length - 1 && <View style={styles.divider} />}
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16 },
  headerTitle: { ...typography.h1, color: colors.text },
  summaryCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 22,
    shadowColor: colors.shadowMedium, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 20, elevation: 4,
    borderWidth: 1, borderColor: colors.borderLight, marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  summaryLabel: { ...typography.small, color: colors.textSecondary },
  summaryAmount: { ...typography.amountLarge, fontSize: 30, color: colors.text, marginTop: 4 },
  changeChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.dangerLight,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, gap: 4,
  },
  changeText: { ...typography.smallMedium, color: colors.danger },
  periodRow: { flexDirection: 'row', gap: 6, marginBottom: 16 },
  periodBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
    backgroundColor: colors.backgroundDark,
  },
  periodBtnActive: { backgroundColor: colors.primaryDark },
  periodText: { ...typography.smallMedium, color: colors.textSecondary },
  periodTextActive: { color: colors.textOnDark },
  chartContainer: { alignItems: 'center', marginTop: 4 },
  compRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  compCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  compDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 8 },
  compLabel: { ...typography.caption, color: colors.textSecondary },
  compValue: { ...typography.h3, color: colors.text, marginTop: 4 },
  breakdownSection: { paddingHorizontal: 20 },
  breakdownTitle: { ...typography.h3, color: colors.text, marginBottom: 12 },
  breakdownCard: {
    backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 16,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  breakdownInfo: { flex: 1, marginLeft: 12 },
  breakdownName: { ...typography.bodyMedium, color: colors.text, marginBottom: 6 },
  breakdownBarTrack: { height: 4, borderRadius: 2, backgroundColor: colors.backgroundDark },
  breakdownBarFill: { height: 4, borderRadius: 2 },
  breakdownRight: { alignItems: 'flex-end', marginLeft: 12 },
  breakdownAmount: { ...typography.smallMedium, color: colors.text },
  breakdownPct: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.borderLight },
});

export default AnalyticsScreen;
