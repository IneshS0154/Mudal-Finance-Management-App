import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
  KeyboardAvoidingView, Platform, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import AmountInput from '../../components/AmountInput';
import InputField from '../../components/InputField';
import PillButton from '../../components/PillButton';
import useTransactionStore from '../../store/transactionStore';
import useAuthStore from '../../store/authStore';
import useCategoryStore from '../../store/categoryStore';
import useBudgetStore from '../../store/budgetStore';
import CategoryIcon from '../../components/CategoryIcon';



const AddTransactionScreen = ({ navigation, route }) => {
  const initialType = route?.params?.type || 'expense';
  const editTransaction = route?.params?.transaction;
  const { user } = useAuthStore();
  const { addTransaction, updateTransaction, isLoading } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { budgets, fetchBudgets } = useBudgetStore();
  const currency = user?.currency || 'LKR';

  const [type, setType] = useState(editTransaction?.type || initialType);
  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || '');
  const [title, setTitle] = useState(editTransaction?.title || '');
  const [selectedCategory, setSelectedCategory] = useState(editTransaction?.category || null);
  const [date, setDate] = useState(editTransaction ? new Date(editTransaction.date) : new Date());
  const [notes, setNotes] = useState(editTransaction?.notes || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Reset form when route params change (e.g., navigating from Home with different type)
  useEffect(() => {
    if (!editTransaction) {
      setType(route?.params?.type || 'expense');
      setAmount('');
      setTitle('');
      setSelectedCategory(null);
      setDate(new Date());
      setNotes('');
    } else {
      setType(editTransaction.type);
      setAmount(editTransaction.amount?.toString() || '');
      setTitle(editTransaction.title);
      setSelectedCategory(editTransaction.category);
      setDate(new Date(editTransaction.date));
      setNotes(editTransaction.notes || '');
    }
  }, [route.params]);

  // Fetch categories and budgets if not loaded
  useEffect(() => {
    if (categories.length === 0) fetchCategories();
    if (budgets.length === 0) fetchBudgets();
  }, []);

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleTypeChange = (newType) => {
    if (newType !== type) {
      setType(newType);
      setSelectedCategory(null);
    }
  };

  const handleSave = async (force = false) => {
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Invalid Amount', 'Enter a valid amount'); return; }
    if (!title.trim()) { Alert.alert('Missing Title', 'Enter a transaction title'); return; }
    if (!selectedCategory) { Alert.alert('No Category', 'Select a category'); return; }

    const numAmount = parseFloat(amount);

    // Budget Warning Check
    if (type === 'expense' && !force) {
      const budget = budgets.find(b => b.category?._id === selectedCategory._id);
      if (budget) {
        const projectedSpent = (budget.spent || 0) + numAmount;
        if (projectedSpent > budget.limit) {
          Alert.alert(
            '⚠️ Budget Exceeded',
            `This expense will put you over your ${budget.category.name} budget by ${(projectedSpent - budget.limit).toLocaleString()} ${currency}. Your budget is leaking!`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Add Anyway', style: 'destructive', onPress: () => handleSave(true) }
            ]
          );
          return;
        }
      }
    }

    const payload = {
      type,
      amount: numAmount,
      title: title.trim(),
      category: selectedCategory,
      date: date.toISOString(),
      notes: notes.trim(),
    };

    const result = editTransaction 
      ? await updateTransaction(editTransaction._id, payload) 
      : await addTransaction(payload);

    if (result.success) {
      // Refresh budgets to update spent amounts
      fetchBudgets();
      navigation.goBack();
    }
    else Alert.alert('Error', result.error);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{editTransaction ? 'Edit Activity' : 'Add Activity'}</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Type Toggle */}
          <View style={styles.typeToggle}>
            <TouchableOpacity 
              style={[styles.typeBtn, type === 'expense' && styles.typeBtnActiveExpense]} 
              onPress={() => handleTypeChange('expense')}
            >
              <Ionicons name="arrow-up-circle-outline" size={18} color={type === 'expense' ? colors.surface : colors.danger} />
              <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveIncome]} 
              onPress={() => handleTypeChange('income')}
            >
              <Ionicons name="arrow-down-circle-outline" size={18} color={type === 'income' ? colors.surface : colors.success} />
              <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>Income</Text>
            </TouchableOpacity>
          </View>

          <AmountInput value={amount} onChangeText={setAmount} currency={currency} />

          {/* Form Card */}
          <View style={styles.formCard}>
            <InputField label="Title" value={title} onChangeText={setTitle} placeholder="What was this for?" />
            
            <Text style={styles.fieldLabel}>Date</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker 
                value={date} 
                mode="date" 
                display="spinner" 
                onChange={(e, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setDate(d); }} 
              />
            )}
            
            <InputField label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional notes..." multiline numberOfLines={2} />
          </View>

          {/* Category Grid */}
          <View style={styles.catSection}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.catGrid}>
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategory?._id === cat._id;
                return (
                  <TouchableOpacity 
                    key={cat._id} 
                    style={[
                      styles.catItem, 
                      { borderColor: isSelected ? cat.color : colors.borderLight },
                      isSelected && { backgroundColor: `${cat.color}15` }
                    ]} 
                    onPress={() => setSelectedCategory(cat)} 
                  >
                    {isSelected && <View style={[styles.selDot, { backgroundColor: cat.color }]} />}
                    <View style={[styles.emojiCircle, { backgroundColor: `${cat.color}20` }]}>
                      <CategoryIcon iconKey={cat.icon} color={cat.color} size={32} iconSize={18} />
                    </View>
                    <Text style={[styles.catText, isSelected && { color: cat.color, fontWeight: '600' }]} numberOfLines={1}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.actions}>
            <PillButton title={editTransaction ? 'Update' : 'Save Activity'} onPress={handleSave} loading={isLoading} />
          </View>
          
          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  
  typeToggle: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: colors.surface, borderRadius: 20, padding: 5, marginTop: 8, borderWidth: 1, borderColor: colors.borderLight },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 15, gap: 7 },
  typeBtnActiveIncome: { backgroundColor: colors.success },
  typeBtnActiveExpense: { backgroundColor: colors.danger },
  typeBtnText: { ...typography.smallMedium, color: colors.textSecondary },
  typeBtnTextActive: { color: colors.surface, fontWeight: '700' },
  
  formCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 20,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  fieldLabel: { ...typography.smallMedium, color: colors.text, marginBottom: 8 },
  dateButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark, borderRadius: 14,
    borderWidth: 1.5, borderColor: colors.borderLight, paddingHorizontal: 16, height: 52, marginBottom: 16, gap: 12,
  },
  dateText: { ...typography.body, color: colors.text },
  
  catSection: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: 14 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catItem: {
    width: '22%', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4,
    borderRadius: 16, backgroundColor: colors.surface, borderWidth: 2,
    borderColor: colors.borderLight, position: 'relative',
  },
  selDot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4 },
  emojiCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emojiText: { fontSize: 20 },
  catText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', lineHeight: 14 },
  
  actions: { paddingHorizontal: 20, marginTop: 28 },
});

export default AddTransactionScreen;
