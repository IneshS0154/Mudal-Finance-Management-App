import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import CategoryIcon from '../../components/CategoryIcon';
import useTransactionStore from '../../store/transactionStore';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';

const TransactionDetailScreen = ({ navigation, route }) => {
  const transaction = route.params.transaction;
  const { user } = useAuthStore();
  const { deleteTransaction, isLoading } = useTransactionStore();
  const currency = user?.currency || 'LKR';

  const isIncome = transaction.type === 'income';
  const cat = transaction.category || {};
  const catColor = cat.color || (isIncome ? colors.success : colors.danger);

  const handleDelete = () => {
    Alert.alert('Delete Activity', 'Delete this record permanently?', [
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

  const handleEdit = () => {
    navigation.navigate('AddTransaction', { transaction });
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail</Text>
          <TouchableOpacity onPress={handleEdit} style={styles.editBtn}>
            <Ionicons name="pencil" size={18} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <CategoryIcon 
            iconKey={cat.icon || 'cash-multiple'} 
            color={catColor} 
            size={72} 
            iconSize={36} 
          />
          
          <Text style={styles.title}>{transaction.title}</Text>
          <Text style={[styles.amount, isIncome ? styles.incomeText : styles.expenseText]}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount, currency)}
          </Text>
          
          <View style={[styles.typeBadge, isIncome ? styles.typeBadgeIncome : styles.typeBadgeExpense]}>
            <Ionicons 
              name={isIncome ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'} 
              size={14} 
              color={isIncome ? colors.success : colors.danger} 
            />
            <Text style={[styles.typeText, isIncome ? styles.typeTextIncome : styles.typeTextExpense]}>
              {isIncome ? 'Income' : 'Expense'}
            </Text>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.backgroundDark }]}>
              <Ionicons name="grid-outline" size={18} color={colors.textSecondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{cat.name || 'Uncategorized'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.backgroundDark }]}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {new Date(transaction.date).toLocaleDateString('en-US', { 
                  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
                })}
              </Text>
            </View>
          </View>

          {transaction.notes ? (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={[styles.infoIcon, { backgroundColor: colors.backgroundDark }]}>
                  <Ionicons name="document-text-outline" size={18} color={colors.textSecondary} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Notes</Text>
                  <Text style={styles.infoValue}>{transaction.notes}</Text>
                </View>
              </View>
            </>
          ) : null}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.8}>
            <Ionicons name="pencil-outline" size={20} color={colors.textOnDark} />
            <Text style={styles.editButtonText}>Edit Activity</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  editBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  
  heroCard: { 
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 24, padding: 28, alignItems: 'center', marginTop: 12, marginBottom: 20,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16, elevation: 3,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  title: { ...typography.h2, color: colors.text, marginBottom: 8, textAlign: 'center' },
  amount: { fontSize: 32, fontWeight: '700', marginBottom: 14 },
  incomeText: { color: colors.success },
  expenseText: { color: colors.danger },
  typeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  typeBadgeExpense: { backgroundColor: colors.dangerLight },
  typeBadgeIncome: { backgroundColor: colors.successLight },
  typeText: { ...typography.smallMedium, fontWeight: '600' },
  typeTextExpense: { color: colors.danger },
  typeTextIncome: { color: colors.success },

  infoCard: { 
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.borderLight, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  infoIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: 4 },
  infoValue: { ...typography.bodyMedium, color: colors.text },
  divider: { height: 1, backgroundColor: colors.borderLight, marginLeft: 78 },

  actions: { paddingHorizontal: 20, marginTop: 24, gap: 12 },
  editButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryDark, 
    borderRadius: 18, paddingVertical: 16, gap: 10, shadowColor: colors.primaryDeep, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  editButtonText: { ...typography.bodyMedium, color: colors.textOnDark, fontWeight: '700' },
  deleteButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.dangerLight, 
    borderRadius: 18, paddingVertical: 16, gap: 10, borderWidth: 1.5, borderColor: colors.danger,
  },
  deleteButtonText: { ...typography.bodyMedium, color: colors.danger, fontWeight: '700' },
});

export default TransactionDetailScreen;
