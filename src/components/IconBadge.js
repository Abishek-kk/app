import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function IconBadge({ icon, muted = false }) {
  return (
    <View style={[styles.badge, muted && styles.muted]}>
      <Text style={styles.icon}>{icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muted: {
    backgroundColor: '#D9DCEB',
  },
  icon: {
    color: colors.white,
    fontSize: 23,
    fontWeight: '900',
  },
});
