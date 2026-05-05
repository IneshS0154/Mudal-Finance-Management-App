import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, RefreshControl, StatusBar, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/themeStore';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import RecurringItem from '../../components/RecurringItem';
import EmptyState from '../../components/EmptyState';
import PillButton from '../../components/PillButton';
import useRecurringStore from '../../store/recurringStore';
import useAuthStore from '../../store/authStore';

const RecurringScreen = ({ navigation }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const { user } = useAuthStore();
  const { recurringItems, fetchRecurring, deleteRecurring, isLoading } = useRecurringStore();
  const [refreshing, setRefreshing] = useState(false);
  const currency = user?.currency || 'LKR';

  useEffect(() => { fetchRecurring(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRecurring();
    setRefreshing(false);
  }, []);



  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryDark} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recurring</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.list}>
          {recurringItems.length > 0 ? (
            recurringItems.map((item) => (
              <RecurringItem
                key={item._id}
                item={item}
                currency={currency}
                // Tap card → view-only detail screen
                onPress={() => navigation.navigate('RecurringDetail', { recurring: item })}
              />
            ))
          ) : (
            <EmptyState
              icon="repeat"
              title="No Recurring Transactions"
              subtitle="Set up automatic recurring payments like water, electricity, and internet bills"
            >
              <PillButton
                title="Add Recurring"
                onPress={() => navigation.navigate('AddRecurring')}
                size="medium"
              />
            </EmptyState>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {recurringItems.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddRecurring')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color={colors.textOnDark} />
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
};

const getStyles = (colors) => StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight,
  },
  headerTitle: { ...typography.h1, color: colors.text },
  list: { paddingHorizontal: 20 },
  fab: {
    position: 'absolute', bottom: 30, right: 20, width: 56, height: 56,
    borderRadius: 18, backgroundColor: colors.primaryDark, alignItems: 'center',
    justifyContent: 'center', shadowColor: colors.primaryDeep,
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
});

export default RecurringScreen;
