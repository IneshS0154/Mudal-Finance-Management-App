// ─── Mudal Design Tokens ───
// Inspired by "Finans" ui-kit — warm cream background,
// green accent, soft layered cards

const colors = {
  // ── Brand greens (kept from original) ──
  primary: '#A8E847',
  primaryDark: '#2D5016',
  primaryDeep: '#1A3409',
  primaryMuted: 'rgba(168, 232, 71, 0.15)',
  primaryLight: 'rgba(168, 232, 71, 0.08)',

  // ── Warm backgrounds (Finans-inspired) ──
  background: '#FAF8F5',         // warm cream
  backgroundDark: '#F2EFE9',     // slightly darker cream
  backgroundCard: '#F5F2EC',     // card inner tint
  surface: '#FFFFFF',            // white cards
  surfaceMuted: '#F8F6F2',       // muted white

  // ── Text ──
  text: '#1A1A1A',
  textSecondary: '#8E8E93',
  textTertiary: '#BFBFBF',
  textOnDark: '#FFFFFF',
  textOnPrimary: '#1A3409',

  // ── Borders ──
  border: '#E8E5DF',
  borderLight: '#F0EDE7',

  // ── Status ──
  success: '#34C759',
  successLight: '#EDFBF0',
  danger: '#FF3B30',
  dangerLight: '#FFF0EF',
  warning: '#FF9F0A',
  warningLight: '#FFF8EC',

  // ── Shadows ──
  shadow: 'rgba(0,0,0,0.05)',
  shadowMedium: 'rgba(0,0,0,0.08)',
  shadowHeavy: 'rgba(0,0,0,0.12)',

  // ── Accent (for highlights, badges) ──
  accent: '#FFD60A',            // warm yellow like Finans CTA
  accentLight: '#FFF9DB',
};

export default colors;
