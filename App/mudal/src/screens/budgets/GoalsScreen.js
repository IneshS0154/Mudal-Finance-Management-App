import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import GoalCard from '../../components/GoalCard';
import EmptyState from '../../components/EmptyState';
import PillButton from '../../components/PillButton';
import useGoalStore from '../../store/goalStore';
import useAuthStore from '../../store/authStore';

const GoalsScreen = ({ navigation }) => {
  const { user } = useAuthStore();
  const { goals, fetchGoals, isLoading } = useGoalStore();
  const [refreshing, setRefreshing] = useState(false);
  const currency = user?.currency || 'LKR';

  useEffect(() => { fetchGoals(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchGoals();
    setRefreshing(false);
  }, []);

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primaryDark} />}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Savings Goals</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.list}>
          {goals.length > 0 ? (
            goals.map((goal) => (
              <GoalCard
                key={goal._id}
                goal={goal}
                currency={currency}
                onPress={() => navigation.navigate('GoalDetail', { goal })}
              />
            ))
          ) : (
            <EmptyState
              icon="flag-outline"
              title="No Goals Yet"
              subtitle="Set savings goals to track your progress toward financial milestones"
            >
              <PillButton
                title="Create Goal"
                onPress={() => navigation.navigate('AddGoal')}
                size="medium"
              />
            </EmptyState>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {goals.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddGoal')}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={28} color={colors.textOnDark} />
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16,
  },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h1, color: colors.text },
  list: { paddingHorizontal: 20 },
  fab: {
    position: 'absolute', bottom: 30, right: 20, width: 56, height: 56, borderRadius: 18,
    backgroundColor: colors.primaryDark, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primaryDeep, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8,
  },
});

export default GoalsScreen;
