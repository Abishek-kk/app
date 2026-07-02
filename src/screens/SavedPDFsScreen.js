import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedCard from '../components/AnimatedCard';
import AppHeader from '../components/AppHeader';
import IconBadge from '../components/IconBadge';
import Screen from '../components/Screen';
import { getPdfExports } from '../services/db';
import { colors } from '../theme';

const SORT_KEY = 'saved_pdfs_sort_order';

export default function SavedPDFsScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pdfs, setPdfs] = useState([]);

  const load = useCallback(async () => {
    const storedSort = (await AsyncStorage.getItem(SORT_KEY)) || 'desc';
    setSortOrder(storedSort);
    setPdfs(await getPdfExports(storedSort));
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return pdfs;
    return pdfs.filter((pdf) =>
      `${pdf.file_name} ${pdf.export_date}`.toLowerCase().includes(term)
    );
  }, [pdfs, query]);

  async function toggleSort() {
    const next = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(next);
    await AsyncStorage.setItem(SORT_KEY, next);
    setPdfs(await getPdfExports(next));
  }

  async function sharePdf(pdf) {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdf.file_uri, { mimeType: 'application/pdf' });
      } else {
        Alert.alert('Sharing unavailable', pdf.file_uri);
      }
    } catch (error) {
      Alert.alert('Open failed', error.message || 'Could not open this PDF.');
    }
  }

  return (
    <>
      <AppHeader title="Saved PDFs" navigation={navigation} />
      <Screen>
        <View style={styles.stack}>
          <TextInput
            placeholder="Search PDFs..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
            style={styles.search}
          />
          <AnimatedCard onPress={toggleSort} style={styles.sort}>
            <Text style={styles.sortIcon}>SORT</Text>
            <Text style={styles.sortText}>
              Sort: {sortOrder === 'desc' ? 'Latest First' : 'Oldest First'}
            </Text>
          </AnimatedCard>
          <FlatList
            data={filtered}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={filtered.length ? styles.list : styles.emptyWrap}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <IconBadge icon="PDF" muted />
                <Text style={styles.empty}>No PDFs found</Text>
              </View>
            }
            renderItem={({ item }) => (
              <AnimatedCard style={styles.pdfRow} onPress={() => sharePdf(item)}>
                <Text style={styles.fileName}>{item.file_name}</Text>
                <Text style={styles.fileMeta}>Attendance date: {item.export_date}</Text>
              </AnimatedCard>
            )}
          />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  stack: {
    flex: 1,
    gap: 14,
  },
  search: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.input,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 16,
  },
  sort: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sortIcon: {
    color: colors.navy,
    fontSize: 13,
    fontWeight: '900',
  },
  sortText: {
    color: colors.text,
    fontWeight: '800',
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  pdfRow: {
    minHeight: 82,
    justifyContent: 'center',
  },
  fileName: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 15,
  },
  fileMeta: {
    color: colors.muted,
    marginTop: 6,
  },
  emptyWrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    gap: 12,
  },
  empty: {
    color: colors.muted,
    fontSize: 16,
    fontWeight: '700',
  },
});
