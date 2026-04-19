import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import PillButton from '../../components/PillButton';
import useAuthStore from '../../store/authStore';

const CURRENCIES = ['LKR', 'USD', 'EUR', 'GBP', 'INR'];

const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile, isLoading } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [currency, setCurrency] = useState(user?.currency || 'LKR');

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Invalid', 'Name cannot be empty'); return; }
    const result = await updateProfile({ name: name.trim(), currency });
    if (result.success) navigation.goBack(); else Alert.alert('Error', result.error);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.formCard}>
          <InputField label="Full Name" value={name} onChangeText={setName} autoCapitalize="words" />
          <Text style={styles.fieldLabel}>Preferred Currency</Text>
          <View style={styles.currencyRow}>
            {CURRENCIES.map((cur) => (
              <TouchableOpacity key={cur} style={[styles.currencyChip, currency === cur && styles.currencyChipActive]} onPress={() => setCurrency(cur)}>
                <Text style={[styles.currencyText, currency === cur && styles.currencyTextActive]}>{cur}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <PillButton title="Save Changes" onPress={handleSave} loading={isLoading} style={{ marginTop: 8 }} />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight },
  headerTitle: { ...typography.h3, color: colors.text },
  formCard: { backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 22, marginTop: 8, shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: colors.borderLight },
  fieldLabel: { ...typography.smallMedium, color: colors.text, marginBottom: 8 },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  currencyChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceMuted },
  currencyChipActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  currencyText: { ...typography.smallMedium, color: colors.text },
  currencyTextActive: { color: colors.textOnDark },
});

export default EditProfileScreen;
