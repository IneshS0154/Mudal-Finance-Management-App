import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import InputField from '../../components/InputField';
import PillButton from '../../components/PillButton';
import useAuthStore from '../../store/authStore';

const CURRENCIES = ['LKR', 'USD', 'EUR', 'GBP', 'INR'];

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('LKR');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }
    const result = await register({ name: name.trim(), email: email.trim(), password, currency });
    if (!result.success) {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerSection}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your financial journey with Mudal</Text>
          </View>

          <View style={styles.formCard}>
            <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Jonathan" autoCapitalize="words" />
            <InputField label="Email" value={email} onChangeText={setEmail} placeholder="user@mail.com" keyboardType="email-address" autoCapitalize="none" />
            <InputField label="Password" value={password} onChangeText={setPassword} placeholder="At least 6 characters" secureTextEntry />

            <Text style={styles.currencyLabel}>Currency</Text>
            <View style={styles.currencyRow}>
              {CURRENCIES.map((cur) => (
                <TouchableOpacity
                  key={cur}
                  style={[styles.currencyChip, currency === cur && styles.currencyChipActive]}
                  onPress={() => setCurrency(cur)}
                >
                  <Text style={[styles.currencyText, currency === cur && styles.currencyTextActive]}>{cur}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <PillButton title="Create Account" onPress={handleRegister} loading={isLoading} style={{ marginTop: 12 }} />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Login')} activeOpacity={0.7} style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink}>Sign In</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  backBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginTop: 8, borderWidth: 1, borderColor: colors.borderLight },
  headerSection: { marginTop: 24, marginBottom: 28 },
  title: { ...typography.h1, color: colors.text, marginBottom: 6 },
  subtitle: { ...typography.body, color: colors.textSecondary },
  formCard: {
    backgroundColor: colors.surface, borderRadius: 22, padding: 22,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16, elevation: 3,
    borderWidth: 1, borderColor: colors.borderLight,
  },
  currencyLabel: { ...typography.smallMedium, color: colors.text, marginBottom: 8, marginTop: 4 },
  currencyRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  currencyChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.surfaceMuted,
  },
  currencyChipActive: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  currencyText: { ...typography.smallMedium, color: colors.text },
  currencyTextActive: { color: colors.textOnDark },
  footer: { alignItems: 'center', marginTop: 24 },
  footerText: { ...typography.body, color: colors.textSecondary },
  footerLink: { color: colors.primaryDark, textDecorationLine: 'underline' },
});

export default RegisterScreen;
