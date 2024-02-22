import React,{ useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppContextProvider } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';

// Import database functions
import { createJobsTable,getDatabaseTables,openDatabase,testDatabaseAndTables,testFileSystemAccess } from './src/utils/database';

import { createStackNavigator } from "@react-navigation/stack";
const App = () => {
  useEffect(() => {
    
    
    // Call this function at the start of your app or before openDatabase to see if it works.
    testFileSystemAccess();
    async function prepareDatabase() {
      try {
        const db = await openDatabase(); // Open or create the database
       // getDatabaseTables()
        let data  = await testDatabaseAndTables()
        let job_table = await createJobsTable(db)
        console.log(job_table);
      } catch (error) {
        console.error("Failed to prepare database:", error);
      }
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