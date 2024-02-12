import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer}from '@react-navigation/native'; 
import MainNavigator from './src/navigation/MainNavigator';
import { AppContextProvider } from './src/context/AppContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import AllNavigator from './src/navigation/AllNavigator';


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