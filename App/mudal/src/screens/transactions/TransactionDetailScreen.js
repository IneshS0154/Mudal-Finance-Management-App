import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import CategoryIcon from '../../components/CategoryIcon';
import PillButton from '../../components/PillButton';
import useTransactionStore from '../../store/transactionStore';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatFullDate } from '../../utils/formatDate';

const TransactionDetailScreen = ({ navigation, route }) => {
  const { transaction } = route.params;
  const { user } = useAuthStore();
  const { deleteTransaction, isLoading } = useTransactionStore();
  const currency = user?.currency || 'LKR';
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    Alert.alert('Delete Transaction', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          const result = await deleteTransaction(transaction._id);
          if (result.success) navigation.goBack();
          else Alert.alert('Error', result.error);
        },
      },
    ]);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddTransaction', { transaction })} style={styles.editBtn}>
            <Ionicons name="pencil" size={18} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Amount card */}
        <View style={[styles.amountCard, isIncome ? styles.incomeCard : styles.expenseCard]}>
          <View style={styles.typeRow}>
            <Ionicons name={isIncome ? 'arrow-down-circle' : 'arrow-up-circle'} size={28} color={isIncome ? colors.success : colors.danger} />
            <Text style={styles.typeLabel}>{isIncome ? 'Income' : 'Expense'}</Text>
          </View>
          <Text style={[styles.amountText, { color: isIncome ? colors.success : colors.danger }]}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </Text>
        </View>

        {/* Details */}
        <View style={styles.detailsCard}>
          <DetailRow label="Title" value={transaction.title} />
          <View style={styles.divider} />
          <DetailRow
            label="Category"
            value={
              <View style={styles.categoryRow}>
                <CategoryIcon iconKey={transaction.category?.icon || 'other'} color={transaction.category?.color} size={28} iconSize={14} />
                <Text style={styles.categoryName}>{transaction.category?.name || 'Other'}</Text>
              </View>
            }
          />
          <View style={styles.divider} />
          <DetailRow label="Date" value={formatFullDate(transaction.date)} />
          {transaction.notes ? (<><View style={styles.divider} /><DetailRow label="Notes" value={transaction.notes} /></>) : null}
        </View>

        <View style={styles.deleteSection}>
          <PillButton title="Delete Transaction" onPress={handleDelete} variant="danger" loading={isLoading}
            icon={<Ionicons name="trash-outline" size={18} color={colors.textOnDark} />} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    {typeof value === 'string' ? <Text style={styles.detailValue}>{value}</Text> : value}
  </View>
);

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight,
  },
  headerTitle: { ...typography.h3, color: colors.text },
  editBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  amountCard: {
    marginHorizontal: 20, borderRadius: 22, padding: 28, alignItems: 'center', marginBottom: 20,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  incomeCard: { backgroundColor: colors.successLight },
  expenseCard: { backgroundColor: colors.dangerLight },
  typeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  typeLabel: { ...typography.bodySemibold, color: colors.text },
  amountText: { fontSize: 38, fontWeight: '700', lineHeight: 46 },
  detailsCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 20, padding: 20,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 },
  detailLabel: { ...typography.body, color: colors.textSecondary },
  detailValue: { ...typography.bodySemibold, color: colors.text, maxWidth: '60%', textAlign: 'right' },
  divider: { height: 1, backgroundColor: colors.borderLight },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  categoryName: { ...typography.bodySemibold, color: colors.text },
  deleteSection: { paddingHorizontal: 20, marginTop: 28 },
});

export default TransactionDetailScreen;
