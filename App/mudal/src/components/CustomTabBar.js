import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import colors from '../constants/colors';
import typography from '../constants/typography';

const TABS = [
  { key: 'HomeTab', icon: 'home-outline', iconActive: 'home', label: 'Home' },
  { key: 'AnalyticsTab', icon: 'stats-chart-outline', iconActive: 'stats-chart', label: 'Statistic' },
  { key: 'TransactionsTab', label: 'Activity', isCenter: true },
  { key: 'BudgetsTab', icon: 'wallet-outline', iconActive: 'wallet', label: 'Budget' },
  { key: 'ProfileTab', icon: 'person-outline', iconActive: 'person', label: 'Profile' },
];

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const activeIndex = state.index;

  const txRoute = state.routes[2];
  const txSubRoute = getFocusedRouteNameFromRoute(txRoute) || 'TransactionsList';
  const isOnTransactionsList = activeIndex === 2 && txSubRoute === 'TransactionsList';

  return (
    <View style={styles.wrapper}>
      {/* Outer shadow is applied to wrapper so it isn't clipped by overflow: hidden */}
      <View style={styles.shadowContainer}>
        {/* Glass bar container */}
        <View style={styles.glassContainer}>
          {/* Real blur layer - high intensity for thick liquid glass */}
          <BlurView
            intensity={100}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          {/* Specular highlights and refraction overlay */}
          <View style={styles.liquidRefraction} />

          {/* Tab items on top */}
          <View style={styles.tabRow}>
            {TABS.map((tab, index) => {
              const isActive = activeIndex === index;

              const onPress = () => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes[index].key,
                  canPreventDefault: true,
                });
                if (!event.defaultPrevented) {
                  if (tab.isCenter) {
                    if (isOnTransactionsList) {
                      navigation.navigate('TransactionsTab', { screen: 'AddTransaction' });
                    } else {
                      navigation.navigate('TransactionsTab', { screen: 'TransactionsList' });
                    }
                  } else {
                    navigation.navigate(state.routes[index].name);
                  }
                }
              };

              if (tab.isCenter) {
                // Render a spacer inside the glass flow so the other tabs align correctly
                return (
                  <View key={tab.key} style={styles.centerSpacer} />
                );
              }

              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={onPress}
                  activeOpacity={0.7}
                  style={styles.tab}
                >
                  <Ionicons
                    name={isActive ? tab.iconActive : tab.icon}
                    size={22}
                    color={isActive ? colors.primaryDark : colors.textTertiary}
                  />
                  <Text style={[styles.label, isActive && styles.labelActive]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Floating Center Button rendered outside overflow:hidden container */}
        <View style={styles.absoluteCenterContainer} pointerEvents="box-none">
          {(() => {
            const centerIndex = 2;
            const centerTab = TABS[centerIndex];
            const isActive = activeIndex === centerIndex;
            const centerIcon = isOnTransactionsList ? 'add' : 'swap-horizontal';
            
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: state.routes[centerIndex].key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) {
                if (isOnTransactionsList) {
                  navigation.navigate('TransactionsTab', { screen: 'AddTransaction' });
                } else {
                  navigation.navigate('TransactionsTab', { screen: 'TransactionsList' });
                }
              }
            };

            return (
              <TouchableOpacity
                key={centerTab.key}
                onPress={onPress}
                activeOpacity={0.85}
                style={styles.centerBtn}
              >
                <View style={styles.centerDropShadow}>
                  <View style={[styles.centerCircle, isActive && styles.centerCircleActive]}>
                    <BlurView 
                      intensity={isActive ? 0 : 80} 
                      tint="light" 
                      style={StyleSheet.absoluteFill} 
                    />
                    <View style={[styles.centerLiquid, isActive && styles.centerLiquidActive]} />
                    <Ionicons
                      name={centerIcon}
                      size={26}
                      color={isActive ? '#FFFFFF' : colors.primaryDark}
                      style={{ zIndex: 2 }}
                    />
                  </View>
                </View>
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {isOnTransactionsList ? 'Add' : 'Activity'}
                </Text>
              </TouchableOpacity>
            );
          })()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 20,
    right: 20,
    paddingBottom: 4,
  },
  shadowContainer: {
    // Deep liquid shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  glassContainer: {
    borderRadius: 36, // Maximum pill shape for a fluid drop look
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Very transparent base
    // Outer border for tension surface
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  liquidRefraction: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    // 3D specular highlight and bottom shadow for viscosity
    borderTopWidth: 2.5,
    borderTopColor: 'rgba(255, 255, 255, 0.95)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.6)',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 36,
  },
  tabRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  centerSpacer: {
    flex: 1,
  },
  absoluteCenterContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textTertiary,
    marginTop: 4,
  },
  labelActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  centerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -42, // Popped out to sit perfectly above the glass bar
  },
  centerDropShadow: {
    shadowColor: 'rgba(168, 232, 71, 0.6)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 10,
  },
  centerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30, // Perfect circle drop
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  centerCircleActive: {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: colors.primaryDark,
  },
  centerLiquid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(168, 232, 71, 0.15)',
    // Inner liquid glow and reflection
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 30,
    zIndex: 1,
  },
  centerLiquidActive: {
    backgroundColor: 'transparent',
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default CustomTabBar;
