import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import PillButton from '../../components/PillButton';
import useGoalStore from '../../store/goalStore';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';

const AddGoalScreen = ({ navigation, route }) => {
  const edit = route?.params?.goal;
  const { user } = useAuthStore();
  const { addGoal, updateGoal, deleteGoal, isLoading } = useGoalStore();
  const currency = user?.currency || 'LKR';

  const [title, setTitle] = useState(edit?.title || '');
  const [target, setTarget] = useState(edit?.targetAmount?.toString() || '');
  const [duration, setDuration] = useState(edit?.durationMonths?.toString() || '12');

  const monthlyDeduction = (parseFloat(target) || 0) / (parseInt(duration) || 1);

  const handleSave = async () => {
    if (!title.trim()) { Alert.alert('Missing Title', 'Give your goal a name'); return; }
    if (!target || parseFloat(target) <= 0) { Alert.alert('Invalid Amount', 'Set a target amount'); return; }
    if (!duration || parseInt(duration) <= 0) { Alert.alert('Invalid Duration', 'Set duration in months'); return; }

    const payload = {
      title: title.trim(),
      targetAmount: parseFloat(target),
      durationMonths: parseInt(duration),
    };

    const res = edit 
      ? await updateGoal(edit._id, payload)
      : await addGoal(payload);

    if (res.success) navigation.goBack();
    else Alert.alert('Error', res.error);
  };

  const handleDelete = () => {
    Alert.alert('Delete Goal', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteGoal(edit._id);
        navigation.goBack();
      }},
    ]);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{edit ? 'Edit Goal' : 'New Goal'}</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.formCard}>
          <InputField label="What are you saving for?" value={title} onChangeText={setTitle} placeholder="e.g. MacBook Pro, Vacation..." />
          
          <View style={styles.row}>
            <View style={{ flex: 1.2 }}>
              <InputField label="Target Amount" value={target} onChangeText={setTarget} keyboardType="numeric" placeholder="0.00" />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <InputField label="Months" value={duration} onChangeText={setDuration} keyboardType="numeric" placeholder="12" />
            </View>
          </View>

          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Monthly Contribution</Text>
            <Text style={styles.summaryValue}>{formatCurrency(monthlyDeduction, currency)}</Text>
            <Text style={styles.summaryNote}>This amount will be deducted automatically from your salary each month.</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <PillButton title={edit ? 'Update Goal' : 'Create Goal'} onPress={handleSave} loading={isLoading} />
          {edit && (
            <PillButton 
              title="Remove Goal" 
              onPress={handleDelete} 
              variant="danger" 
              style={{ marginTop: 12 }} 
              icon={<Ionicons name="trash-outline" size={18} color={colors.white} />}
            />
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  formCard: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 24, padding: 24, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16, elevation: 3, borderWidth: 1, borderColor: colors.borderLight },
  row: { flexDirection: 'row', alignItems: 'flex-end' },
  summaryBox: { backgroundColor: colors.primaryMuted, borderRadius: 16, padding: 20, marginTop: 24, alignItems: 'center' },
  summaryLabel: { ...typography.caption, color: colors.primaryDark, textTransform: 'uppercase', letterSpacing: 1 },
  summaryValue: { ...typography.h2, color: colors.primaryDark, marginTop: 4 },
  summaryNote: { ...typography.caption, color: colors.textSecondary, textAlign: 'center', marginTop: 12, lineHeight: 16 },
  actions: { paddingHorizontal: 20, marginTop: 32 },
});

export default AddGoalScreen;
