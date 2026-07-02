import React, { useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimatedCard from '../components/AnimatedCard';
import AppHeader from '../components/AppHeader';
import IconBadge from '../components/IconBadge';
import Screen from '../components/Screen';
import { generateAttendancePdf } from '../services/pdf';
import { formatDate } from '../utils/date';
import { colors } from '../theme';

export default function ExportDataScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [draftDate, setDraftDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [exporting, setExporting] = useState(false);

  async function exportDate(dateText) {
    setExporting(true);
    try {
      const pdf = await generateAttendancePdf(dateText);
      Alert.alert('PDF exported', pdf.fileName);
    } catch (error) {
      Alert.alert('Export failed', error.message || 'Could not generate PDF.');
    } finally {
      setExporting(false);
    }
  }

  function openPicker() {
    setDraftDate(date);
    setShowPicker(true);
  }

  function onPickerChange(event, selectedDate) {
    if (event.type === 'dismissed') {
      setShowPicker(false);
      return;
    }

    const picked = selectedDate || draftDate;
    setDraftDate(picked);

    if (Platform.OS === 'android') {
      setShowPicker(false);
      setDate(picked);
      exportDate(formatDate(picked));
    }
  }

  function confirmPickedDate() {
    setDate(draftDate);
    setShowPicker(false);
    exportDate(formatDate(draftDate));
  }

  return (
    <>
      <AppHeader title="Export Data" navigation={navigation} />
      <Screen>
        <View style={styles.stack}>
          <AnimatedCard
            disabled={exporting}
            style={styles.primaryCard}
            onPress={() => exportDate(formatDate())}
          >
            <View style={styles.cardText}>
              <Text style={styles.primaryTitle}>Today Attendance</Text>
              <Text style={styles.primarySubtitle}>Export today's report instantly</Text>
            </View>
            <IconBadge icon="PDF" />
          </AnimatedCard>

          <AnimatedCard disabled={exporting} style={styles.whiteCard} onPress={openPicker}>
            <View style={styles.cardText}>
              <Text style={styles.title}>Select Date</Text>
              <Text style={styles.subtitle}>Export report by choosing date</Text>
            </View>
            <IconBadge icon="DATE" />
          </AnimatedCard>

          {showPicker && (
            <View style={styles.pickerCard}>
              <DateTimePicker
                value={draftDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                onChange={onPickerChange}
              />
              {Platform.OS === 'ios' && (
                <View style={styles.pickerActions}>
                  <Pressable style={styles.pickerButton} onPress={() => setShowPicker(false)}>
                    <Text style={styles.pickerButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={[styles.pickerButton, styles.okButton]} onPress={confirmPickedDate}>
                    <Text style={[styles.pickerButtonText, styles.okButtonText]}>OK</Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 18,
  },
  primaryCard: {
    backgroundColor: colors.navy,
    minHeight: 116,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  whiteCard: {
    minHeight: 116,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    flex: 1,
    paddingRight: 12,
  },
  primaryTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '900',
  },
  primarySubtitle: {
    color: '#D9DAFF',
    marginTop: 7,
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    marginTop: 7,
  },
  pickerCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 12,
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 8,
  },
  pickerButton: {
    minWidth: 86,
    minHeight: 42,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.input,
  },
  okButton: {
    backgroundColor: colors.navy,
  },
  pickerButtonText: {
    color: colors.text,
    fontWeight: '800',
  },
  okButtonText: {
    color: colors.white,
  },
});
