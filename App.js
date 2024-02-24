import React,{ useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppContextProvider } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';
// Import database functions
import { createJobsTable,getDatabaseTables,openDatabase,testDatabaseAndTables,testFileSystemAccess,deleteDatabase,JobsDatabaseTest } from './src/utils/database';

import { createStackNavigator } from "@react-navigation/stack";
const App = () => {
  useEffect(() => {
    async function initializeApp() {
      try {
        // Delete the existing database to reset the schema
        
        console.log(JobsDatabaseTest)

        // Proceed with opening and setting up a new database
        const db = await openDatabase();
        await createJobsTable(db); // Ensure the Jobs table is created
        console.log("Database prepared and Jobs table created.");
        // Any other initialization logic can go here
      } catch (error) {
        console.error("Failed to initialize app:", error);
      }
    }

    initializeApp(); // Call the async function to initialize the app
  }, []);

  return (
    <AppContextProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* <NavigationContainer>
        <InstallFlowNavigator/>
        </NavigationContainer> */}
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

