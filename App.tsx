import React, { useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppContextProvider, AppContext } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';
import {
  createJobsTable,
  getDatabaseTables,
  openDatabase,
  deleteDatabase,
} from './src/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SQLiteProvider,useSQLiteContext } from 'expo-sqlite/next';
import { NavigationContainer } from '@react-navigation/native';

const CheckFirstLaunch = async () => {
  try {
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    if (hasLaunched === null) {
      console.log('First Launch');
      deleteDatabase();
      console.log('Database deleted');
      await AsyncStorage.setItem('hasLaunched', 'true');
      console.log('creating new database');
      const db = await openDatabase();
      console.log('Database created');
      await createJobsTable(db);
      const check = await getDatabaseTables(); // Fixed function call
      console.log('DatabaseTables.', check);
    } else {
      console.log('App has been launched before.');
    }
  } catch (error) {
    console.error('Error checking first launch: ', error);
    throw error; // Improved error handling
  }
};

const MainApp = () => {
  const { OnLogout } = useAuth();
  const db = useSQLiteContext();
  const checkAppVersionAndUpdate = async () => {
    const storedVersion = await AsyncStorage.getItem('appVersion');
    const currentVersion = Constants.expoConfig.version;

    if (storedVersion !== currentVersion) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.setItem('appVersion', currentVersion);
      OnLogout(); // Cleanup and user logout
    }
  };

  useEffect(() => {
    CheckFirstLaunch();
    checkAppVersionAndUpdate();
  }, []);

  return <Layout />;
};

export default function App() {
  return (
    <AuthProvider>
      <SQLiteProvider databaseName='options.sqlite'>
        <MainApp />
      </SQLiteProvider>
    </AuthProvider>
  );
}

export const Layout = () => {
  return (
    <AppContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainNavigator />
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
