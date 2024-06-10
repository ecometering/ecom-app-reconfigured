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
import { useProgressNavigation } from '../context/ExampleFlowRouteProvider';

const SubmitSuccessPage = () => {
  const appContext = useContext(AppContext);
  const { jobStatus } = appContext;
  const { authState, RefreshAccessToken } = useAuth();
  const navigation = useNavigation();
  const { goToPreviousStep } = useProgressNavigation();
  const [isLoading, setLoading] = useState(false);
  const [currentJobStatus, setCurrentJobStatus] = useState(jobStatus);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(false);
    setCurrentJobStatus(jobStatus);
  }, [jobStatus]);

  const getCurrentDateTime = () => {
    return moment().format('YYYY-MM-DD HH:mm');
  };

  const fetchJobData = async () => {
    try {
      const db = await openDatabase();
      return new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'SELECT * FROM Jobs WHERE id = ?',
            [appContext?.jobID],
            (_, { rows: { _array } }) => {
              if (_array.length > 0) {
                resolve(JSON.stringify(_array[0]));
              } else {
                reject('No job data found.');
              }
            },
            (error) => {
              console.error('Error fetching job data:', error);
              reject('Failed to fetch job data.');
            }
          );
        });
      });
    } catch (error) {
      console.error('Error opening database:', error);
      throw new Error('Failed to open database.');
    }
  };

  const uploadJobData = async (jobData) => {
    const body = {
      data: jobData,
    };

    try {
      const response = await axios.post(
        'https://test.ecomdata.co.uk/api/incoming-jobs/',
        body
      );
      console.log('Job data uploaded:', response.data);
      return response.data;
    } catch (error) {
      if (error?.response?.status === 401) {
        console.log('Token expired, refreshing token...');
        await RefreshAccessToken();
        return uploadJobData(jobData);
      }
      console.error('Upload error:', error);
      throw new Error(`Upload failed with status: ${error?.response?.status}`);
    }
  };

  const uploadPhotos = async (photos, extras, job_id) => {
    console.log('Uploading photos...');

    const allPhotos = [
      ...(photos ? Object.values(photos) : []),
      ...(extras
        ? extras.filter((extra) => extra.extraPhoto).map((extra) => ({
            photoKey: 'OtherPhoto',
            description: extra.extraComment,
            uri: extra.extraPhoto,
          }))
        : []),
    ];

    const uploadPromises = allPhotos.map((photo) => uploadResource(photo, job_id));

    try {
      await Promise.all(uploadPromises);
      console.log('All photos uploaded successfully.');
    } catch (error) {
      console.error('Error uploading photos:', error);
      throw new Error('Failed to upload photos.');
    }
  };

  const uploadResource = async (photo, job_id) => {
    if (!photo.uri) {
      console.error('Photo URI is empty:', photo);
      return;
    }

    const formData = new FormData();
    formData.append('photo_type', photo.photoKey);
    formData.append('job_id', job_id);
    formData.append('description', photo.description || '');
    formData.append('photo', {
      uri: photo.uri.replace('file://', ''),
      type: 'image/jpeg',
      name: `${photo.photoKey}.jpg`,
    });

    try {
      const response = await axios.post(
        'https://test.ecomdata.co.uk/api/upload-photos/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('Upload successful:', response.data);
    } catch (error) {
      console.error('Photo upload error:', error.response?.data || error.message);
      throw new Error(
        `Failed to upload photo. Status: ${error.response?.status}. Detail: ${error.response?.data || error.message}`
      );
    }
  };

  const updateJobStatus = async () => {
    const db = await openDatabase();
    const endDate = getCurrentDateTime();

    try {
      await new Promise((resolve, reject) => {
        db.transaction((tx) => {
          tx.executeSql(
            'UPDATE Jobs SET jobStatus = ?, endDate = ? WHERE id = ?',
            ['Completed', endDate, appContext?.jobID],
            () => {
              resolve();
            },
            (error) => {
              console.error('Error updating job status:', error);
              reject('Failed to update job status.');
            }
          );
        });
      });

      Alert.alert('Upload Complete', 'Job and photos uploaded successfully.', [
        {
          text: 'OK',
          onPress: () => {
            appContext.resetContext();
            setLoading(false);
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('Error updating job status:', error);
      setError('Failed to update job status. Please try again.');
      setLoading(false);
    }
  };

  const handleJobSubmission = async () => {
    setLoading(true);
    setError(null);

    try {
      const jobData = await fetchJobData();
      const uploadedJobData = await uploadJobData(jobData);
      await uploadPhotos(appContext.photos, appContext.standardDetails.extras, uploadedJobData.job_id);
      await updateJobStatus();
    } catch (error) {
      console.error('Error during job submission:', error);
      setError('An error occurred during job submission. Please try again.');
      setLoading(false);
    }
  };

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
        ) : currentJobStatus === 'Completed' ? (
          <Button
            title="Return to Home"
            onPress={() => {
              navigation.navigate('Home');
            }}
          />
        ) : (
          <Button title="Send" onPress={handleJobSubmission} />
        )}
        {error && <Text style={styles.error}>{error}</Text>}
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
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default SubmitSuccessPage;