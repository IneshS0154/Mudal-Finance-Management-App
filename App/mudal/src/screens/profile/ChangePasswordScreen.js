import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import PillButton from '../../components/PillButton';
import useAuthStore from '../../store/authStore';

const ChangePasswordScreen = ({ navigation }) => {
  const { changePassword, isLoading } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = async () => {
    if (!currentPassword || !newPassword) { Alert.alert('Missing Fields', 'Fill in all fields'); return; }
    if (newPassword.length < 6) { Alert.alert('Weak Password', 'At least 6 characters'); return; }
    if (newPassword !== confirmPassword) { Alert.alert('Mismatch', 'Passwords do not match'); return; }
    const result = await changePassword({ currentPassword, newPassword });
    if (result.success) { Alert.alert('Success', 'Password changed'); navigation.goBack(); }
    else Alert.alert('Error', result.error);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="chevron-back" size={24} color={colors.text} /></TouchableOpacity>
          <Text style={styles.headerTitle}>Security</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.formCard}>
          <InputField label="Current Password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry placeholder="Enter current password" />
          <InputField label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="At least 6 characters" />
          <InputField label="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Confirm new password" />
          <PillButton title="Update Password" onPress={handleSave} loading={isLoading} style={{ marginTop: 8 }} />
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
});

export default ChangePasswordScreen;
