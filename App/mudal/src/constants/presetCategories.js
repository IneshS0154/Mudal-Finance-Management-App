import colors from './colors';

const presetCategories = [
  // Expense categories
  { name: 'Food', icon: 'food', color: '#FF6B6B', type: 'expense' },
  { name: 'Travel', icon: 'travel', color: '#4ECDC4', type: 'expense' },
  { name: 'Shopping', icon: 'shopping', color: '#FFE66D', type: 'expense' },
  { name: 'Entertainment', icon: 'entertainment', color: '#A66CFF', type: 'expense' },
  { name: 'Healthcare', icon: 'healthcare', color: '#49B6FF', type: 'expense' },
  { name: 'Education', icon: 'education', color: '#FF9F43', type: 'expense' },
  { name: 'Utilities', icon: 'utilities', color: '#54A0FF', type: 'expense' },
  { name: 'Rent', icon: 'rent', color: '#5F27CD', type: 'expense' },
  { name: 'Groceries', icon: 'groceries', color: '#10AC84', type: 'expense' },
  { name: 'Transport', icon: 'transport', color: '#01A3A4', type: 'expense' },
  { name: 'Clothing', icon: 'clothing', color: '#EE5A24', type: 'expense' },
  { name: 'Subscriptions', icon: 'subscriptions', color: '#6C5CE7', type: 'expense' },

  // Income categories
  { name: 'Salary', icon: 'salary', color: colors.success, type: 'income' },
  { name: 'Freelance', icon: 'freelance', color: '#00B894', type: 'income' },
  { name: 'Bonus', icon: 'bonus', color: '#FDCB6E', type: 'income' },
  { name: 'Refund', icon: 'refund', color: '#81ECEC', type: 'income' },
  { name: 'Interest', icon: 'interest', color: '#74B9FF', type: 'income' },
  { name: 'Other', icon: 'other', color: '#B2BEC3', type: 'income' },
];

export default presetCategories;
