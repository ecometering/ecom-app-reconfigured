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

import { getDatabaseTables,createJobsInProgressTable,openDatabase,testDatabaseAndTables,fetchManufacturersForMeterType } from './src/utils/database';

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();



const App = () => {
  // async function testFetchManufacturersForMeterType(meterType) {
  //   console.log(`Testing fetchManufacturersForMeterType for meter type: ${meterType}`);
    
  //   try {
  //     // Assuming meterType is correctly mapped to one of the keys in tableNameMap
  //     // For example, '5' for 'turbine' if using the adjusted mapping approach
  //     const manufacturers = await fetchManufacturersForMeterType(meterType);
  //     console.log('Fetched manufacturers:', manufacturers);
  //   } catch (error) {
  //     console.error('Error fetching manufacturers:', error);
  //   }
  // }
  
  // // Example usage of the test function
  // testFetchManufacturersForMeterType('5');
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
