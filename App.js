import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppContextProvider } from './src/context/AppContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import MeterDetailsPage from "./src/screens/jobs/MeterDetailsPage";
import InstallFlowNavigator from './src/navigation/installFlowNavigator';

// Import database functions
import { createJobsInProgressTable, openDatabase,testFileSystemAccess } from './src/utils/database';

import { createStackNavigator } from "@react-navigation/stack";
import * as FileSystem from 'expo-file-system';


const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    
    
    // Call this function at the start of your app or before openDatabase to see if it works.
    testFileSystemAccess();
    async function prepareDatabase() {
      // try {
      //   const db = await openDatabase(); // Open or create the database
      //   await createJobsInProgressTable(db); // Create the table if it doesn't exist
      //   // Optionally, you could call testDatabaseAndTables here to verify everything is set up correctly
      // } catch (error) {
      //   console.error("Failed to prepare database:", error);
      // }
    }

    prepareDatabase(); // Call the async function to prepare the database
  }, []);

  return (
    <AppContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <MainNavigator/>
      </GestureHandlerRootView>
    </AppContextProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});