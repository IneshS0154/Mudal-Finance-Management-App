import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import AmountInput from '../../components/AmountInput';
import CategoryIcon from '../../components/CategoryIcon';
import PillButton from '../../components/PillButton';
import useBudgetStore from '../../store/budgetStore';
import useCategoryStore from '../../store/categoryStore';
import useAuthStore from '../../store/authStore';

const AddBudgetScreen = ({ navigation, route }) => {
  const editBudget = route?.params?.budget;
  const { user } = useAuthStore();
  const { addBudget, updateBudget, deleteBudget, isLoading } = useBudgetStore();
  const { categories, fetchCategories } = useCategoryStore();
  const currency = user?.currency || 'LKR';
  const [selectedCategory, setSelectedCategory] = useState(editBudget?.category || null);
  const [limit, setLimit] = useState(editBudget?.limit?.toString() || '');

  useEffect(() => { fetchCategories(); }, []);
  const expenseCategories = categories.filter((c) => c.type === 'expense');

  const handleSave = async () => {
    if (!limit || parseFloat(limit) <= 0) { Alert.alert('Invalid Amount', 'Enter a valid budget limit'); return; }
    if (!selectedCategory) { Alert.alert('No Category', 'Select a category'); return; }
    const payload = { category: selectedCategory._id, limit: parseFloat(limit), month: new Date().toISOString() };
    const result = editBudget ? await updateBudget(editBudget._id, payload) : await addBudget(payload);
    if (result.success) navigation.goBack(); else Alert.alert('Error', result.error);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>{editBudget ? 'Edit Budget' : 'New Budget'}</Text>
          <View style={{ width: 44 }} />
        </View>
        <Text style={styles.sectionTitle}>Budget Limit</Text>
        <AmountInput value={limit} onChangeText={setLimit} currency={currency} />
        <Text style={styles.sectionTitle}>Select Category</Text>
        <View style={styles.catGrid}>
          {expenseCategories.map((cat) => {
            const sel = selectedCategory?._id === cat._id;
            return (
              <TouchableOpacity key={cat._id} style={[styles.catItem, sel && styles.catItemActive]} onPress={() => setSelectedCategory(cat)}>
                <CategoryIcon iconKey={cat.icon} color={cat.color} size={36} iconSize={18} />
                <Text style={[styles.catText, sel && styles.catTextActive]} numberOfLines={1}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
          <PillButton title={editBudget ? 'Update Budget' : 'Create Budget'} onPress={handleSave} loading={isLoading} />
          {editBudget && (
            <PillButton
              title="Delete Budget"
              onPress={() => {
                Alert.alert('Delete Budget', 'Delete this budget?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: async () => { await deleteBudget(editBudget._id); navigation.goBack(); } },
                ]);
              }}
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  sectionTitle: { ...typography.h3, color: colors.text, paddingHorizontal: 20, marginTop: 20, marginBottom: 12 },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10 },
  catItem: { width: '22%', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.borderLight },
  catItemActive: { borderColor: colors.primaryDark, backgroundColor: colors.primaryMuted },
  catText: { ...typography.caption, color: colors.textSecondary, marginTop: 6, textAlign: 'center' },
  catTextActive: { color: colors.primaryDark },
});

export default AddBudgetScreen;
