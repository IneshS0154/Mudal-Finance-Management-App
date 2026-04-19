// ─── Typography using SF Pro (iOS system font) ───
// No fontFamily needed — React Native defaults to SF Pro on iOS.
// We control weight via fontWeight property.

const typography = {
  // ── Display / Hero ──
  hero: {
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  heroSmall: {
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.3,
    fontWeight: '700',
  },

  // ── Headings ──
  h1: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.2,
    fontWeight: '700',
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  h4: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },

  // ── Body ──
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  bodySemibold: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },

  // ── Small / Caption ──
  small: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
  },
  smallMedium: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500',
  },

  // ── Amounts ──
  amountLarge: {
    fontSize: 36,
    lineHeight: 42,
    letterSpacing: -0.5,
    fontWeight: '700',
  },
  amountMedium: {
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
    fontWeight: '700',
  },
  amountSmall: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },

  // ── Button ──
  button: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  buttonSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
};

export default typography;
