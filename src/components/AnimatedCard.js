import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors, shadow } from '../theme';

export default function AnimatedCard({ children, style, onPress, disabled }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, disabled && styles.disabled]}>
      <Pressable
        disabled={disabled || !onPress}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.97, { damping: 14, stiffness: 260 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 260 });
        }}
        style={[styles.card, style]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    ...shadow,
  },
  disabled: {
    opacity: 0.7,
  },
});
