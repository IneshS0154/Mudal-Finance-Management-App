import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import AmountInput from '../../components/AmountInput';
import InputField from '../../components/InputField';
import PillButton from '../../components/PillButton';
import useRecurringStore from '../../store/recurringStore';
import useAuthStore from '../../store/authStore';

const FREQUENCIES = ['daily', 'weekly', 'monthly', 'yearly'];

// ── Preset recurring categories (emoji-based, self-contained) ─────────────────
const RECURRING_CATEGORIES = [
  { _id: 'rc_01', name: 'Business Income', icon: '🏢', color: '#4CAF50', type: 'income' },
  { _id: 'rc_02', name: 'Salary',          icon: '💰', color: '#03A9F4', type: 'income' },
  { _id: 'rc_03', name: 'Housing',         icon: '🏠', color: '#FF9800', type: 'expense' },
  { _id: 'rc_04', name: 'Water Bills',     icon: '💧', color: '#2196F3', type: 'expense' },
  { _id: 'rc_05', name: 'Electricity',     icon: '⚡', color: '#FFC107', type: 'expense' },
  { _id: 'rc_06', name: 'Internet',        icon: '🌐', color: '#00BCD4', type: 'expense' },
  { _id: 'rc_07', name: 'Phone Bills',     icon: '📱', color: '#9C27B0', type: 'expense' },
  { _id: 'rc_08', name: 'Gym',             icon: '🏋️', color: '#E91E63', type: 'expense' },
  { _id: 'rc_09', name: 'Loan',            icon: '🏦', color: '#607D8B', type: 'expense' },
  { _id: 'rc_10', name: 'Insurance',       icon: '🛡️', color: '#8BC34A', type: 'expense' },
  { _id: 'rc_11', name: 'Subscriptions',   icon: '📺', color: '#FF5722', type: 'expense' },
];

const AddRecurringScreen = ({ navigation, route }) => {
  const edit = route?.params?.recurring;
  const { user } = useAuthStore();
  const { addRecurring, updateRecurring, deleteRecurring, isLoading } = useRecurringStore();
  const currency = user?.currency || 'LKR';

  const [type, setType] = useState(edit?.type || 'expense');
  const [title, setTitle] = useState(edit?.title || '');
  const [amount, setAmount] = useState(edit?.amount?.toString() || '');
  const [frequency, setFrequency] = useState(edit?.frequency || 'monthly');
  const [selectedCategory, setSelectedCategory] = useState(edit?.category || null);
  const [startDate, setStartDate] = useState(edit ? new Date(edit.startDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const isExpense = type === 'expense';

  const handleTypeChange = (newType) => {
    if (newType !== type) {
      setType(newType);
      setSelectedCategory(null); // clear category when switching type
    }
  };

  const filteredCategories = RECURRING_CATEGORIES.filter((c) => c.type === type);

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Missing Title', 'Enter a name'); return; }
    if (!amount || parseFloat(amount) <= 0) { Alert.alert('Invalid Amount', 'Enter a valid amount'); return; }
    if (!selectedCategory) { Alert.alert('No Category', 'Select a category'); return; }

    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      frequency,
      category: selectedCategory,
      startDate: startDate.toISOString(),
    };

    const result = edit
      ? await updateRecurring(edit._id, payload)
      : await addRecurring(payload);

    if (result.success) navigation.goBack();
    else Alert.alert('Error', result.error);
  };

  const handleDelete = () => {
    if (!edit) return;
    Alert.alert('Delete', 'Delete this recurring payment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => { await deleteRecurring(edit._id); navigation.goBack(); },
      },
    ]);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{edit ? 'Edit Recurring' : 'New Recurring'}</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* ── Expense / Income Toggle ───────────────────────── */}
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeBtn, isExpense && styles.typeBtnExpenseActive]}
            onPress={() => handleTypeChange('expense')}
            activeOpacity={0.85}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={18}
              color={isExpense ? colors.textOnDark : colors.danger}
            />
            <Text style={[styles.typeBtnText, isExpense && styles.typeBtnTextActive]}>Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeBtn, !isExpense && styles.typeBtnIncomeActive]}
            onPress={() => handleTypeChange('income')}
            activeOpacity={0.85}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={18}
              color={!isExpense ? colors.textOnDark : colors.success}
            />
            <Text style={[styles.typeBtnText, !isExpense && styles.typeBtnTextActive]}>Income</Text>
          </TouchableOpacity>
        </View>

        {/* ── Amount ───────────────────────────────────────── */}
        <AmountInput value={amount} onChangeText={setAmount} currency={currency} />

        {/* ── Form Card ────────────────────────────────────── */}
        <View style={styles.formCard}>
          <InputField
            label="Name"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Water bill, Netflix..."
          />

          <Text style={styles.fieldLabel}>Frequency</Text>
          <View style={styles.freqRow}>
            {FREQUENCIES.map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.freqChip, frequency === f && styles.freqChipActive]}
                onPress={() => setFrequency(f)}
              >
                <Text style={[styles.freqText, frequency === f && styles.freqTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.fieldLabel}>Start Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.dateText}>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="spinner"
              onChange={(e, d) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (d) setStartDate(d);
              }}
            />
          )}
        </View>

        {/* ── Category Grid ─────────────────────────────────── */}
        <View style={styles.catSection}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.catGrid}>
            {filteredCategories.map((cat) => {
              const sel = selectedCategory?._id === cat._id;
              return (
                <TouchableOpacity
                  key={cat._id}
                  style={[
                    styles.catItem,
                    { borderColor: sel ? cat.color : colors.borderLight },
                    sel && { backgroundColor: `${cat.color}15` },
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.75}
                >
                  {/* Colour dot in top-right corner when selected */}
                  {sel && <View style={[styles.selDot, { backgroundColor: cat.color }]} />}

                  {/* Emoji icon inside a tinted circle */}
                  <View style={[styles.emojiCircle, { backgroundColor: `${cat.color}20` }]}>
                    <Text style={styles.emojiText}>{cat.icon}</Text>
                  </View>

                  <Text
                    style={[styles.catText, sel && { color: cat.color, fontWeight: '600' }]}
                    numberOfLines={2}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Actions ───────────────────────────────────────── */}
        <View style={styles.actions}>
          <PillButton
            title={edit ? 'Update' : 'Create Recurring'}
            onPress={handleSave}
            loading={isLoading}
          />
          {edit && (
            <PillButton
              title="Delete"
              onPress={handleDelete}
              variant="danger"
              style={{ marginTop: 12 }}
              icon={<Ionicons name="trash-outline" size={18} color={colors.textOnDark} />}
            />
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight,
  },
  headerTitle: { ...typography.h3, color: colors.text },

  // ── Type Toggle ───────────────────────────────────────────────────────────
  typeToggle: {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 16,
    backgroundColor: colors.surface, borderRadius: 20, padding: 5,
    borderWidth: 1, borderColor: colors.borderLight,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 2,
  },
  typeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 15, gap: 7,
  },
  typeBtnExpenseActive: {
    backgroundColor: colors.danger,
    shadowColor: colors.danger, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 6, elevation: 5,
  },
  typeBtnIncomeActive: {
    backgroundColor: colors.success,
    shadowColor: colors.success, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 6, elevation: 5,
  },
  typeBtnText: { ...typography.smallMedium, color: colors.textSecondary },
  typeBtnTextActive: { color: colors.textOnDark, fontWeight: '700' },

  // ── Form Card ─────────────────────────────────────────────────────────────
  formCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 20,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1,
    shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: colors.borderLight,
  },
  fieldLabel: { ...typography.smallMedium, color: colors.text, marginBottom: 8 },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  freqChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceMuted,
  },
  freqChipActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  freqText: { ...typography.smallMedium, color: colors.text, textTransform: 'capitalize' },
  freqTextActive: { color: colors.textOnDark },
  dateButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark,
    borderRadius: 14, borderWidth: 1.5, borderColor: colors.borderLight,
    paddingHorizontal: 16, height: 52, marginBottom: 4, gap: 12,
  },
  dateText: { ...typography.body, color: colors.text },

  // ── Category Grid ─────────────────────────────────────────────────────────
  catSection: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: 14 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catItem: {
    width: '22%', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4,
    borderRadius: 16, backgroundColor: colors.surface, borderWidth: 2,
    borderColor: colors.borderLight, position: 'relative',
  },
  selDot: {
    position: 'absolute', top: 6, right: 6,
    width: 7, height: 7, borderRadius: 4,
  },
  emojiCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  emojiText: { fontSize: 20 },
  catText: {
    ...typography.caption, color: colors.textSecondary,
    textAlign: 'center', lineHeight: 14,
  },

  // ── Actions ───────────────────────────────────────────────────────────────
  actions: { paddingHorizontal: 20, marginTop: 28 },
});

export default AddRecurringScreen;
