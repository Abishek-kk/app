import React, { useCallback, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import AnimatedCard from '../components/AnimatedCard';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import Screen from '../components/Screen';
import { getAttendance, upsertAttendance } from '../services/db';
import { formatDate } from '../utils/date';
import { colors } from '../theme';

export default function MarkAttendanceScreen({ navigation, route }) {
  const { coeId, coeName } = route.params;
  const today = formatDate();
  const [presentCount, setPresentCount] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [saving, setSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getAttendance(coeId, today).then((record) => {
        if (record) {
          setPresentCount(String(record.present_count));
          setImageUri(record.image_uri || '');
        }
      });
    }, [coeId, today])
  );

  async function captureImage() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission needed', 'Please allow camera access to capture attendance photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function saveAttendance() {
    const count = Number(presentCount);
    if (!presentCount.trim() || !Number.isInteger(count) || count < 0) {
      Alert.alert('Invalid count', 'Enter a valid present-student count.');
      return;
    }
    if (!imageUri) {
      Alert.alert('Photo required', 'Capture an attendance photo before saving.');
      return;
    }

    setSaving(true);
    try {
      await upsertAttendance(coeId, today, count, imageUri);
      Alert.alert('Attendance saved', `${coeName} attendance is saved for today.`);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Save failed', error.message || 'Could not save attendance.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AppHeader title={coeName} navigation={navigation} />
      <Screen>
        <View style={styles.stack}>
          <AnimatedCard style={styles.section}>
            <Text style={styles.title}>Present Students</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="Enter number of students"
              placeholderTextColor={colors.muted}
              value={presentCount}
              onChangeText={setPresentCount}
              style={styles.input}
            />
          </AnimatedCard>

          <AnimatedCard style={styles.photoCard} onPress={captureImage}>
            <View style={styles.photoText}>
              <Text style={styles.title}>Capture Image</Text>
              <Text style={styles.subtitle}>Take attendance photo</Text>
            </View>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.thumbnail} />
            ) : (
              <View style={styles.cameraButton}>
                <Text style={styles.cameraIcon}>CAM</Text>
              </View>
            )}
          </AnimatedCard>

          <PrimaryButton title="Save Attendance" onPress={saveAttendance} loading={saving} />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 18,
  },
  section: {
    gap: 14,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    marginTop: 6,
  },
  input: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.input,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 16,
  },
  photoCard: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoText: {
    flex: 1,
  },
  cameraButton: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  thumbnail: {
    width: 76,
    height: 76,
    borderRadius: 16,
    backgroundColor: colors.input,
  },
});
