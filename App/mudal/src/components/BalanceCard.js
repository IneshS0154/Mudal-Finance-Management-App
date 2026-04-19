import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import typography from '../constants/typography';
import { formatCurrency } from '../utils/formatCurrency';

const BalanceCard = ({ balance = 0, income = 0, expense = 0, currency = 'LKR', cardNumber = '9934', validThru = '05/28' }) => {
  const [hidden, setHidden] = useState(false);

  return (
    <View style={styles.outer}>
      {/* Main white account card */}
      <View style={styles.card}>
        {/* Card header */}
        <View style={styles.cardHeader}>
          <View style={styles.flagRow}>
            <View style={styles.flagDot} />
            <Text style={styles.currencyLabel}>{currency}</Text>
          </View>
          <Text style={styles.networkLabel}>MUDAL</Text>
        </View>

        {/* Balance */}
        <Text style={styles.balanceLabel}>Your balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceAmount}>
            {hidden ? '* * * * *' : formatCurrency(balance, currency)}
          </Text>
          <TouchableOpacity onPress={() => setHidden(!hidden)} style={styles.eyeBtn}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Card details row */}
        <View style={styles.detailsRow}>
          <View>
            <Text style={styles.detailLabel}>Account number</Text>
            <Text style={styles.detailValue}>**** {cardNumber}</Text>
          </View>
          <View style={styles.detailRight}>
            <Text style={styles.detailLabel}>Valid Thru</Text>
            <Text style={styles.detailValue}>{validThru}</Text>
          </View>
        </View>
      </View>

      {/* Income / Expense row below card */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: colors.success }]} />
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statValue}>{formatCurrency(income, currency)}</Text>
          </View>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: colors.danger }]} />
          <View>
            <Text style={styles.statLabel}>Expense</Text>
            <Text style={styles.statValue}>{formatCurrency(expense, currency)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 22,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  flagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  flagDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
  },
  currencyLabel: {
    ...typography.smallMedium,
    color: colors.text,
  },
  networkLabel: {
    ...typography.h4,
    color: colors.primaryDark,
    letterSpacing: 2,
  },
  balanceLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceAmount: {
    ...typography.amountLarge,
    color: colors.text,
    flex: 1,
  },
  eyeBtn: {
    padding: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 16,
  },
  detailRight: {
    alignItems: 'flex-end',
  },
  detailLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.smallMedium,
    color: colors.text,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.bodySemibold,
    color: colors.text,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: 8,
  },
});

export default BalanceCard;
