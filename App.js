import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer}from '@react-navigation/native'; 
import MainNavigator from './src/navigation/MainNavigator';
import { AppContextProvider } from './src/context/AppContext';

const App = () => {
  return (
    

      <AppContextProvider>
      <MainNavigator />
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
