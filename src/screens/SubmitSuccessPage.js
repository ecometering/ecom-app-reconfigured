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
  const { authState, refresh } = useAuth();
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  async function fetchAndUploadJobData() {
    setLoading(true);
    try {
      const db = await openDatabase();
      db.transaction(tx => {
        tx.executeSql(
          "SELECT * FROM Jobs WHERE id = ?",
          [appContext?.jobDetails?.JobID],
          async (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              const jobData = JSON.stringify(_array[0]);
              await sendData(jobData);
            } else {
              Alert.alert("Error", "No job data found.");
              setLoading(false);
            }
          },
          (error) => {
            console.error('SQL error:', error);
            setLoading(false);
            Alert.alert("Database Error", "Failed to fetch job data.");
          }
        );
      });
    } catch (error) {
      console.error('Database error:', error);
      setLoading(false);
      Alert.alert("Database Error", "Failed to open database.");
    }
  }

  async function sendData(jobData) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`
      }
    };
    const body = {
      data: jobData,
      userId: 1
    };
    try {
      const response = await axios.post('https://test.ecomdata.co.uk/api/incoming-jobs/', body, config);
      if (response.status === 201) {
        uploadPhotos(response.data.job_id);
        updateJobStatus();
      } else if (response.status === 401) {
        await refresh();
        sendData(jobData); // Retry after refreshing token
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setLoading(false);
      Alert.alert("Upload Error", "Failed to upload job data.");
    }
  }

  async function uploadPhotos(job_id) {
    const photos = JSON.parse(appContext.photos);
    for (const photo of photos) {
      await uploadResource(photo, job_id);
    }
  }

  const uploadResource = async (photo, job_id) => {
    const formData = new FormData();
    formData.append('photo_type', photo.photoKey);
    formData.append('userId', '1');
    formData.append('job_id', job_id);
    formData.append('description', photo.description);
    formData.append('photo', {
      uri: photo.uri,
      type: 'image/jpeg',
      name: `${photo.photoKey}.jpg`
    });

    try {
      const response = await fetch('https://test.ecomdata.co.uk/api/upload-photos/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authState.token}`
        },
        body: formData
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`Failed to upload photo. ${responseData.detail}`);
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      Alert.alert("Photo Upload Error", `Failed to upload photo. ${error}`);
    }
  };

  function updateJobStatus() {
    const db = openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE Jobs SET jobStatus = ? WHERE id = ?',
        ['Completed', appContext?.jobDetails?.JobID],
        () => {
          Alert.alert("Upload Complete", "Job and photos uploaded successfully.", [{ text: "OK", onPress: () => navigation.navigate("Home") }]);
          setLoading(false);
        },
        (error) => {
          console.error('SQL error:', error);
          Alert.alert("Database Error", "Failed to update job status.");
          setLoading(false);
        }
      );
    });
  }

  return (
    <View style={styles.container}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={() => navigation.goBack()}
        hasCenterText={true}
        centerText="Submit Job"
      />
      <View style={styles.content}>
        <Text>Submit the job</Text>
        {isLoading ? <ActivityIndicator size="large" /> : <Button title="Send" onPress={fetchAndUploadJobData} />}
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
