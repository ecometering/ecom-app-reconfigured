import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { openDatabase } from '../utils/database';
import axios from 'axios';
import Header from '../components/Header'; // Assuming this is your header component
import { useAuth } from '../context/AuthContext';

const SubmitSuccessPage = () => {
  const appContext = useContext(AppContext);
  const { authState } = useAuth()
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false)

  useEffect(() => {
    setisLoading(false)
  }, [])


  async function fetchAndUploadJobData() {
    setisLoading(true)
    const db = await openDatabase();
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM Jobs WHERE id = ?`,
        [appContext?.jobDetails?.JobID],
        async (_, { rows: { _array } }) => {
          if (_array.length > 0) {
            const jobData = { ..._array[0] };
            // const photos = JSON.parse(jobData.photos); // Assuming photos is stored as JSON string
            const photos = appContext.photos
            // delete jobData.photos; // Remove photos from jobData before sending
            jobData.siteDetails = JSON.parse(jobData.siteDetails);
            jobData.siteDetails.title = jobData.siteDetails.title.value // TODO: Get value from dropdown
            // console.log("jobData", jobData)
            console.log(`Bearer ${authState.token}`);

            console.log(JSON.stringify(null, null, 2));



            try {
              // Upload job data excluding photos with Axios
              const config = {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${authState.token}`
                }
              }

              const body = {
                data: {
                  ...jobData,
                  standardDetails: appContext.standardDetails,
                },
                engineer_id: appContext.standardDetails.engineerId
              }
              const response = await axios.post('https://test.ecomdata.co.uk/api/incoming-jobs/', body, config);


              console.log('Job data uploaded successfully ==>>', response?.data?.job_id, response?.status);

              if (response?.status == 201) {
                // // Upload photos with Axios
                for (const key in photos) {
                  if (photos.hasOwnProperty(key)) {

                    const image = photos[key];
                    if (!image.uri) {
                      Alert.alert("NO PHOTOT")
                      continue
                    }
                    const result = await uploadResource(image, response?.data?.job_id)
                    console.log(result);

                  }
                }

                console.log('Photos uploaded successfully');
                setisLoading(false)
                // Update job status to 'Completed'
                tx.executeSql(
                  'UPDATE Jobs SET jobStatus = ? WHERE id = ?',
                  ['Completed', appContext?.jobData?.id],
                  () => {
                    console.log('Record updated successfully');
                    Alert.alert(
                      "Upload Successful",
                      "The job and photos have been successfully uploaded.",
                      [
                        { text: "OK", onPress: () => navigation.navigate("Home") }
                      ]
                    );
                  },
                  error => {
                    console.error('Error updating record', error);
                  }
                );
              } else {
                Alert.alert('Error', `Error during data upload. ${error}`);

                setisLoading(false)
              }

            } catch (error) {
              setisLoading(false)
              console.log('Error during data upload', error);
              Alert.alert("Upload Error", error, "There was a problem uploading the job. Please try again.");
            }
          }
        },
        error => {
          setisLoading(false)
          console.log('Error fetching job data', error);
          Alert.alert("Fetch Error", error, "There was a problem fetching the job data. Please try again.");
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
          type: 'image/jpeg', // or the correct type based on your photo URI
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

        if (response.ok) {
          resolve(true);
        } else {
          Alert.alert('Error', `Failed to upload photo. ${responseData?.detail || 'Unknown error'}`);
          console.error('Error uploading image:', responseData);
          resolve(false);
        }

      } catch (error) {
        Alert.alert('Error', `Failed to upload photo. ${error}`);
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
        <Text>Are you ready to submit the job?</Text>
        {
          isLoading ?
            <ActivityIndicator />
            :
            <Button
              title="Yes"
              onPress={fetchAndUploadJobData}
            />
        }
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



const styles1 = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginTop: 20,
    borderRadius: 10,
  },
});

