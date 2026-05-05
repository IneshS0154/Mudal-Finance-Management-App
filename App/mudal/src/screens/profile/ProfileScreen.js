import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  Switch,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import PillButton from '../../components/PillButton';
import useAuthStore from '../../store/authStore';
import useThemeStore from '../../store/themeStore';

const getMenuItems = (colors) => [
  { key: 'salary', icon: 'cash-outline', iconBg: colors.primaryMuted, iconColor: colors.primaryDark, label: 'Salary Settings', screen: 'SalarySettings' },
  { key: 'categories', icon: 'grid-outline', iconBg: colors.successLight, iconColor: colors.success, label: 'Categories', screen: 'Categories' },
  { key: 'edit', icon: 'person-outline', iconBg: colors.secondaryMuted || colors.backgroundDark, iconColor: colors.text, label: 'Edit Profile', screen: 'EditProfile' },
  { key: 'password', icon: 'lock-closed-outline', iconBg: colors.primaryLight, iconColor: colors.primary, label: 'Security & Password', screen: 'ChangePassword' },
];

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme, colors } = useThemeStore();
  const styles = getStyles(colors);
  const MENU_ITEMS = getMenuItems(colors);

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => logout() },
    ]);
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.themeSwitch}>
            <Ionicons name="sunny-outline" size={16} color={colors.textSecondary} style={{ marginRight: 4 }} />
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.borderLight, true: colors.primaryDark }}
              thumbColor={colors.surface}
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
            <Ionicons name="moon-outline" size={16} color={colors.textSecondary} style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              {user?.occupation ? (
                <Text style={styles.userOccupation}>{user.occupation}</Text>
              ) : (
                <Text style={styles.userSalary}>
                  Salary: {user?.currency || 'LKR'} {user?.monthlySalary?.toLocaleString() || '0'}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.editPill}
              onPress={() => navigation.navigate('EditProfile')}
              activeOpacity={0.7}
            >
              <Text style={styles.editPillText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <View key={item.key}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.screen)}
                activeOpacity={0.7}
              >
                <View style={[styles.menuIconCircle, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
              </TouchableOpacity>
              {index < MENU_ITEMS.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.menuCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: colors.dangerLight }]}>
              <Ionicons name="log-out-outline" size={20} color={colors.danger} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.danger }]}>Logout</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const getStyles = (colors) => StyleSheet.create({
  scrollContent: { paddingBottom: 20 },
  header: { 
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 20, 
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
  },
  headerTitle: { ...typography.h2, color: colors.text },
  themeSwitch: {
    position: 'absolute',
    right: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22, padding: 20,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16, elevation: 3,
    borderWidth: 1, borderColor: colors.borderLight, marginBottom: 28,
  },
  profileRow: {
    flexDirection: 'row', alignItems: 'center',
  },
  avatarCircle: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primaryDark,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { ...typography.h3, color: colors.textOnDark, fontSize: 18 },
  profileInfo: { flex: 1, marginLeft: 14 },
  userName: { ...typography.h4, color: colors.text },
  userOccupation: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  userSalary: { ...typography.small, color: colors.primaryDark, marginTop: 2, fontWeight: '600' },
  userEmail: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  editPill: {
    backgroundColor: colors.backgroundDark, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: colors.border,
  },
  editPillText: { ...typography.smallMedium, color: colors.text },
  sectionTitle: {
    ...typography.h3, color: colors.primaryDark, paddingHorizontal: 24, marginBottom: 12,
  },
  menuCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 20, paddingVertical: 4,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 2,
    borderWidth: 1, borderColor: colors.borderLight, marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18,
  },
  menuIconCircle: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  menuLabel: { flex: 1, ...typography.bodyMedium, color: colors.text },
  menuDivider: { height: 1, backgroundColor: colors.borderLight, marginLeft: 72 },
});

export default ProfileScreen;
