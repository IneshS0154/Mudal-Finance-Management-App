import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import useThemeStore from '../../store/themeStore';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import BalanceCard from '../../components/BalanceCard';
import TransactionItem from '../../components/TransactionItem';
import RecurringItem from '../../components/RecurringItem';
import SectionHeader from '../../components/SectionHeader';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';
import useRecurringStore from '../../store/recurringStore';

const HomeScreen = ({ navigation }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const { user } = useAuthStore();
  const { transactions, fetchTransactions, isLoading: txLoading } = useTransactionStore();
  const { recurringItems, fetchRecurring, isLoading: recLoading } = useRecurringStore();

  const currency = user?.currency || 'LKR';
  const firstName = user?.name?.split(' ')[0] || 'User';

  const loadData = useCallback(async () => {
    await Promise.all([
      fetchTransactions(),
      fetchRecurring(),
    ]);
  }, [fetchTransactions, fetchRecurring]);

  useEffect(() => {
    loadData();
  }, []);

  // ── Balance Calculation (Transactions + Recurring + Salary) ──
  const txIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const recIncome = recurringItems.filter(r => r.type === 'income').reduce((s, r) => s + r.amount, 0);
  const monthlySalary = user?.monthlySalary || 0;
  const totalIncome = txIncome + recIncome + monthlySalary;

  const txExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const recExpense = recurringItems.filter(r => r.type === 'expense').reduce((s, r) => s + r.amount, 0);
  const totalExpense = txExpense + recExpense;

  const totalBalance = totalIncome - totalExpense;

  // Recent Activity (Top 5 from real transactions)
  const recentTx = transactions.slice(0, 5);

  // Upcoming Recurring (Top 2)
  const upcomingRec = [...recurringItems]
    .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))
    .slice(0, 2);

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={txLoading || recLoading}
            onRefresh={loadData}
            tintColor={colors.primaryDark}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{firstName}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Account Card (Live Balance) */}
        <BalanceCard
          balance={totalBalance}
          income={totalIncome}
          expense={totalExpense}
          currency={currency}
        />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('transactions', { screen: 'AddTransaction', params: { type: 'expense' } })}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="arrow-up" size={18} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('transactions', { screen: 'AddTransaction', params: { type: 'income' } })}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="arrow-down" size={18} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => navigation.navigate('budgets', { screen: 'Recurring' })}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="repeat-outline" size={18} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>Recurring</Text>
          </TouchableOpacity>
        </View>

        {/* Recurring Transactions Section */}
        {upcomingRec.length > 0 && (
          <View style={styles.section}>
            <SectionHeader
              title="Recurring Transactions"
              actionText="See all"
              onAction={() => navigation.navigate('budgets', { screen: 'Recurring' })}
            />
            {upcomingRec.map((item) => (
              <RecurringItem
                key={item._id}
                item={item}
                currency={currency}
                onPress={() => navigation.navigate('budgets', {
                  screen: 'RecurringDetail',
                  params: { recurring: item }
                })}
              />
            ))}
          </View>
        )}

        {/* Activity Section (Live Transactions) */}
        <View style={styles.section}>
          <SectionHeader
            title="Transactions"
            actionText="View all"
            onAction={() => navigation.navigate('transactions')}
          />

          <View style={styles.transactionCard}>
            {recentTx.length > 0 ? (
              recentTx.map((t, i) => (
                <View key={t._id}>
                  <TransactionItem
                    transaction={t}
                    currency={currency}
                    onPress={() =>
                      navigation.navigate('transactions', {
                        screen: 'TransactionDetail',
                        params: { transaction: t },
                      })
                    }
                  />
                  {i < recentTx.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No recent activity</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const getStyles = (colors) => StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20,
  },
  greeting: { ...typography.small, color: colors.textSecondary },
  userName: { ...typography.h2, color: colors.text, marginTop: 2 },
  notifBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight,
  },
  actionRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 24 },
  actionBtn: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 16,
    paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: colors.borderLight,
  },
  actionIconCircle: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: colors.backgroundDark,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  actionLabel: { ...typography.caption, color: colors.text },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  transactionCard: {
    backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 16,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  divider: { height: 1, backgroundColor: colors.borderLight },
  emptyRow: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { ...typography.body, color: colors.textSecondary },
});

export default HomeScreen;
