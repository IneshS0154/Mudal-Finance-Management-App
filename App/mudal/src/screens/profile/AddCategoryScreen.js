import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import CategoryIcon from '../../components/CategoryIcon';
import PillButton from '../../components/PillButton';
import useCategoryStore from '../../store/categoryStore';
import useRecurringStore from '../../store/recurringStore';
import AmountInput from '../../components/AmountInput';
import { categoryIcons } from '../../constants/icons';

const COLORS_PALETTE = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A66CFF', '#49B6FF', '#54A0FF', '#5F27CD', '#10AC84', '#01A3A4', '#6C5CE7', '#34C759', '#00B894', '#FDCB6E', '#81ECEC', '#E17055', '#636E72'];
const ICON_KEYS = Object.keys(categoryIcons);

const AddCategoryScreen = ({ navigation }) => {
  const { addCategory, isLoading: catLoading } = useCategoryStore();
  const { addRecurring, isLoading: recLoading } = useRecurringStore();
  const [name, setName] = useState('');
  const [type, setType] = useState('expense');
  const [selectedColor, setSelectedColor] = useState(COLORS_PALETTE[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICON_KEYS[0]);

  // Recurring fields
  const [isRecurring, setIsRecurring] = useState(false);
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');

  const isLoading = catLoading || recLoading;

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Missing Name', 'Enter a category name'); return; }
    
    if (isRecurring) {
      if (!amount || parseFloat(amount) <= 0) {
        Alert.alert('Invalid Amount', 'Enter a valid amount for recurring payment');
        return;
      }
    }

    const catResult = await addCategory({ 
      name: name.trim(), 
      type, 
      color: selectedColor, 
      icon: selectedIcon 
    });

    if (catResult.success) {
      if (isRecurring) {
        // Also create a recurring payment
        const recResult = await addRecurring({
          title: name.trim(),
          amount: parseFloat(amount),
          type,
          frequency,
          category: { name: name.trim(), icon: selectedIcon, color: selectedColor, _id: catResult.data?._id },
          startDate: new Date().toISOString(),
        });
        
        if (!recResult.success) {
          Alert.alert('Category Created', `Category added but recurring payment failed: ${recResult.error}`);
        }
      }
      navigation.goBack(); 
    } else {
      Alert.alert('Error', catResult.error);
    }
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>New Category</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Live Preview */}
        <View style={styles.previewCard}>
          <CategoryIcon iconKey={selectedIcon} color={selectedColor} size={56} iconSize={26} />
          <Text style={styles.previewName}>{name || 'Category Name'}</Text>
          <Text style={styles.previewType}>{type}</Text>
        </View>

        <View style={styles.formCard}>
          <InputField label="Name" value={name} onChangeText={setName} placeholder="e.g. Groceries, Salary..." />
          <Text style={styles.fieldLabel}>Type</Text>
          <View style={styles.typeToggle}>
            <TouchableOpacity style={[styles.typeBtn, type === 'expense' && styles.typeBtnActive]} onPress={() => setType('expense')}>
              <Text style={[styles.typeBtnText, type === 'expense' && styles.typeBtnTextActive]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.typeBtn, type === 'income' && styles.typeBtnActive]} onPress={() => setType('income')}>
              <Text style={[styles.typeBtnText, type === 'income' && styles.typeBtnTextActive]}>Income</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Recurring Toggle ─────────────────────────────── */}
        <View style={styles.formCard}>
          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.fieldLabel}>Recurring Payment</Text>
              <Text style={styles.fieldSubtitle}>Automatically add transactions</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setIsRecurring(!isRecurring)}
              style={[styles.toggleSwitch, isRecurring && styles.toggleSwitchActive]}
            >
              <View style={[styles.toggleThumb, isRecurring && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          {isRecurring && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.fieldLabel}>Amount</Text>
              <AmountInput value={amount} onChangeText={setAmount} />
              
              <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Frequency</Text>
              <View style={styles.freqRow}>
                {['daily', 'weekly', 'monthly', 'yearly'].map((f) => (
                  <TouchableOpacity
                    key={f}
                    style={[styles.freqChip, frequency === f && styles.freqChipActive]}
                    onPress={() => setFrequency(f)}
                  >
                    <Text style={[styles.freqText, frequency === f && styles.freqTextActive]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.colorGrid}>
            {COLORS_PALETTE.map((c) => (
              <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }, selectedColor === c && styles.colorDotActive]} onPress={() => setSelectedColor(c)} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Icon</Text>
          <View style={styles.iconGrid}>
            {ICON_KEYS.map((k) => (
              <TouchableOpacity key={k} style={[styles.iconItem, selectedIcon === k && styles.iconItemActive]} onPress={() => setSelectedIcon(k)}>
                <CategoryIcon iconKey={k} color={selectedIcon === k ? selectedColor : colors.textSecondary} size={32} iconSize={18} bgColor={selectedIcon === k ? colors.primaryMuted : colors.backgroundDark} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <PillButton title="Create Category" onPress={handleSave} loading={isLoading} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  previewCard: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 28, alignItems: 'center', marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: colors.borderLight },
  previewName: { ...typography.h2, color: colors.text, marginTop: 12 },
  previewType: { ...typography.small, color: colors.textSecondary, textTransform: 'capitalize', marginTop: 4 },
  formCard: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 20, marginBottom: 20, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: colors.borderLight },
  fieldLabel: { ...typography.smallMedium, color: colors.text, marginBottom: 8 },
  typeToggle: { flexDirection: 'row', backgroundColor: colors.backgroundDark, borderRadius: 12, padding: 3 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  typeBtnActive: { backgroundColor: colors.primaryDark },
  typeBtnText: { ...typography.smallMedium, color: colors.textSecondary },
  typeBtnTextActive: { color: colors.textOnDark },
  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { ...typography.h3, color: colors.text, marginBottom: 12 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  colorDotActive: { borderWidth: 3, borderColor: colors.text },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  iconItem: { padding: 6, borderRadius: 12 },
  iconItemActive: { backgroundColor: colors.primaryMuted },
  
  // Toggle
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fieldSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: -4 },
  toggleSwitch: { width: 48, height: 26, borderRadius: 13, backgroundColor: colors.border, padding: 3 },
  toggleSwitchActive: { backgroundColor: colors.success },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: colors.white },
  toggleThumbActive: { transform: [{ translateX: 22 }] },
  
  // Frequency
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  freqChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.backgroundDark, borderWidth: 1, borderColor: colors.borderLight },
  freqChipActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  freqText: { ...typography.caption, color: colors.textSecondary, textTransform: 'capitalize' },
  freqTextActive: { color: colors.textOnDark, fontWeight: '600' },
});

export default AddCategoryScreen;
