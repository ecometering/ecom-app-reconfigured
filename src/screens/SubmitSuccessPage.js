import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { openDatabase } from '../utils/database';
import axios from 'axios';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

const SubmitSuccessPage = () => {
  const appContext = useContext(AppContext);
  const { authState } = useAuth();
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    console.log("Initial load complete, loading state set to false.");
  }, []);

  async function fetchAndUploadJobData() {
    setLoading(true);
    console.log("Job data upload initiated.");
    const db = await openDatabase();
    console.log("Database opened.");
    db.transaction(tx => {
      console.log("Database transaction started.");
      tx.executeSql(
        "SELECT * FROM Jobs WHERE id = ?",
        [appContext?.jobDetails?.JobID],
        async (_, { rows: { _array } }) => {
          console.log("SQL query executed.");
          if (_array.length > 0) {
            const jobData = { ..._array[0] };
            jobData.siteDetails = JSON.parse(jobData.siteDetails);
            console.log("Job data prepared for upload:", jobData);
            console.log(`Authentication token: ${authState.token}`);

            try {
              const config = {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authState.token}`
                }
              };
              const body = {
                data: {
                  ...jobData,
                  standardDetails: appContext.standardDetails,
                },
                engineer_id: appContext.standardDetails.engineerId
              };
              const response = await axios.post('https://test.ecomdata.co.uk/api/incoming-jobs/', body, config);
              console.log('Job data upload response:', response);

              if (response?.status === 201) {
                console.log("Job data uploaded successfully, starting photo upload.");
                for (const key in appContext.photos) {
                  if (appContext.photos.hasOwnProperty(key)) {
                    const image = appContext.photos[key];
                    if (!image.uri) {
                      Alert.alert("No Photo Found");
                      continue;
                    }
                    const result = await uploadResource(image, response?.data?.job_id);
                    console.log('Photo upload result:', result);
                  }
                }
                console.log("All photos uploaded successfully.");
                setLoading(false);
                tx.executeSql(
                  'UPDATE Jobs SET jobStatus = ? WHERE id = ?',
                  ['Completed', appContext?.jobDetails?.JobID],
                  () => {
                    console.log('Job status updated to "Completed" in database.');
                    Alert.alert(
                      "Upload Successful",
                      "The job and photos have been successfully uploaded.",
                      [{ text: "OK", onPress: () => navigation.navigate("Home") }]
                    );
                  },
                  error => {
                    console.error('Error updating job status:', error);
                  }
                );
              } else {
                Alert.alert('Upload Error', `Error during data upload. Status: ${response?.status}`);
                setLoading(false);
              }
            } catch (error) {
              setLoading(false);
              console.error('Error during network upload:', error);
              Alert.alert("Upload Error", "There was a problem uploading the job. Please try again.");
            }
          } else {
            console.log("No job data found for the given ID.");
          }
        },
        error => {
          setLoading(false);
          console.error('Error executing SQL query:', error);
          Alert.alert("Fetch Error", "There was a problem fetching the job data. Please try again.");
        }
      );
    });
  }

  const uploadResource = async (image, job_id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('photo_type', 'SitePhoto');
        formData.append('userId', 'user123');
        formData.append('job_id', job_id);
        formData.append('description', image.title);
        formData.append('photo', {
          uri: image.uri,
          type: 'image/jpeg',
          name: `${image.photoKey}.png`
        });

        const authToken = `Bearer ${authState.token}`;
        const response = await fetch('https://test.ecomdata.co.uk/api/upload-photos/', {
          method: 'POST',
          headers: {
            'Authorization': authToken
          },
          body: formData
        });

        const responseData = await response.json();
        console.log('Photo upload response:', responseData);

        if (response.ok) {
          resolve(true);
        } else {
          Alert.alert('Photo Upload Error', `Failed to upload photo. ${responseData?.detail || 'Unknown error'}`);
          console.error('Error uploading image:', responseData);
          resolve(false);
        }
      } catch (error) {
        Alert.alert('Photo Upload Error', `Failed to upload photo. ${error}`);
        console.error('Error uploading image:', error);
        resolve(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={() => navigation.goBack()}
        hasCenterText={true}
        centerText="Submit Job"
      />
      <View style={styles.content}>
        <Text> Submit the job</Text>
        {isLoading ? <ActivityIndicator /> : <Button title="Send" onPress={fetchAndUploadJobData} />}
      </View>
    </View>
  );                                                                                        
};                                  
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
});

export default SubmitSuccessPage;
