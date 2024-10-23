import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';

// Components
import Header from '../components/Header';

// Context & Utils
import { useFormStateContext } from '../context/AppContext';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useProgressNavigation } from '../context/ProgressiveFlowRouteProvider';
import useImageQueue from '../context/image-queue/useImageQueue';

const getCurrentDateTime = () => moment().format('YYYY-MM-DD HH:mm');

const showAlert = (title, message, onPress = null) => {
  Alert.alert(title, message, [{ text: 'OK', onPress }]);
};

const handleError = (title, message, error, setLoading) => {
  console.error(`${title}:`, error);
  showAlert(title, message);
  setLoading(false);
};

const handleUploadError = (error) => {
  if (error.response) {
    console.error('Photo upload error:', error.response.data);
    showAlert(
      'Photo Upload Error',
      `Failed to upload photo. Status: ${error.response.status}. Detail: ${error.response.data}`
    );
  } else if (error.request) {
    console.error('Photo upload error: No response received', error.request);
    showAlert('Photo Upload Error', 'No response received from server.');
  } else {
    console.error('Photo upload error:', error.message);
    showAlert('Photo Upload Error', error.message);
  }
};

const SubmitSuccessPage = () => {
  const { state, resetState } = useFormStateContext();
  const { jobStatus, jobID, photos, standards } = state;
  const { addToQueue } = useImageQueue();

  const navigation = useNavigation();
  const { goToPreviousStep } = useProgressNavigation();
  const db = useSQLiteContext();

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    // Cleanup loading state on unmount
    return () => setLoading(false);
  }, []);

  const fetchAndUploadJobData = async () => {
    setLoading(true);

    try {
      const result = await db.getAllAsync('SELECT * FROM Jobs WHERE id = ?', [
        jobID,
      ]);
      if (result.length > 0) {
        const jobData = JSON.stringify(result[0]);
        await sendData(jobData);
      } else {
        showAlert('Error', 'No job data found.');
        setLoading(false);
      }
    } catch (error) {
      handleError(
        'Database Error',
        'Failed to fetch job data.',
        error,
        setLoading
      );
    }
  };

  const sendData = async (jobData) => {
    const body = { data: jobData };

    try {
      const response = await axios.post(
        'https://test.ecomdata.co.uk/api/incoming-jobs/',
        body
      );
      await uploadPhotos(response.data.job_id);
      updateJobStatus();
    } catch (error) {
      handleError(
        'Upload Error',
        `Upload failed with status: ${error?.response?.status}`,
        error,
        setLoading
      );
    }
  };

  const uploadPhotos = async (job_id) => {
    const photosToUpload = (photos && Object.values(photos)) || [];
    const extraPhotos =
      standards?.extras
        ?.filter((extra) => extra.extraPhoto)
        ?.map((extra) => ({
          photoKey: 'OtherPhoto',
          description: extra.extraComment,
          uri: extra.extraPhoto,
        })) || [];

    const allPhotos = [...photosToUpload, ...extraPhotos];

    await Promise.all(
      allPhotos.map((photo) =>
        addToQueue({
          uri: photo.uri,
          photoKey: photo.photoKey,
          recordId: job_id,
          description: photo.description,
        })
      )
    );
  };

  const updateJobStatus = async () => {
    const endDate = getCurrentDateTime();

    try {
      await db.runAsync(
        'UPDATE Jobs SET jobStatus = ?, endDate = ? WHERE id = ?',
        ['Completed', endDate, jobID]
      );
      showAlert(
        'Upload Complete',
        'Job and photos uploaded successfully.',
        () => {
          resetState();
          setLoading(false);
          navigation.navigate('Home');
        }
      );
    } catch (error) {
      handleError(
        'Database Error',
        'Failed to update job status.',
        error,
        setLoading
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={goToPreviousStep}
        hasCenterText={true}
        centerText="Submit Job"
      />
      <View style={styles.content}>
        <Text>Submit the job</Text>
        {isLoading ? (
          <ActivityIndicator size="large" />
        ) : jobStatus === 'In Progress' ? (
          <Button title="Send" onPress={fetchAndUploadJobData} />
        ) : (
          <Button
            title="Return to Home"
            onPress={() => navigation.navigate('Home')}
          />
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
