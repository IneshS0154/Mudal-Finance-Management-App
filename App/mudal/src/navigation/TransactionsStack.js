import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { slideFromRight, slideFromBottom } from './transitions';
import TransactionsListScreen from '../screens/transactions/TransactionsListScreen';
import AddTransactionScreen from '../screens/transactions/AddTransactionScreen';
import TransactionDetailScreen from '../screens/transactions/TransactionDetailScreen';

const Stack = createStackNavigator();

const TransactionsStack = () => {
  return (
    <Stack.Navigator screenOptions={slideFromRight}>
      <Stack.Screen name="TransactionsList" component={TransactionsListScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} options={slideFromBottom} />
      <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
    </Stack.Navigator>
  );
};

export default TransactionsStack;
