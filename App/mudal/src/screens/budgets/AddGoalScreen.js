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
import useGoalStore from '../../store/goalStore';
import useAuthStore from '../../store/authStore';

const AddGoalScreen = ({ navigation, route }) => {
  const edit = route?.params?.goal;
  const { user } = useAuthStore();
  const { addGoal, updateGoal, isLoading } = useGoalStore();
  const currency = user?.currency || 'LKR';
  const [name, setName] = useState(edit?.name || '');
  const [targetAmount, setTargetAmount] = useState(edit?.targetAmount?.toString() || '');
  const [monthlyContribution, setMonthlyContribution] = useState(edit?.monthlyContribution?.toString() || '');
  const [deadline, setDeadline] = useState(edit ? new Date(edit.deadline) : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Missing Name', 'Enter a goal name'); return; }
    if (!targetAmount || parseFloat(targetAmount) <= 0) { Alert.alert('Invalid Target', 'Enter a valid target amount'); return; }
    const payload = { name: name.trim(), targetAmount: parseFloat(targetAmount), monthlyContribution: parseFloat(monthlyContribution) || 0, deadline: deadline.toISOString() };
    const result = edit ? await updateGoal(edit._id, payload) : await addGoal(payload);
    if (result.success) navigation.goBack(); else Alert.alert('Error', result.error);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>{edit ? 'Edit Goal' : 'New Goal'}</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.formCard}>
          <InputField label="Goal Name" value={name} onChangeText={setName} placeholder="e.g. MacBook Pro, Emergency Fund..." />
          <Text style={styles.fieldLabel}>Target Amount</Text>
          <AmountInput value={targetAmount} onChangeText={setTargetAmount} currency={currency} />
          <Text style={styles.fieldLabel}>Monthly Contribution</Text>
          <AmountInput value={monthlyContribution} onChangeText={setMonthlyContribution} currency={currency} />
          <Text style={styles.fieldLabel}>Deadline</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            <Text style={styles.dateText}>{deadline.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && <DateTimePicker value={deadline} mode="date" display="spinner" minimumDate={new Date()} onChange={(e, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setDeadline(d); }} />}
          <PillButton title={edit ? 'Update Goal' : 'Create Goal'} onPress={handleSave} loading={isLoading} style={{ marginTop: 8 }} />
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
  fieldLabel: { ...typography.smallMedium, color: colors.text, marginBottom: 4 },
  dateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundDark, borderRadius: 14, borderWidth: 1.5, borderColor: colors.borderLight, paddingHorizontal: 16, height: 52, marginBottom: 16, gap: 12 },
  dateText: { ...typography.body, color: colors.text },
});

export default AddGoalScreen;
