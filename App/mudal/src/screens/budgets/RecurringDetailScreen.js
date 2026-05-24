import React from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert, StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import ScreenWrapper from '../../components/ScreenWrapper';
import useRecurringStore from '../../store/recurringStore';
import useAuthStore from '../../store/authStore';
import { formatCurrency } from '../../utils/formatCurrency';
import CategoryIcon from '../../components/CategoryIcon';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { categoryIcons } from '../../constants/icons';

const FREQ_ICONS = {
  daily: 'today-outline',
  weekly: 'calendar-outline',
  monthly: 'calendar-number-outline',
  yearly: 'calendar-clear-outline',
};

const RecurringDetailScreen = ({ navigation, route }) => {
  const item = route.params.recurring;
  const { user } = useAuthStore();
  const { deleteRecurring, isLoading } = useRecurringStore();
  const currency = user?.currency || 'LKR';

  const cat = item.category || {};
  const isIncome = item.type === 'income';
  const catColor = cat.color || (isIncome ? colors.success : colors.danger);

  const dueDate = new Date(item.nextDueDate);
  const startDate = new Date(item.startDate);
  const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const dueLabel =
    daysUntil <= 0 ? 'Due today' : daysUntil === 1 ? 'Due tomorrow' : `Due in ${daysUntil} days`;

  const handleDelete = () => {
    Alert.alert('Delete Recurring', `Delete "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteRecurring(item._id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleEdit = () => {
    navigation.navigate('AddRecurring', { recurring: item });
  };

  return (
    <ScreenWrapper backgroundColor={colors.background}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* ── Header ────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          {/* Edit icon in header */}
          <TouchableOpacity onPress={handleEdit} style={styles.editBtn}>
            <Ionicons name="pencil" size={18} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          {/* Hero Icon */}
          {cat.icon ? (
            <CategoryIcon iconKey={cat.icon} color={catColor} size={72} iconSize={36} />
          ) : (
            <View style={[styles.heroIcon, { backgroundColor: `${catColor}20` }]}>
              <Ionicons name="repeat" size={32} color={catColor} />
            </View>
          )}

          <Text style={styles.heroTitle}>{item.title}</Text>
          <Text style={[styles.heroAmount, isIncome ? styles.amountIncome : styles.amountExpense]}>
            {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
          </Text>

          {/* Type badge */}
          <View style={[styles.typeBadge, isIncome ? styles.typeBadgeIncome : styles.typeBadgeExpense]}>
            <Ionicons
              name={isIncome ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'}
              size={13}
              color={isIncome ? colors.success : colors.danger}
            />
            <Text style={[styles.typeBadgeText, isIncome ? styles.typeBadgeTextIncome : styles.typeBadgeTextExpense]}>
              {isIncome ? 'Income' : 'Expense'}
            </Text>
          </View>
        </View>

        {/* ── Info Rows ─────────────────────────────────── */}
        <View style={styles.infoCard}>

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: `${catColor}15` }]}>
              {cat.icon ? (
                <MaterialCommunityIcons name={categoryIcons[cat.icon] || 'help-circle-outline'} size={20} color={catColor} />
              ) : (
                <Text style={{ fontSize: 16 }}>🔄</Text>
              )}
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>{cat.name || 'Uncategorized'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name={FREQ_ICONS[item.frequency] || 'calendar-outline'} size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Frequency</Text>
              <Text style={[styles.infoValue, { textTransform: 'capitalize' }]}>{item.frequency}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="time-outline" size={18} color={colors.warning} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Next Due</Text>
              <Text style={styles.infoValue}>{dueDate.toLocaleDateString()}</Text>
              <Text style={[styles.infoSub, daysUntil <= 3 && { color: colors.warning }]}>{dueLabel}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: colors.successLight }]}>
              <Ionicons name="play-circle-outline" size={18} color={colors.success} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Start Date</Text>
              <Text style={styles.infoValue}>{startDate.toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.infoIcon, { backgroundColor: item.isActive ? colors.successLight : colors.dangerLight }]}>
              <Ionicons
                name={item.isActive ? 'checkmark-circle-outline' : 'pause-circle-outline'}
                size={18}
                color={item.isActive ? colors.success : colors.danger}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={[styles.infoValue, { color: item.isActive ? colors.success : colors.danger }]}>
                {item.isActive ? 'Active' : 'Paused'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Action Buttons ────────────────────────────── */}
        <View style={styles.actions}>
          {/* Edit button */}
          <TouchableOpacity style={styles.editButton} onPress={handleEdit} activeOpacity={0.85}>
            <Ionicons name="pencil-outline" size={20} color={colors.textOnDark} />
            <Text style={styles.editButtonText}>Edit Recurring</Text>
          </TouchableOpacity>

          {/* Delete button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.85}>
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderLight,
  },
  headerTitle: { ...typography.h3, color: colors.text },
  editBtn: {
    width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primaryMuted,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Hero card ─────────────────────────────────────────────────────────────
  heroCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 24,
    padding: 28, alignItems: 'center', marginTop: 8, marginBottom: 16,
    borderWidth: 1, borderColor: colors.borderLight,
    shadowColor: colors.shadowMedium, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1, shadowRadius: 16, elevation: 3,
  },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  heroEmoji: { fontSize: 36 },
  heroTitle: { ...typography.h2, color: colors.text, marginBottom: 8, textAlign: 'center' },
  heroAmount: { fontSize: 32, fontWeight: '700', marginBottom: 12, letterSpacing: -0.5 },
  amountIncome: { color: colors.success },
  amountExpense: { color: colors.danger },
  typeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
  },
  typeBadgeExpense: { backgroundColor: colors.dangerLight },
  typeBadgeIncome: { backgroundColor: colors.successLight },
  typeBadgeText: { ...typography.smallMedium, fontWeight: '600' },
  typeBadgeTextExpense: { color: colors.danger },
  typeBadgeTextIncome: { color: colors.success },

  // ── Info card ─────────────────────────────────────────────────────────────
  infoCard: {
    backgroundColor: colors.surface, marginHorizontal: 20, borderRadius: 22,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.borderLight,
    shadowColor: colors.shadow, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1, shadowRadius: 12, elevation: 2,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, gap: 14,
  },
  infoIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { ...typography.caption, color: colors.textSecondary, marginBottom: 2 },
  infoValue: { ...typography.bodyMedium, color: colors.text },
  infoSub: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.borderLight, marginLeft: 74 },

  // ── Actions ───────────────────────────────────────────────────────────────
  actions: { paddingHorizontal: 20, marginTop: 20, gap: 12 },
  editButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primaryDark, borderRadius: 18,
    paddingVertical: 16, gap: 10,
    shadowColor: colors.primaryDeep, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 10, elevation: 4,
  },
  editButtonText: { ...typography.bodyMedium, color: colors.textOnDark, fontWeight: '700' },
  deleteButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.dangerLight, borderRadius: 18,
    paddingVertical: 16, gap: 10,
    borderWidth: 1.5, borderColor: colors.danger,
  },
  deleteButtonText: { ...typography.bodyMedium, color: colors.danger, fontWeight: '700' },
});

export default RecurringDetailScreen;
