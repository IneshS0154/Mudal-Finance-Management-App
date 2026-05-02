import { TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import { Easing } from 'react-native';

// ── Smooth slide from right (for push screens) ──
export const slideFromRight = {
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 250,
        easing: Easing.in(Easing.poly(4)),
      },
    },
  },
};

// ── Slide up from bottom (for modals like AddTransaction) ──
export const slideFromBottom = {
  headerShown: false,
  gestureEnabled: true,
  gestureDirection: 'vertical',
  cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 350,
        easing: Easing.out(Easing.poly(5)),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 280,
        easing: Easing.in(Easing.poly(5)),
      },
    },
  },
};

// ── Fade transition (for auth screens) ──
export const fadeTransition = {
  headerShown: false,
  cardStyleInterpolator: ({ current }) => ({
    cardStyle: {
      opacity: current.progress,
    },
  }),
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 400,
        easing: Easing.out(Easing.poly(4)),
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 300,
        easing: Easing.in(Easing.poly(4)),
      },
    },
  },
};
