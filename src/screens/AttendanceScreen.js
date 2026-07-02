import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedCard from '../components/AnimatedCard';
import AppHeader from '../components/AppHeader';
import Screen from '../components/Screen';
import { getCoeAttendanceForDate } from '../services/db';
import { formatDate } from '../utils/date';
import { colors } from '../theme';

export default function AttendanceScreen({ navigation }) {
  const today = formatDate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getCoeAttendanceForDate(today)
        .then((data) => active && setRows(data))
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }, [today])
  );

  return (
    <>
      <AppHeader title="Attendance" navigation={navigation} />
      <Screen>
        <Text style={styles.date}>Date: {today}</Text>
        {loading ? (
          <ActivityIndicator color={colors.navy} />
        ) : (
          <FlatList
            data={rows}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={rows.length ? styles.list : styles.emptyWrap}
            ListEmptyComponent={<Text style={styles.empty}>No COEs exist yet. Add one to begin.</Text>}
            renderItem={({ item }) => {
              const marked = item.present_count !== null && item.present_count !== undefined;
              return (
                <AnimatedCard
                  style={styles.row}
                  onPress={() => navigation.navigate('MarkAttendance', { coeId: item.id, coeName: item.name })}
                >
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={[styles.subtitle, marked && styles.marked]}>
                      {marked ? `Marked: ${item.present_count} present` : 'Tap to mark attendance'}
                    </Text>
                  </View>
                </AnimatedCard>
              );
            }}
          />
        )}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  date: {
    color: colors.navy,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 20,
    gap: 14,
  },
  row: {
    minHeight: 88,
    justifyContent: 'center',
  },
  name: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
    fontSize: 14,
  },
  marked: {
    color: colors.success,
    fontWeight: '700',
  },
  emptyWrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    color: colors.muted,
    fontSize: 16,
    textAlign: 'center',
  },
});
