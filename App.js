import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { AppContextProvider } from './src/context/AppContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import MeterDetailsPage from "./src/screens/jobs/MeterDetailsPage";

import { getDatabaseTables,createJobsInProgressTable,openDatabase,testDatabaseAndTables } from './src/utils/database';

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();


const App = () => {
  useEffect(() => {
    testDatabaseAndTables().then(() => {
        console.log('Database setup verification complete.');
    }).catch(error => {
        console.error('Database setup verification failed:', error);
    });
}, []);

  const testDatabaseTables = async () => {
    console.log('Testing database tables...');
    try {
      const db = await openDatabase(); // Ensure we have a database instance
      await createJobsInProgressTable(db); // Create the table
      const tables = await getDatabaseTables(); // Now fetch the table names
      console.log("Database tables:", tables);
    } catch (error) {
      console.error("Error testing database tables:", error);
    }
  };


  return (
    <AppContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Screen name="MeterDetails" component={MeterDetailsPage} options={{ title: 'New Meter Details' }} />
        </NavigationContainer>
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
