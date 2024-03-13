import { View, Text, Button } from "react-native";
import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import { openDatabase } from '../utils/database';
import axios from 'axios';

const SubmitSuccessPage = () => {
  const appContext = useContext(AppContext);
  const navigation = useNavigation();

  async function fetchAndUploadJobData() {
    const db = await openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Jobs WHERE id = ?`,
        [appContext?.jobData?.id],
        async (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            const jobData = { ..._array[0] };
            const photos = JSON.parse(jobData.photos); // Assuming photos is stored as JSON string
            delete jobData.photos; // Remove photos from jobData before sending

            try {
              // Upload job data excluding photos with Axios
              await axios.post('https://test.ecomdata.co.uk/api/incoming-jobs', jobData);
              console.log('Job data uploaded successfully');

              // Upload photos with Axios
              for (const photo of photos) {
                await axios.post('https://test.ecomdata.co.uk/api/photos', { photo });
              }
              console.log('Photos uploaded successfully');

              // Update job status to 'Completed'
              tx.executeSql(
                'UPDATE Jobs SET jobStatus = ? WHERE id = ?',
                ['Completed', appContext?.jobData?.id],
                () => {
                  console.log('Record updated successfully');
                  navigation.navigate("Home");
                },
                error => {
                  console.error('Error updating record', error);
                }
              );
            } catch (error) {
              console.error('Error during data upload', error);
            }
          }
        },
        error => {
          console.error('Error fetching job data', error);
        }
      );
    });
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Submit Job</Text>
      <Button
        title="Yes"
        onPress={fetchAndUploadJobData}
      />
    </View>
  );
};

export default SubmitSuccessPage;
