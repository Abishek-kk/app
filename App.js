import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initDb } from './src/services/db';
import HomeScreen from './src/screens/HomeScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';
import MarkAttendanceScreen from './src/screens/MarkAttendanceScreen';
import ExportDataScreen from './src/screens/ExportDataScreen';
import AddCOEScreen from './src/screens/AddCOEScreen';
import AllCOEsScreen from './src/screens/AllCOEsScreen';
import SavedPDFsScreen from './src/screens/SavedPDFsScreen';
import { colors } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDb().finally(() => setReady(true));
  }, []);

  if (!ready) {
    return withWebFrame(
      <SafeAreaProvider>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.navy} size="large" />
        </View>
      </SafeAreaProvider>
    );
  }

  return withWebFrame(
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Attendance" component={AttendanceScreen} />
          <Stack.Screen name="MarkAttendance" component={MarkAttendanceScreen} />
          <Stack.Screen name="ExportData" component={ExportDataScreen} />
          <Stack.Screen name="AddCOE" component={AddCOEScreen} />
          <Stack.Screen name="AllCOEs" component={AllCOEsScreen} />
          <Stack.Screen name="SavedPDFs" component={SavedPDFsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

function withWebFrame(children) {
  if (Platform.OS !== 'web') {
    return children;
  }

  return (
    <View style={styles.webPage}>
      <View style={styles.webFrame}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  webPage: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D8DAE8',
  },
  webFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
