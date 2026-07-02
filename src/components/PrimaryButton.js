import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export default function PrimaryButton({ title, onPress, loading, disabled }) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
      ]}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 28,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pressed: {
    backgroundColor: colors.navySoft,
  },
  disabled: {
    opacity: 0.65,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
