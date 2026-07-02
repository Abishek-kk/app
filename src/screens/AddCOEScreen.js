import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import AnimatedCard from '../components/AnimatedCard';
import AppHeader from '../components/AppHeader';
import PrimaryButton from '../components/PrimaryButton';
import Screen from '../components/Screen';
import { addCoe } from '../services/db';
import { colors } from '../theme';

export default function AddCOEScreen({ navigation }) {
  const [name, setName] = useState('');
  const [incharge, setIncharge] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveCoe() {
    if (!name.trim()) {
      Alert.alert('COE name required', 'Enter a COE name before saving.');
      return;
    }

    setSaving(true);
    try {
      await addCoe(name, incharge);
      Alert.alert('COE saved', 'The COE has been added.');
      navigation.navigate('AllCOEs');
    } catch (error) {
      Alert.alert('Save failed', error.message || 'Could not save COE.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AppHeader title="Add COE" navigation={navigation} />
      <Screen>
        <AnimatedCard style={styles.card}>
          <Text style={styles.heading}>Add New COE</Text>
          <View style={styles.field}>
            <Text style={styles.label}>COE Name</Text>
            <TextInput
              placeholder="Enter COE Name"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>COE Incharge</Text>
            <TextInput
              placeholder="Enter Incharge Name"
              placeholderTextColor={colors.muted}
              value={incharge}
              onChangeText={setIncharge}
              style={styles.input}
            />
          </View>
          <PrimaryButton title="Save COE" onPress={saveCoe} loading={saving} />
        </AnimatedCard>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 18,
  },
  heading: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '900',
  },
  field: {
    gap: 8,
  },
  label: {
    color: colors.text,
    fontWeight: '800',
  },
  input: {
    height: 54,
    borderRadius: 16,
    backgroundColor: colors.input,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 16,
  },
});
