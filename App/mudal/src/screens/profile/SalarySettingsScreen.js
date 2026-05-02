import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import PillButton from '../../components/PillButton';
import useAuthStore from '../../store/authStore';

const DAYS = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

const SalarySettingsScreen = ({ navigation }) => {
  const { user, updateProfile, isLoading } = useAuthStore();
  
  const [salary, setSalary] = useState(user?.monthlySalary?.toString() || '0');
  const [autoAdd, setAutoAdd] = useState(user?.salarySettings?.autoAdd || false);
  const [payday, setPayday] = useState(user?.salarySettings?.payday?.toString() || '1');

  const handleSave = async () => {
    const result = await updateProfile({
      monthlySalary: parseFloat(salary) || 0,
      salarySettings: {
        autoAdd,
        payday: parseInt(payday),
      }
    });
    if (result.success) {
      Alert.alert('Success', 'Salary settings updated');
      navigation.goBack();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Salary Settings</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Salary</Text>
          <Text style={styles.cardSub}>Set your base income for each month</Text>
          
          <InputField
            label="Salary Amount"
            value={salary}
            onChangeText={setSalary}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>Auto-add Income</Text>
              <Text style={styles.cardSub}>Automatically add salary as a transaction</Text>
            </View>
            <Switch
              value={autoAdd}
              onValueChange={setAutoAdd}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor={colors.surface}
            />
          </View>

          {autoAdd && (
            <View style={styles.paydaySection}>
              <Text style={styles.fieldLabel}>Payday (Day of Month)</Text>
              <View style={styles.paydayGrid}>
                {DAYS.map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[styles.dayChip, payday === d && styles.dayChipActive]}
                    onPress={() => setPayday(d)}
                  >
                    <Text style={[styles.dayText, payday === d && styles.dayTextActive]}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 10, marginBottom: 20 }}>
          <PillButton title="Save Settings" onPress={handleSave} loading={isLoading} />
        </View>

        {/* Extra spacer for the floating tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  card: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 22, marginBottom: 16, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: colors.borderLight },
  cardTitle: { ...typography.h4, color: colors.text },
  cardSub: { ...typography.small, color: colors.textSecondary, marginTop: 2, marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  fieldLabel: { ...typography.smallMedium, color: colors.text, marginBottom: 12 },
  paydaySection: { marginTop: 16, borderTopWidth: 1, borderTopColor: colors.borderLight, paddingTop: 16 },
  paydayGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dayChip: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.backgroundDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
  dayChipActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  dayText: { ...typography.smallMedium, color: colors.text },
  dayTextActive: { color: colors.textOnDark },
});

export default SalarySettingsScreen;
