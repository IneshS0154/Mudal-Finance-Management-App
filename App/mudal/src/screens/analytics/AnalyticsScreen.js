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
import GlassSegmentedControl from '../../components/GlassSegmentedControl';
import useTransactionStore from '../../store/transactionStore';
import useAuthStore from '../../store/authStore';
import useBudgetStore from '../../store/budgetStore';
import { formatCurrency } from '../../utils/formatCurrency';

const PERIODS = [
  { key: 'week', label: 'W' },
  { key: 'month', label: 'M' },
  { key: 'year', label: 'Y' },
];

const AnalyticsScreen = () => {
  const { user } = useAuthStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const { budgets, fetchBudgets } = useBudgetStore();
  const [period, setPeriod] = useState('month');
  const currency = user?.currency || 'LKR';

  useEffect(() => { 
    fetchTransactions(); 
    fetchBudgets();
  }, []);

  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalBudgetSpent = budgets.reduce((s, b) => s + (b.spent || 0), 0);

  // Category breakdown
  const categoryMap = {};
  expenses.forEach((t) => {
    const name = t.category?.name || 'Other';
    if (!categoryMap[name]) categoryMap[name] = { ...t.category, total: 0 };
    categoryMap[name].total += t.amount;
  });
  const categoryBreakdown = Object.values(categoryMap).sort((a, b) => b.total - a.total);

  // Generate chart data based on transactions
  const getChartData = () => {
    const now = new Date();
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 12;
    const data = new Array(days).fill(0);
    
    if (period === 'year') {
      expenses.forEach(t => {
        const d = new Date(t.date);
        if (d.getFullYear() === now.getFullYear()) {
          data[d.getMonth()] += t.amount;
        }
      });
    } else {
      expenses.forEach(t => {
        const d = new Date(t.date);
        const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff < days) {
          data[(days - 1) - diff] += t.amount;
        }
      });
    }
    
    // Ensure at least 2 points and avoid all zeros for the chart component
    if (data.every(v => v === 0)) return [0, 0, 0, 0, 0];
    return data;
  };

  const chartData = getChartData();
  const budgetUsage = totalBudget > 0 ? (totalBudgetSpent / totalBudget) * 100 : 0;

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
            <View style={[styles.changeChip, totalIncome > totalExpense ? styles.gainChip : styles.lossChip]}>
              <Ionicons 
                name={totalIncome > totalExpense ? "trending-up" : "trending-down"} 
                size={14} 
                color={totalIncome > totalExpense ? colors.success : colors.danger} 
              />
              <Text style={[styles.changeText, { color: totalIncome > totalExpense ? colors.success : colors.danger }]}>
                {totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0}%
              </Text>
            </View>
          </View>

          {/* Period Selector */}
          <GlassSegmentedControl
            values={PERIODS.map(p => p.label)}
            selectedIndex={PERIODS.findIndex(p => p.key === period)}
            onChange={(index) => setPeriod(PERIODS[index].key)}
            style={{ marginHorizontal: 0, marginBottom: 16 }}
          />

          {/* Chart */}
          <View style={styles.chartContainer}>
            <MiniChart data={chartData} width={320} height={120} color={colors.primary} />
          </View>
        </View>
        
        {/* Budget Usage Card */}
        {totalBudget > 0 && (
          <View style={styles.budgetCard}>
            <View style={styles.budgetHeader}>
              <Text style={styles.budgetTitle}>Budget Usage</Text>
              <Text style={[styles.budgetPct, budgetUsage > 100 && { color: colors.danger }]}>
                {Math.round(budgetUsage)}%
              </Text>
            </View>
            <View style={styles.budgetBarTrack}>
              <View style={[
                styles.budgetBarFill, 
                { width: `${Math.min(budgetUsage, 100)}%`, backgroundColor: budgetUsage > 100 ? colors.danger : colors.primaryDark }
              ]} />
            </View>
            <Text style={styles.budgetNote}>
              {formatCurrency(totalBudgetSpent, currency)} spent of {formatCurrency(totalBudget, currency)} total budget
            </Text>
          </View>
        )}

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
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, gap: 4,
  },
  gainChip: { backgroundColor: colors.successLight },
  lossChip: { backgroundColor: colors.dangerLight },
  changeText: { ...typography.smallMedium },
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
  
  budgetCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 20, padding: 20, marginBottom: 24,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  budgetTitle: { ...typography.bodySemibold, color: colors.text },
  budgetPct: { ...typography.h4, color: colors.primaryDark },
  budgetBarTrack: { height: 8, borderRadius: 4, backgroundColor: colors.backgroundDark, marginBottom: 10 },
  budgetBarFill: { height: 8, borderRadius: 4 },
  budgetNote: { ...typography.caption, color: colors.textSecondary },

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
