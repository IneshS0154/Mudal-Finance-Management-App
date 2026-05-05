import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/themeStore';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import CategoryIcon from '../../components/CategoryIcon';
import EmptyState from '../../components/EmptyState';
import PillButton from '../../components/PillButton';
import useCategoryStore from '../../store/categoryStore';
import useRecurringStore from '../../store/recurringStore';
import RecurringItem from '../../components/RecurringItem';

const CategoriesScreen = ({ navigation }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const { categories, fetchCategories, deleteCategory } = useCategoryStore();
  const { recurringItems, fetchRecurring, deleteRecurring } = useRecurringStore();

  useEffect(() => { 
    fetchCategories(); 
    fetchRecurring();
  }, []);

  const expenseCategories = categories.filter((c) => c.type === 'expense');
  const incomeCategories = categories.filter((c) => c.type === 'income');

  const handleDelete = (cat) => {
    Alert.alert('Delete Category', `Delete "${cat.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(cat._id) },
    ]);
  };

  const renderGroup = (title, items) => (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupCard}>
        {items.map((cat, i) => (
          <View key={cat._id}>
            <View style={styles.catRow}>
              <CategoryIcon iconKey={cat.icon} color={cat.color} size={40} iconSize={18} />
              <Text style={styles.catName}>{cat.name}</Text>
              <TouchableOpacity onPress={() => handleDelete(cat)} style={styles.deleteBtn}><Ionicons name="trash-outline" size={18} color={colors.textSecondary} /></TouchableOpacity>
            </View>
            {i < items.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Categories</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddCategory')} style={styles.addBtn}><Ionicons name="add" size={22} color={colors.primaryDark} /></TouchableOpacity>
        </View>
        {categories.length > 0 ? (
          <>
            {expenseCategories.length > 0 && renderGroup('Expense Categories', expenseCategories)}
            {incomeCategories.length > 0 && renderGroup('Income Categories', incomeCategories)}

            {/* Recurring Section */}
            <View style={styles.group}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.groupTitle}>Recurring Payments</Text>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('AddRecurring')}
                  style={styles.addSmallBtn}
                >
                  <Ionicons name="add" size={20} color={colors.primaryDark} />
                </TouchableOpacity>
              </View>
              {recurringItems.length > 0 ? (
                recurringItems.map((item) => (
                  <RecurringItem 
                    key={item._id} 
                    item={item} 
                  />
                ))
              ) : (
                <View style={styles.emptyRecurring}>
                  <Text style={styles.emptyRecurringText}>No recurring payments set up yet.</Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <EmptyState icon="grid-outline" title="No Categories" subtitle="Add custom categories to organize your transactions">
            <PillButton title="Add Category" onPress={() => navigation.navigate('AddCategory')} size="medium" />
          </EmptyState>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const getStyles = (colors) => StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  group: { paddingHorizontal: 20, marginTop: 16 },
  groupTitle: { ...typography.h3, color: colors.primaryDark, marginBottom: 10 },
  groupCard: { backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: colors.borderLight },
  catRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  catName: { flex: 1, ...typography.bodyMedium, color: colors.text, marginLeft: 14 },
  deleteBtn: { padding: 8 },
  divider: { height: 1, backgroundColor: colors.borderLight },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  addSmallBtn: { 
    width: 32, height: 32, borderRadius: 10, 
    backgroundColor: colors.primaryMuted, 
    alignItems: 'center', justifyContent: 'center' 
  },
  emptyRecurring: {
    padding: 20, backgroundColor: colors.surface, 
    borderRadius: 16, borderStyle: 'dashed', 
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center'
  },
  emptyRecurringText: { ...typography.caption, color: colors.textTertiary },
});

export default CategoriesScreen;
