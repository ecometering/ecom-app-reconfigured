import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite/next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MainNavigator from './src/navigation/MainNavigator';
import { AppContextProvider } from './src/context/AppContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { createJobsTable, getDatabaseTables } from './src/utils/database';

const checkFirstLaunch = async (db) => {
  try {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    console.log('hasLaunched:', hasLaunched);
    if (hasLaunched === null) {
      console.log('First Launch');
      await createJobsTable(db);
      console.log('Jobs table created');
      await AsyncStorage.setItem('hasLaunched', 'true');
    } else {
      console.log('App has been launched before.');
      const check = await getDatabaseTables(db);
      if (!check.Jobs) {
        await createJobsTable(db);
        console.log('Jobs table created as it was missing');
      }
    }
  } catch (error) {
    console.error('Error checking first launch: ', error);
    throw error;
  }
};

const MainApp = () => {
  const { OnLogout } = useAuth();
  const db = useSQLiteContext();

  const checkAppVersionAndUpdate = async () => {
    try {
      const storedVersion = await AsyncStorage.getItem('appVersion');
      const currentVersion = Constants.expoConfig.version;

      if (storedVersion !== currentVersion) {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.setItem('appVersion', currentVersion);
        OnLogout();
      }
    } catch (error) {
      console.error('Error checking app version:', error);
    }
  };

  useEffect(() => {
    (async () => {
      if (db) {
        await checkFirstLaunch(db);
        await checkAppVersionAndUpdate();
      }
    })();
  }, [db]);

  return <Layout />;
};

export const Layout = () => {
  return (
    <AppContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainNavigator />
      </GestureHandlerRootView>
    </AppContextProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <SQLiteProvider databaseName="options.sqlite">
        <MainApp />
      </SQLiteProvider>
    </AuthProvider>
  );
}
