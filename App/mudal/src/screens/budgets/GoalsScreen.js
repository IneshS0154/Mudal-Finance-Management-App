import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import useThemeStore from '../../store/themeStore';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import GoalCard from '../../components/GoalCard';
import EmptyState from '../../components/EmptyState';
import PillButton from '../../components/PillButton';
import useGoalStore from '../../store/goalStore';
import useAuthStore from '../../store/authStore';

const GoalsScreen = ({ navigation }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  const { user } = useAuthStore();
  const { goals, fetchGoals, isLoading, deleteGoal } = useGoalStore();
  const currency = user?.currency || 'LKR';

  useEffect(() => {
    fetchGoals();
  }, []);

  const onRefresh = () => fetchGoals();

  const activeGoals = goals.filter(g => g.status !== 'completed');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Savings Goals</Text>
            <Text style={styles.headerSub}>Plan for your future</Text>
          </View>
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddGoal')}
          >
            <Ionicons name="add" size={26} color={colors.textOnDark} />
          </TouchableOpacity>
        </View>

        {goals.length > 0 ? (
          <>
            {activeGoals.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Active Goals</Text>
                {activeGoals.map(goal => (
                  <GoalCard 
                    key={goal._id} 
                    goal={goal} 
                    currency={currency}
                    onPress={() => navigation.navigate('AddGoal', { goal })}
                  />
                ))}
              </View>
            )}

            {completedGoals.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Completed</Text>
                {completedGoals.map(goal => (
                  <GoalCard 
                    key={goal._id} 
                    goal={goal} 
                    currency={currency}
                    onPress={() => navigation.navigate('AddGoal', { goal })}
                  />
                ))}
              </View>
            )}
          </>
        ) : (
          <EmptyState
            icon="medal-outline"
            title="No Goals Yet"
            subtitle="Set a goal to start saving for something special."
          >
            <PillButton 
              title="Create First Goal" 
              onPress={() => navigation.navigate('AddGoal')} 
              size="medium" 
            />
          </EmptyState>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const getStyles = (colors) => StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 12, paddingBottom: 24,
  },
  headerTitle: { ...typography.h1, color: colors.text },
  headerSub: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  addBtn: {
    width: 48, height: 48, borderRadius: 16, backgroundColor: colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { ...typography.h3, color: colors.primaryDark, marginBottom: 16 },
});

export default GoalsScreen;
