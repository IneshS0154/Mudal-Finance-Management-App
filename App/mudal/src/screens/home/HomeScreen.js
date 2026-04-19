import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import BalanceCard from '../../components/BalanceCard';
import TransactionItem from '../../components/TransactionItem';
import SectionHeader from '../../components/SectionHeader';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const currency = user?.currency || 'LKR';

  useEffect(() => { fetchTransactions(); }, []);

  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;
  const recent = transactions.slice(0, 5);

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{firstName}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* ── Account Card ── */}
        <BalanceCard
          balance={balance}
          income={income}
          expense={expense}
          currency={currency}
        />

        {/* ── Action Buttons ── */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TransactionsTab', { screen: 'AddTransaction', params: { type: 'expense' } })}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="arrow-up" size={18} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('TransactionsTab', { screen: 'AddTransaction', params: { type: 'income' } })}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="arrow-down" size={18} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>Income</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('BudgetsTab')}
          >
            <View style={styles.actionIconCircle}>
              <Ionicons name="wallet-outline" size={18} color={colors.text} />
            </View>
            <Text style={styles.actionLabel}>Budget</Text>
          </TouchableOpacity>
        </View>

        {/* ── Quick Stats ── */}
        <View style={styles.quickStats}>
          <View style={styles.quickStatCard}>
            <View style={[styles.quickStatIcon, { backgroundColor: colors.successLight }]}>
              <MaterialCommunityIcons name="trending-up" size={18} color={colors.success} />
            </View>
            <Text style={styles.quickStatLabel}>This month</Text>
            <Text style={styles.quickStatValue}>+12%</Text>
          </View>
          <View style={styles.quickStatCard}>
            <View style={[styles.quickStatIcon, { backgroundColor: colors.warningLight }]}>
              <MaterialCommunityIcons name="target" size={18} color={colors.warning} />
            </View>
            <Text style={styles.quickStatLabel}>Budget used</Text>
            <Text style={styles.quickStatValue}>63%</Text>
          </View>
          <View style={styles.quickStatCard}>
            <View style={[styles.quickStatIcon, { backgroundColor: colors.primaryMuted }]}>
              <MaterialCommunityIcons name="flag-outline" size={18} color={colors.primaryDark} />
            </View>
            <Text style={styles.quickStatLabel}>Goals</Text>
            <Text style={styles.quickStatValue}>3</Text>
          </View>
        </View>

        {/* ── Transaction Section ── */}
        <View style={styles.transactionSection}>
          <SectionHeader
            title="Transaction"
            actionText="View all"
            onAction={() => navigation.navigate('TransactionsTab')}
          />

          <Text style={styles.dateLabel}>TODAY</Text>

          <View style={styles.transactionCard}>
            {recent.length > 0 ? (
              recent.map((t, i) => (
                <View key={t._id}>
                  <TransactionItem
                    transaction={t}
                    currency={currency}
                    onPress={() =>
                      navigation.navigate('TransactionsTab', {
                        screen: 'TransactionDetail',
                        params: { transaction: t },
                      })
                    }
                  />
                  {i < recent.length - 1 && <View style={styles.divider} />}
                </View>
              ))
            ) : (
              <View style={styles.emptyRow}>
                <Text style={styles.emptyText}>No transactions yet</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    ...typography.small,
    color: colors.textSecondary,
  },
  userName: {
    ...typography.h2,
    color: colors.text,
    marginTop: 2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  actionBtnAdd: {
    flex: 0.6,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  addIconCircle: {
    backgroundColor: colors.primaryDark,
    marginBottom: 0,
  },
  actionLabel: {
    ...typography.caption,
    color: colors.text,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  quickStatCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  quickStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  quickStatLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  quickStatValue: {
    ...typography.h3,
    color: colors.text,
    marginTop: 2,
  },
  transactionSection: {
    paddingHorizontal: 20,
  },
  dateLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },
  transactionCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
  emptyRow: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});

export default HomeScreen;
