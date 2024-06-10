import React, { useEffect,useState, useContext,Suspense } from 'react';
import { StyleSheet,View,Text,ActivityIndicator } from 'react-native';
import LoadingComponent from './src/components/LoadingComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppContextProvider, AppContext } from './src/context/AppContext';
import MainNavigator from './src/navigation/MainNavigator';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import Constants from 'expo-constants';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite/next';
import { NavigationContainer } from '@react-navigation/native';

const loadDatabase =  async ()=> {
  const dbName ="options.sqlite";
  const dbAsset = require("./assets/options.sqlite");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;
  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`, 
      {intermediates: true, }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
}

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
    
    checkAppVersionAndUpdate();
  }, []);

  return <Layout />;
};

export default function App() {
  const [dbLoaded,setDbLoaded]=useState<boolean>(false);
  useEffect(()=>{
    loadDatabase()
    .then(()=>setDbLoaded(true))
    .catch((e) => console.error(e));
  },[]);
  
  if (!dbLoaded) 
    return (
      <View style={{ flex: 1 }}>
          <LoadingComponent loadingText="Please wait, fetching data..." />
          {/* You can use other instances with different texts */}
        
      </View>
  );
    return (
    <AuthProvider>
      <Suspense
      fallback ={
        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
         <LoadingComponent loadingText="Please wait, fetching data..." />
        </View>
      }
      >
      <SQLiteProvider databaseName="options.sqlite" useSuspense >
        <MainApp />
      </SQLiteProvider>
      </Suspense>
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
