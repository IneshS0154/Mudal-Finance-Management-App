import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import PillButton from '../../components/PillButton';
import useGoalStore from '../../store/goalStore';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';

const RING_SIZE = 160;
const STROKE_WIDTH = 12;

const GoalDetailScreen = ({ navigation, route }) => {
  const goal = route.params.goal;
  const { user } = useAuthStore();
  const { contribute, deleteGoal, isLoading } = useGoalStore();
  const currency = user?.currency || 'LKR';
  const [contributionAmount, setContributionAmount] = useState('');
  const progress = goal.targetAmount > 0 ? Math.min(goal.savedAmount / goal.targetAmount, 1) : 0;
  const percentage = Math.round(progress * 100);
  const daysLeft = Math.max(0, Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)));
  const radius = (RING_SIZE - STROKE_WIDTH) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const handleContribute = async () => {
    const amt = parseFloat(contributionAmount);
    if (!amt || amt <= 0) { Alert.alert('Invalid Amount'); return; }
    const result = await contribute(goal._id, amt);
    if (result.success) { setContributionAmount(''); navigation.goBack(); }
    else Alert.alert('Error', result.error);
  };

  const handleDelete = () => {
    Alert.alert('Delete Goal', 'Delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteGoal(goal._id); navigation.goBack(); } },
    ]);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>{goal.name}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddGoal', { goal })} style={styles.editBtn}><Ionicons name="pencil" size={18} color={colors.primaryDark} /></TouchableOpacity>
        </View>

        {/* Progress Ring */}
        <View style={styles.ringCard}>
          <View style={styles.ringContainer}>
            <Svg width={RING_SIZE} height={RING_SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
              <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={radius} stroke={colors.backgroundDark} strokeWidth={STROKE_WIDTH} fill="none" />
              <Circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={radius} stroke={colors.primary} strokeWidth={STROKE_WIDTH} fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
            </Svg>
            <View style={styles.ringTextWrap}>
              <Text style={styles.ringPercent}>{percentage}%</Text>
              <Text style={styles.ringLabel}>saved</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statDot, { backgroundColor: colors.success }]} />
            <Text style={styles.statLabel}>Saved</Text>
            <Text style={styles.statValue}>{formatCurrency(goal.savedAmount, currency)}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statDot, { backgroundColor: colors.primaryDark }]} />
            <Text style={styles.statLabel}>Target</Text>
            <Text style={styles.statValue}>{formatCurrency(goal.targetAmount, currency)}</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statDot, { backgroundColor: colors.warning }]} />
            <Text style={styles.statLabel}>Days left</Text>
            <Text style={styles.statValue}>{daysLeft}</Text>
          </View>
        </View>

        {/* Contribute */}
        <View style={styles.contributeCard}>
          <Text style={styles.contributeTitle}>Add Contribution</Text>
          <InputField value={contributionAmount} onChangeText={setContributionAmount} placeholder="Enter amount" keyboardType="decimal-pad" />
          <PillButton title="Add to Savings" onPress={handleContribute} loading={isLoading} />
        </View>

        <View style={styles.deleteSection}>
          <PillButton title="Delete Goal" onPress={handleDelete} variant="danger" icon={<Ionicons name="trash-outline" size={18} color={colors.textOnDark} />} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  editBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryMuted, alignItems: 'center', justifyContent: 'center' },
  ringCard: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 30, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: colors.borderLight, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2 },
  ringContainer: { alignItems: 'center', justifyContent: 'center' },
  ringTextWrap: { position: 'absolute', alignItems: 'center' },
  ringPercent: { ...typography.amountLarge, color: colors.text },
  ringLabel: { ...typography.caption, color: colors.textSecondary, marginTop: -2 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 16 },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: colors.borderLight },
  statDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  statValue: { ...typography.h4, color: colors.text, marginTop: 4 },
  contributeCard: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 20, marginTop: 20, borderWidth: 1, borderColor: colors.borderLight, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2 },
  contributeTitle: { ...typography.h3, color: colors.text, marginBottom: 16 },
  deleteSection: { paddingHorizontal: 20, marginTop: 20 },
});

export default GoalDetailScreen;
