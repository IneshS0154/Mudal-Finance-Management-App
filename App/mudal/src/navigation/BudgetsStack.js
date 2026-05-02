import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { slideFromRight, slideFromBottom } from './transitions';
import BudgetsScreen from '../screens/budgets/BudgetsScreen';
import AddBudgetScreen from '../screens/budgets/AddBudgetScreen';
import RecurringScreen from '../screens/budgets/RecurringScreen';
import AddRecurringScreen from '../screens/budgets/AddRecurringScreen';
import RecurringDetailScreen from '../screens/budgets/RecurringDetailScreen';
import GoalsScreen from '../screens/budgets/GoalsScreen';
import AddGoalScreen from '../screens/budgets/AddGoalScreen';
import GoalDetailScreen from '../screens/budgets/GoalDetailScreen';

const Stack = createStackNavigator();

const BudgetsStack = () => {
  return (
    <Stack.Navigator screenOptions={slideFromRight}>
      <Stack.Screen name="BudgetsList" component={BudgetsScreen} />
      <Stack.Screen name="AddBudget" component={AddBudgetScreen} options={slideFromBottom} />
      <Stack.Screen name="Recurring" component={RecurringScreen} />
      <Stack.Screen name="RecurringDetail" component={RecurringDetailScreen} />
      <Stack.Screen name="AddRecurring" component={AddRecurringScreen} options={slideFromBottom} />
      <Stack.Screen name="Goals" component={GoalsScreen} />
      <Stack.Screen name="AddGoal" component={AddGoalScreen} options={slideFromBottom} />
      <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
    </Stack.Navigator>
  );
};

export default BudgetsStack;
