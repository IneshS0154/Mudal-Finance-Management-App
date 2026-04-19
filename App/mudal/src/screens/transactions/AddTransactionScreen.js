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
import CategoryIcon from '../../components/CategoryIcon';
import useTransactionStore from '../../store/transactionStore';
import useCategoryStore from '../../store/categoryStore';
import useAuthStore from '../../store/authStore';

const AddTransactionScreen = ({ navigation, route }) => {
  const initialType = route?.params?.type || 'expense';
  const editTransaction = route?.params?.transaction;
  const { user } = useAuthStore();
  const { addTransaction, updateTransaction, isLoading } = useTransactionStore();
  const { categories, fetchCategories } = useCategoryStore();
  const currency = user?.currency || 'LKR';

  const [type, setType] = useState(editTransaction?.type || initialType);
  const [amount, setAmount] = useState(editTransaction?.amount?.toString() || '');
  const [title, setTitle] = useState(editTransaction?.title || '');
  const [selectedCategory, setSelectedCategory] = useState(editTransaction?.category || null);
  const [date, setDate] = useState(editTransaction ? new Date(editTransaction.date) : new Date());
  const [notes, setNotes] = useState(editTransaction?.notes || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => { fetchCategories(); }, []);
  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSave = async () => {
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Invalid Amount', 'Please enter a valid amount'); return; }
    if (!title.trim()) { Alert.alert('Missing Title', 'Please enter a transaction title'); return; }
    if (!selectedCategory) { Alert.alert('No Category', 'Please select a category'); return; }

    const payload = { type, amount: parseFloat(amount), title: title.trim(), category: selectedCategory._id || selectedCategory, date: date.toISOString(), notes: notes.trim() };
    const result = editTransaction ? await updateTransaction(editTransaction._id, payload) : await addTransaction(payload);
    if (result.success) navigation.goBack();
    else Alert.alert('Error', result.error);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{editTransaction ? 'Edit Transaction' : 'Add Transaction'}</Text>
            <View style={{ width: 44 }} />
          </View>

          {/* Type Toggle */}
          <View style={styles.typeToggle}>
            <TouchableOpacity style={[styles.typeBtn, type === 'income' && styles.typeBtnActiveIncome]} onPress={() => setType('income')}>
              <Ionicons name="arrow-down" size={16} color={type === 'income' ? colors.surface : colors.success} />
              <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>Income</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.typeBtn, type === 'expense' && styles.typeBtnActiveExpense]} onPress={() => setType('expense')}>
              <Ionicons name="arrow-up" size={16} color={type === 'expense' ? colors.surface : colors.danger} />
              <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>Expense</Text>
            </TouchableOpacity>
          </View>

          <AmountInput value={amount} onChangeText={setAmount} currency={currency} />

          <View style={styles.formCard}>
            <InputField label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Uber ride, Grocery shopping..." />
            <Text style={styles.fieldLabel}>Date</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.dateText}>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker value={date} mode="date" display="spinner" onChange={(e, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setDate(d); }} />
            )}
            <InputField label="Notes (optional)" value={notes} onChangeText={setNotes} placeholder="Add a note..." multiline numberOfLines={3} />
          </View>

          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Select Category</Text>
            <View style={styles.categoryGrid}>
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategory?._id === cat._id || selectedCategory?.name === cat.name;
                return (
                  <TouchableOpacity key={cat._id || cat.name} style={[styles.catItem, isSelected && styles.catItemActive]} onPress={() => setSelectedCategory(cat)} activeOpacity={0.7}>
                    <CategoryIcon iconKey={cat.icon} color={cat.color} size={36} iconSize={18} />
                    <Text style={[styles.catText, isSelected && styles.catTextActive]} numberOfLines={1}>{cat.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {filteredCategories.length === 0 && <Text style={styles.noCat}>No {type} categories yet</Text>}
          </View>

          <View style={styles.saveSection}>
            <PillButton title={editTransaction ? 'Update' : 'Save Transaction'} onPress={handleSave} loading={isLoading} />
          </View>
          <View style={{ height: 40 }} />
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
  typeToggle: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: colors.surface, borderRadius: 16, padding: 4, marginTop: 8, borderWidth: 1, borderColor: colors.borderLight },
  typeBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 6 },
  typeBtnActiveIncome: { backgroundColor: colors.success },
  typeBtnActiveExpense: { backgroundColor: colors.danger },
  typeBtnText: { ...typography.bodySemibold, color: colors.textSecondary },
  typeBtnTextActive: { color: colors.surface },
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
  categorySection: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: 14 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catItem: {
    width: '22%', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4,
    borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderLight,
  },
  catItemActive: { borderColor: colors.primaryDark, backgroundColor: colors.primaryMuted },
  catText: { ...typography.caption, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
  catTextActive: { color: colors.primaryDark },
  noCat: { ...typography.small, color: colors.textSecondary, textAlign: 'center', marginTop: 16 },
  saveSection: { paddingHorizontal: 20, marginTop: 28 },
});

export default AddTransactionScreen;
