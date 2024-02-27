import React,{ useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppContextProvider } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';
// Import database functions
import { createJobsTable,getDatabaseTables,openDatabase,testDatabaseAndTables,testFileSystemAccess,deleteDatabase,JobsDatabaseTest } from './src/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from "@react-navigation/stack";

const CheckFirstLaunch = async () => {
  try { 
    const hasLaunched = await AsyncStorage.getItem('hasLaunched');
    if (hasLaunched === null) {
      console.log("First Launch");
      console.log("delting existing database");
      deleteDatabase();
      console.log("Database deleted");
      console.log("setting hasLaunched to true")
      await AsyncStorage.setItem('hasLaunched', 'true');
      console.log("creating new database");
      const db = await openDatabase();
      console.log("Database created");
      console.log("creating jobs table");
        await createJobsTable(db);
        const check = await getDatabaseTables(db);
        console.log("DatabaseTables.",check); 
  }else {
    console.log("App has been launched before.");
  }
} catch (error) {
  console.error("Error checking first launch: ", error);
}
};

const App = () => {
  useEffect(() => {
    CheckFirstLaunch();

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
