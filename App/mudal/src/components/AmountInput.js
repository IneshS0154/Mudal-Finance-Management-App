import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import typography from '../constants/typography';

const AmountInput = ({ value, onChangeText, currency = 'LKR' }) => {
  const symbol = { LKR: 'Rs.', USD: '$', EUR: '€', GBP: '£', INR: '₹' }[currency] || currency;

  return (
    <View style={styles.container}>
      <Text style={styles.symbol}>{symbol}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="0.00"
        placeholderTextColor={colors.textTertiary}
        keyboardType="decimal-pad"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 4,
  },
  symbol: {
    ...typography.amountLarge,
    color: colors.textSecondary,
    fontSize: 28,
  },
  input: {
    ...typography.amountLarge,
    color: colors.text,
    minWidth: 100,
    textAlign: 'left',
  },
});

export default AmountInput;
