import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { openDatabase } from '../utils/database';
import axios from 'axios';
import moment from 'moment';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useProgressNavigation } from '../context/ExampleFlowRouteProvider';

const SubmitSuccessPage = () => {
  const appContext = useContext(AppContext);
  const { authState, RefreshAccessToken } = useAuth();
  const navigation = useNavigation();
  const { goToPreviousStep } = useProgressNavigation();
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const getCurrentDateTime = () => {
    return moment().format('YYYY-MM-DD HH:mm');
  };

  async function fetchAndUploadJobData() {
    setLoading(true);

    try {
      const db = await openDatabase();

      db?.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Jobs WHERE id = ?',
          [appContext?.jobID],
          async (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              const jobData = JSON.stringify(_array[0]);
              await sendData(jobData);
            } else {
              Alert.alert('Error', 'No job data found.');
              setLoading(false);
            }
          },
          (error) => {
            console.error('SQL error:', error);
            setLoading(false);
            Alert.alert('Database Error', 'Failed to fetch job data.');
          }
        );
      });
    } catch (error) {
      console.error('Database error:', error);
      setLoading(false);
      Alert.alert('Database Error', 'Failed to open database.');
    }
  }

  async function sendData(jobData) {
    const body = {
      data: jobData,
      // TODO: when no longer needed by the api remove this line
      // engineer_id: 1,
    };
    try {
      axios
        .post('https://test.ecomdata.co.uk/api/incoming-jobs/', body)
        .then((response) => {
          console.log('Job data uploaded:', response.data);
          uploadPhotos(response.data.job_id)
            .then(() => {
              updateJobStatus();
            })
            .catch((error) => {
              console.error('Photo upload error:', error);
              Alert.alert('Photo Upload Error', 'Failed to upload photos.');
              setLoading(false);
            });
        })
        .catch(async (error) => {
          if (error?.response?.status === 401) {
            console.log('Token expired, refreshing token...');
            await RefreshAccessToken();
            sendData(jobData);
          }
          console.error('Upload error:', error);
          setLoading(false);
          Alert.alert(
            'Upload Error',
            `Upload failed with status: ${error?.response?.status}`
          );
        });
    } catch (error) {
      console.error('Upload error:', error);
      setLoading(false);
      Alert.alert('Upload Error', 'Failed to upload job data.');
    }
  }

  async function uploadPhotos(job_id) {
    console.log('Uploading photos...');
    const photos =
      (appContext.photos && Object.values(appContext.photos)) || [];

    // Parse and Add extra photos to the list
    const extraPhotos =
      appContext?.standardDetails?.extras?.length > 0
        ? appContext.standardDetails.extras
            .filter((extra) => extra.extraPhoto) // Filter out items where extraPhoto is falsy (null, undefined, '', etc.)
            .map((extra) => ({
              photoKey: 'OtherPhoto',
              description: extra.extraComment,
              uri: extra.extraPhoto,
            }))
        : [];

    [...photos, ...extraPhotos].forEach((photo) => {
      uploadResource(photo, job_id);
    });
  }

  const uploadResource = (photo, job_id) => {
    if (!photo.uri) {
      console.error({ photo });
      console.error('Photo URI is empty');
      return;
    }
    const formData = new FormData();
    formData.append('photo_type', photo.photoKey);
    formData.append('job_id', job_id);
    formData.append('description', photo.description);
    formData.append('photo', {
      uri: photo.uri.replace('file://', ''), // Adjust the URI if necessary
      type: 'image/jpeg',
      name: `${photo.photoKey}.jpg`,
    });

    axios
      .post('https://test.ecomdata.co.uk/api/upload-photos/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios sets this automatically, but specifying just in case
        },
      })
      .then((response) => {
        console.log('Upload successful:', response.data);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Photo upload error:', error.response.data);
          Alert.alert(
            'Photo Upload Error',
            `Failed to upload photo. Status: ${error.response.status}. Detail: ${error.response.data}`
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.error(
            'Photo upload error: No response received',
            error.request
          );
          Alert.alert(
            'Photo Upload Error',
            'No response received from server.'
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Photo upload error:', error.message);
          Alert.alert('Photo Upload Error', error.message);
        }
      });
  };

  async function updateJobStatus() {
    const db = await openDatabase();
    const endDate = getCurrentDateTime();

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Jobs SET jobStatus = ?, endDate = ? WHERE id = ?',
        ['Completed', endDate, appContext?.jobID],
        () => {
          Alert.alert(
            'Upload Complete',
            'Job and photos uploaded successfully.',
            [
              {
                text: 'OK',
                onPress: () => {
                  // Clear job data and navigate to home
                  appContext.resetContext();
                  setLoading(false);
                  navigation.navigate('Home');
                },
              },
            ]
          );
        },
        (error) => {
          console.error('SQL error:', error);
          Alert.alert('Database Error', 'Failed to update job status.');
          setLoading(false);
        }
      );
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={() => goToPreviousStep()}
        hasCenterText={true}
        centerText="Submit Job"
      />
      <View style={styles.content}>
        <Text>Submit the job</Text>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Button title="Send" onPress={fetchAndUploadJobData} />
        )}
      </View>
    </SafeAreaView>
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
