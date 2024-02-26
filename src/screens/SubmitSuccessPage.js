import { View, Text, Button } from "react-native";
import React, {useContext} from "react";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import {  openDatabase} from '../utils/database'; // Importing required functions


const SubmitSuccessPage = () => {
  
  const appContext = useContext(AppContext);
  const navigation = useNavigation();
  async function fetchAndUploadJobData() {
    const db = await openDatabase(); 
    const status = 'Completed'; // New name you want to set
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Jobs SET jobStatus = ? WHERE id = ?',
        [status,appContext?.jobData?.id],
        () => {
          navigation.navigate("Home");
          console.log('Record updated successfully');
          // fetchRecords(); // Fetch records again to update the state
        },
        error => {
          console.error('Error updating record', error);
        }
      );
    });
  }
  return (
    <View style={{ padding: 20 }}>
      <Text>Submit Job</Text>
      <Button
        title="Yes"
        onPress={() => {
          fetchAndUploadJobData();
        
        }}
      />
    </View>
  );
};

export default SubmitSuccessPage;
