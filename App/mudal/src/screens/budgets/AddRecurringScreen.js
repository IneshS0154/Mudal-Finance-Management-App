import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import AmountInput from '../../components/AmountInput';
import InputField from '../../components/InputField';
import CategoryIcon from '../../components/CategoryIcon';
import PillButton from '../../components/PillButton';
import useRecurringStore from '../../store/recurringStore';
import useCategoryStore from '../../store/categoryStore';
import useAuthStore from '../../store/authStore';

const FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'];

const AddRecurringScreen = ({ navigation, route }) => {
  const edit = route?.params?.recurring;
  const { user } = useAuthStore();
  const { addRecurring, updateRecurring, deleteRecurring, isLoading } = useRecurringStore();
  const { categories, fetchCategories } = useCategoryStore();
  const currency = user?.currency || 'LKR';
  const [title, setTitle] = useState(edit?.title || '');
  const [amount, setAmount] = useState(edit?.amount?.toString() || '');
  const [frequency, setFrequency] = useState(edit?.frequency || 'monthly');
  const [selectedCategory, setSelectedCategory] = useState(edit?.category || null);
  const [startDate, setStartDate] = useState(edit ? new Date(edit.startDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => { fetchCategories(); }, []);
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Missing Title', 'Enter a name'); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Invalid Amount', 'Enter a valid amount'); return; }
    if (!selectedCategory) { Alert.alert('No Category', 'Select a category'); return; }
    const payload = { title: title.trim(), amount: parseFloat(amount), frequency, category: selectedCategory._id, startDate: startDate.toISOString() };
    const result = edit ? await updateRecurring(edit._id, payload) : await addRecurring(payload);
    if (result.success) navigation.goBack(); else Alert.alert('Error', result.error);
  };

  const handleDelete = () => {
    if (!edit) return;
    Alert.alert('Delete', 'Delete this recurring payment?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteRecurring(edit._id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>{edit ? 'Edit Recurring' : 'New Recurring'}</Text>
          <View style={{ width: 44 }} />
        </View>
        <AmountInput value={amount} onChangeText={setAmount} currency={currency} />
        <View style={styles.formCard}>
          <InputField label="Name" value={title} onChangeText={setTitle} placeholder="e.g. Water bill, Netflix..." />
          <Text style={styles.fieldLabel}>Frequency</Text>
          <View style={styles.freqRow}>
            {FREQUENCIES.map((f) => (
              <TouchableOpacity key={f} style={[styles.freqChip, frequency === f && styles.freqChipActive]} onPress={() => setFrequency(f)}>
                <Text style={[styles.freqText, frequency === f && styles.freqTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.fieldLabel}>Start Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && <DateTimePicker value={startDate} mode="date" display="spinner" onChange={(e, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setStartDate(d); }} />}
        </View>
        <View style={styles.catSection}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.catGrid}>
            {expenseCategories.map((cat) => {
              const sel = selectedCategory?._id === cat._id;
              return (<TouchableOpacity key={cat._id} style={[styles.catItem, sel && styles.catItemActive]} onPress={() => setSelectedCategory(cat)}>
                <CategoryIcon iconKey={cat.icon} color={cat.color} size={36} iconSize={18} />
                <Text style={[styles.catText, sel && styles.catTextActive]} numberOfLines={1}>{cat.name}</Text>
              </TouchableOpacity>);
            })}
          </View>
        </View>
        <View style={styles.actions}>
          <PillButton title={edit ? 'Update' : 'Create Recurring'} onPress={handleSave} loading={isLoading} />
          {edit && <PillButton title="Delete" onPress={handleDelete} variant="danger" style={{ marginTop: 12 }} icon={<Ionicons name="trash-outline" size={18} color={colors.textOnDark} />} />}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  formCard: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 20, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: colors.borderLight },
  fieldLabel: { ...typography.smallMedium, color: colors.text, marginBottom: 8 },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  freqChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceMuted },
  freqChipActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  freqText: { ...typography.smallMedium, color: colors.text, textTransform: 'capitalize' },
  freqTextActive: { color: colors.textOnDark },
  dateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark, borderRadius: 14, borderWidth: 1.5, borderColor: colors.borderLight, paddingHorizontal: 16, height: 52, marginBottom: 16, gap: 12 },
  dateText: { ...typography.body, color: colors.text },
  catSection: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: 14 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catItem: { width: '22%', alignItems: 'center', paddingVertical: 12, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderLight },
  catItemActive: { borderColor: colors.primaryDark, backgroundColor: colors.primaryMuted },
  catText: { ...typography.caption, color: colors.textSecondary, marginTop: 6 },
  catTextActive: { color: colors.primaryDark },
  actions: { paddingHorizontal: 20, marginTop: 28 },
});

export default AddRecurringScreen;
