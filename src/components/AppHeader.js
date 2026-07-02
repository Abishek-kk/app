import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme';

export default function AppHeader({ title, navigation, home = false }) {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <View style={[styles.header, home && styles.homeHeader]}>
        {!home && (
          <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'<'}</Text>
          </Pressable>
        )}
        {home ? (
          <View>
            <Text style={styles.welcome}>Welcome !</Text>
            <Text style={styles.homeTitle}>COE Attendance</Text>
          </View>
        ) : (
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: colors.navy,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  header: {
    minHeight: 76,
    backgroundColor: colors.navy,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  homeHeader: {
    minHeight: 142,
    alignItems: 'flex-start',
  },
  backButton: {
    position: 'absolute',
    left: 14,
    bottom: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '900',
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    marginLeft: 34,
  },
  welcome: {
    color: '#D9DAFF',
    fontSize: 17,
    marginBottom: 8,
  },
  homeTitle: {
    color: colors.white,
    fontSize: 32,
    fontWeight: '900',
  },
});
