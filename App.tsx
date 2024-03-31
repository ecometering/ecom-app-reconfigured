import React, { useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppContextProvider, AppContext } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';
// Import database functions
import {
  createJobsTable,
  getDatabaseTables,
  openDatabase,
  testDatabaseAndTables,
  testFileSystemAccess,
  deleteDatabase,
  JobsDatabaseTest,
} from './src/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SQLiteProvider } from 'expo-sqlite/next';
import { NavigationContainer } from '@react-navigation/native';

const CheckFirstLaunch = async () => {
  try {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    if (hasLaunched === null) {
      console.log('First Launch');
      console.log('delting existing database');
      deleteDatabase();
      console.log('Database deleted');
      console.log('setting hasLaunched to true');
      await AsyncStorage.setItem('hasLaunched', 'true');
      console.log('creating new database');
      const db = await openDatabase();
      console.log('Database created');
      console.log('creating jobs table');
      await createJobsTable(db);
      const check = await getDatabaseTables;
      console.log('DatabaseTables.', check);
    } else {
      console.log('App has been launched before.');
    }
  } catch (error) {
    console.error('Error checking first launch: ', error);
  }
};

const MainApp = () => {
  const {OnLogout} = useAuth();

  const checkAppVersionAndUpdate = async () => {
    const storedVersion = await AsyncStorage.getItem('appVersion');
    console.log('Stored app version:', storedVersion);
    const currentVersion = Constants.expoConfig.version;

    if (storedVersion !== currentVersion) {
      console.log('App version updated. Forcing logout.');
      await AsyncStorage.removeItem('accessToken');
      console.log('Access token removed.');
      await AsyncStorage.removeItem('refreshToken');
      console.log('Refresh Token Removed');
      await AsyncStorage.setItem('appVersion', currentVersion);
      console.log('App version updated to:', currentVersion);
      console.log('Tokens removed and user logged out due to version update.');
OnLogout()

    }
  };

  useEffect(() => {
    CheckFirstLaunch();
    checkAppVersionAndUpdate();
  }, []);

  return <Layout> </Layout>;
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

// Use this hook in your App component or similar entry point

export const Layout = () => {
  return (
    <AppContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <React.Suspense>
          <SQLiteProvider databaseName='options.sqlite' useSuspense>
            <MainNavigator />
          </SQLiteProvider>
        </React.Suspense>
      </GestureHandlerRootView>
    </AppContextProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
