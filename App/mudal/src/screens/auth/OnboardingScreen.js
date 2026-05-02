import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import typography from '../../constants/typography';
import PillButton from '../../components/PillButton';

const { width: W, height: H } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <MaterialCommunityIcons name="finance" size={20} color={colors.primaryDark} />
          </View>
          <Text style={styles.logoText}>Mudal</Text>
        </View>
      </View>

      {/* Floating card stack */}
      <View style={styles.cardArea}>
        {/* Background card (tilted) */}
        <View style={[styles.floatingCard, styles.cardBack]}>
          <View style={styles.cardBadge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>LKR</Text>
          </View>
          <Text style={styles.cardLabel}>Your balance</Text>
          <Text style={styles.cardAmount}>Rs. 40,500.80</Text>
          <View style={styles.cardDetailsRow}>
            <View>
              <Text style={styles.cardDetailLabel}>Account number</Text>
              <Text style={styles.cardDetailVal}>**** 9934</Text>
            </View>
            <View style={styles.cardDetailRight}>
              <Text style={styles.cardDetailLabel}>Valid Thru</Text>
              <Text style={styles.cardDetailVal}>05/28</Text>
            </View>
          </View>
        </View>

        {/* Front card */}
        <View style={[styles.floatingCard, styles.cardFront]}>
          <View style={styles.cardBadge}>
            <View style={[styles.badgeDot, { backgroundColor: colors.primary }]} />
            <Text style={styles.badgeText}>USD</Text>
          </View>
          <Text style={styles.cardLabel}>Your balance</Text>
          <View style={styles.frontBalanceRow}>
            <Text style={styles.cardAmountLarge}>$40,500.80</Text>
            <View style={styles.eyeCircle}>
              <Ionicons name="eye-outline" size={16} color={colors.textSecondary} />
            </View>
          </View>
          <View style={styles.cardDetailsRow}>
            <View>
              <Text style={styles.cardDetailLabel}>Account number</Text>
              <Text style={styles.cardDetailVal}>**** 9934</Text>
            </View>
            <View style={styles.cardDetailRight}>
              <Text style={styles.cardDetailLabel}>Valid Thru</Text>
              <Text style={styles.cardDetailVal}>05/28</Text>
            </View>
          </View>
        </View>

        {/* Floating action pill */}
        <View style={styles.actionPill}>
          <Ionicons name="arrow-up" size={14} color={colors.text} />
          <Text style={styles.actionPillText}>Request</Text>
        </View>

        {/* Add button */}
        <View style={styles.addCircle}>
          <Ionicons name="add" size={22} color={colors.textOnDark} />
        </View>
      </View>

      {/* Bottom section */}
      <View style={styles.bottomSection}>
        <Text style={styles.headline}>
          Good{'\n'}finances,{'\n'}better life.
        </Text>
        <Text style={styles.subtitle}>
          Invest in projects that make a difference. Join us in supporting impactful initiatives and track your financial journey.
        </Text>

        <PillButton
          title="Get Started"
          onPress={() => navigation.navigate('Register')}
          variant="accent"
          style={styles.ctaButton}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.7}
        >
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    ...typography.h2,
    color: colors.primaryDeep,
  },
  cardArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    position: 'relative',
  },
  floatingCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    shadowColor: 'rgba(0,0,0,0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  cardBack: {
    position: 'absolute',
    top: 10,
    left: 14,
    right: 50,
    transform: [{ rotate: '-6deg' }],
    opacity: 0.6,
  },
  cardFront: {
    position: 'absolute',
    top: 30,
    left: 34,
    right: 10,
    transform: [{ rotate: '2deg' }],
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundDark,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    gap: 5,
    marginBottom: 14,
  },
  badgeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryDark,
  },
  badgeText: {
    ...typography.caption,
    color: colors.text,
  },
  cardLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  cardAmount: {
    ...typography.amountMedium,
    color: colors.text,
    marginBottom: 16,
  },
  cardAmountLarge: {
    ...typography.amountLarge,
    fontSize: 28,
    color: colors.text,
    flex: 1,
  },
  frontBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 12,
  },
  cardDetailRight: {
    alignItems: 'flex-end',
  },
  cardDetailLabel: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  cardDetailVal: {
    ...typography.smallMedium,
    color: colors.text,
    marginTop: 2,
  },
  actionPill: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  actionPillText: {
    ...typography.smallMedium,
    color: colors.text,
  },
  addCircle: {
    position: 'absolute',
    top: 35,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  bottomSection: {
    paddingHorizontal: 28,
    paddingBottom: 44,
  },
  headline: {
    ...typography.hero,
    color: colors.primaryDeep,
    marginBottom: 12,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(26, 52, 9, 0.6)',
    lineHeight: 22,
    marginBottom: 24,
  },
  ctaButton: {
    marginBottom: 16,
  },
  loginText: {
    ...typography.body,
    color: 'rgba(26, 52, 9, 0.55)',
    textAlign: 'center',
  },
  loginLink: {
    ...typography.bodySemibold,
    color: colors.primaryDeep,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;
