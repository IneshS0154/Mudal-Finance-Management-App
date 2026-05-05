import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/themeStore';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import TransactionItem from '../../components/TransactionItem';
import useTransactionStore from '../../store/transactionStore';
import useAuthStore from '../../store/authStore';
import EmptyState from '../../components/EmptyState';
import PillButton from '../../components/PillButton';

const TransactionsListScreen = ({ navigation }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const { user } = useAuthStore();
  const { transactions, fetchTransactions, isLoading } = useTransactionStore();
  const [refreshing, setRefreshing] = useState(false);
  const currency = user?.currency || 'LKR';

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, [fetchTransactions]);

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity</Text>
      </View>

      <View style={styles.content}>
        {transactions.length > 0 ? (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TransactionItem
                transaction={item}
                currency={currency}
                onPress={() => navigation.navigate('TransactionDetail', { transaction: item })}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryDark} />
            }
          />
        ) : (
          <EmptyState
            icon="receipt-outline"
            title="No Activity Yet"
            subtitle="Record your first transaction by clicking the button below."
          >
            <PillButton 
              title="Add Transaction" 
              onPress={() => navigation.navigate('AddTransaction')} 
              size="medium"
            />
          </EmptyState>
        )}
      </View>
    </ScreenWrapper>
  );
};

const getStyles = (colors) => StyleSheet.create({
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 
  },
  headerTitle: { ...typography.h1, color: colors.text },
  content: { flex: 1 },
  listContent: { paddingHorizontal: 20, paddingBottom: 120, paddingTop: 5 },
});

export default TransactionsListScreen;
