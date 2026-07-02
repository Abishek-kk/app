import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AnimatedCard from '../components/AnimatedCard';
import AppHeader from '../components/AppHeader';
import IconBadge from '../components/IconBadge';
import Screen from '../components/Screen';
import { colors } from '../theme';

const actions = [
  { label: 'Attendance', icon: 'OK', route: 'Attendance' },
  { label: 'Export Data', icon: 'PDF', route: 'ExportData' },
  { label: 'Add COES', icon: '+', route: 'AddCOE' },
  { label: 'View All COE', icon: 'LIST', route: 'AllCOEs' },
  { label: 'Saved PDFs', icon: 'SAVE', route: 'SavedPDFs' },
];

export default function HomeScreen({ navigation }) {
  return (
    <>
      <AppHeader home navigation={navigation} />
      <Screen>
        <View style={styles.grid}>
          {actions.map((item) => (
            <AnimatedCard
              key={item.route}
              onPress={() => navigation.navigate(item.route)}
              style={styles.card}
            >
              <IconBadge icon={item.icon} />
              <Text style={styles.label}>{item.label}</Text>
            </AnimatedCard>
          ))}
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: '47.7%',
    minHeight: 142,
    justifyContent: 'space-between',
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 20,
  },
});
