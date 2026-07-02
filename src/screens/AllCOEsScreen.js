import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedCard from '../components/AnimatedCard';
import AppHeader from '../components/AppHeader';
import Screen from '../components/Screen';
import { getCoes } from '../services/db';
import { colors } from '../theme';

export default function AllCOEsScreen({ navigation }) {
  const [coes, setCoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);
      getCoes()
        .then((data) => active && setCoes(data))
        .finally(() => active && setLoading(false));
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <>
      <AppHeader title="All COEs" navigation={navigation} />
      <Screen>
        <AnimatedCard style={styles.card}>
          <Text style={styles.heading}>COE List</Text>
          {loading ? (
            <ActivityIndicator color={colors.navy} />
          ) : (
            <FlatList
              data={coes}
              keyExtractor={(item) => String(item.id)}
              scrollEnabled={false}
              contentContainerStyle={coes.length ? styles.list : styles.emptyWrap}
              ListEmptyComponent={<Text style={styles.empty}>No COEs exist yet.</Text>}
              renderItem={({ item, index }) => (
                <View style={styles.item}>
                  <Text style={styles.name}>{index + 1}. {item.name}</Text>
                  <Text style={styles.incharge}>Incharge: {item.incharge || 'Not set'}</Text>
                </View>
              )}
            />
          )}
        </AnimatedCard>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
  },
  heading: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  list: {
    gap: 16,
  },
  item: {
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    paddingBottom: 14,
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  incharge: {
    color: colors.muted,
    marginTop: 5,
  },
  emptyWrap: {
    paddingVertical: 30,
  },
  empty: {
    color: colors.muted,
    textAlign: 'center',
  },
});
