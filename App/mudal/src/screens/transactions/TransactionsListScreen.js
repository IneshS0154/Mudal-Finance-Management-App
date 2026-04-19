import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import TransactionItem from '../../components/TransactionItem';
import EmptyState from '../../components/EmptyState';
import PillButton from '../../components/PillButton';
import useTransactionStore from '../../store/transactionStore';
import useAuthStore from '../../store/authStore';
import { formatShortDate } from '../../utils/formatDate';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
];

const TransactionsListScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const { transactions, fetchTransactions } = useTransactionStore();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const currency = user?.currency || 'LKR';

  useEffect(() => { fetchTransactions(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, []);

  const filtered = activeFilter === 'all'
    ? transactions
    : transactions.filter((t) => t.type === activeFilter);

  // Group by date
  const grouped = filtered.reduce((acc, t) => {
    const dateKey = new Date(t.date).toDateString();
    if (!acc[dateKey]) acc[dateKey] = { date: t.date, items: [] };
    acc[dateKey].items.push(t);
    return acc;
  }, {});

  const sections = Object.values(grouped).sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const renderItem = ({ item: section }) => (
    <View style={styles.section}>
      <Text style={styles.sectionDate}>{formatShortDate(section.date)}</Text>
      <View style={styles.sectionCard}>
        {section.items.map((t, i) => (
          <View key={t._id || i}>
            <TransactionItem
              transaction={t}
              currency={currency}
              onPress={() => navigation.navigate('TransactionDetail', { transaction: t })}
            />
            {i < section.items.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryDark} />}
        ListEmptyComponent={
          <EmptyState icon="receipt-outline" title="No Transactions" subtitle="Start recording your income and expenses to track your spending">
            <PillButton title="Add Transaction" onPress={() => navigation.navigate('AddTransaction')} size="medium" />
          </EmptyState>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 12 },
  headerTitle: { ...typography.h1, color: colors.text },
  filterRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 8, marginBottom: 16 },
  filterChip: {
    paddingHorizontal: 18, paddingVertical: 8, borderRadius: 14,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderLight,
  },
  filterChipActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  filterText: { ...typography.smallMedium, color: colors.textSecondary },
  filterTextActive: { color: colors.textOnDark },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  section: { marginBottom: 20 },
  sectionDate: { ...typography.caption, color: colors.textSecondary, marginBottom: 8, marginLeft: 4, letterSpacing: 0.5 },
  sectionCard: {
    backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 14,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  divider: { height: 1, backgroundColor: colors.borderLight },
});

export default TransactionsListScreen;
