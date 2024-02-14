import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import { AppContextProvider } from './src/context/AppContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import MainNavigator from './src/navigation/MainNavigator';
import MeterDetailsPage from "./src/screens/jobs/MeterDetailsPage";

import { getDatabaseTables,createJobsInProgressTable,openDatabase,testDatabaseAndTables,fetchManufacturersForMeterType } from './src/utils/database';

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();



const App = () => {
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
