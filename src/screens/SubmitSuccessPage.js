// import React, { useContext } from 'react';
// import { View, Text, Button, Alert, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { AppContext } from '../context/AppContext';
// import { openDatabase } from '../utils/database';
// import axios from 'axios';
// import Header from '../components/Header'; // Assuming this is your header component
// import { useAuth } from '../context/AuthContext';

// const SubmitSuccessPage = () => {
//   const appContext = useContext(AppContext);
//   const {authState} = useAuth()
//   const navigation = useNavigation();

//   async function fetchAndUploadJobData() {
//     const db = await openDatabase();
//     db.transaction(tx => {
//       tx.executeSql(
//         `SELECT * FROM Jobs WHERE id = ?`,
//         [appContext?.jobDetails?.JobID],
//         async (_, { rows: { _array } }) => {
//           if (_array.length > 0) {
//             const jobData = { ..._array[0] };
//             const photos = JSON.parse(jobData.photos); // Assuming photos is stored as JSON string
//             delete jobData.photos; // Remove photos from jobData before sending
//             jobData.siteDetails = JSON.parse(jobData.siteDetails);
//             jobData.siteDetails.title = jobData.siteDetails.title.value // TODO: Get value from dropdown
//             // console.log("jobData", jobData)


//             try {
//               // Upload job data excluding photos with Axios
//               const config = {
//                 headers: {
//                   Authorization: `Bearer ${authState.token}`
//                 }
//               }
//               await axios.post('https://test.ecomdata.co.uk/api/incoming-jobs', jobData, config);
//               console.log('Job data uploaded successfully');

//               // Upload photos with Axios
//               for (const photo of photos) {
//                 await axios.post('https://test.ecomdata.co.uk/api/photos', { photo });
//               }
//               console.log('Photos uploaded successfully');

//               // Update job status to 'Completed'
//               tx.executeSql(
//                 'UPDATE Jobs SET jobStatus = ? WHERE id = ?',
//                 ['Completed', appContext?.jobData?.id],
//                 () => {
//                   console.log('Record updated successfully');
//                   Alert.alert(
//                     "Upload Successful",
//                     "The job and photos have been successfully uploaded.",
//                     [
//                       { text: "OK", onPress: () => navigation.navigate("Home") }
//                     ]
//                   );
//                 },
//                 error => {
//                   console.error('Error updating record', error);
//                 }
//               );
//             } catch (error) {
//               console.error('Error during data upload', error);
//               Alert.alert("Upload Error",error, "There was a problem uploading the job. Please try again.");
//             }
//           }
//         },
//         error => {
//           console.error('Error fetching job data', error);
//           Alert.alert("Fetch Error",error, "There was a problem fetching the job data. Please try again.");
//         }
//       );
//     });
//   }

//   return (
//     <View style={styles.container}>
//       <Header 
//         hasLeftBtn={true} 
//         leftBtnPressed={() => navigation.goBack()} 
//         hasCenterText={true} 
//         centerText="Submit Job"
//       />
//       <View style={styles.content}>
//         <Text>Are you ready to submit the job?</Text>
//         <Button
//           title="Yes"
//           onPress={fetchAndUploadJobData}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     padding: 20,
//   },
// });

// export default SubmitSuccessPage;

import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Button, Alert} from 'react-native';
import Axios from 'axios';
import ImagePickerButton from '../components/ImagePickerButton'; // Adjust this path as needed

const TestPage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadResponse, setUploadResponse] = useState('');
  const [jobsResponse, setJobsResponse] = useState('');

  const handlePhotoSelected = (uri) => {
    const userId = 'user123'; // Example user ID, should be dynamically obtained
    const additionalData = {
      key1: 'value1',
      key2: 'value2',
    };

    const image = {
      uri: uri,
      type: 'image/jpeg', // Adjust based on actual image type
      name: 'photo.jpg', // Adjust dynamically based on the file picked
    };

    const data = new FormData();
    data.append('photo', image);
    data.append('userId', userId);
    data.append('additionalData', JSON.stringify(additionalData));

    // Example: Checking the file size before upload, assuming a 5MB limit
    // Note: The file size check logic might need adjustment based on how you're handling files
    const fileSizeLimit = 5 * 1024 * 1024; // 5MB in bytes
    if (image.size && image.size > fileSizeLimit) {
      Alert.alert('Error', 'File size exceeds limit of 5MB.');
      return;
    }

    Axios.post('https://test.ecomdata.co.uk/api/upload-photos', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => {
        setUploadResponse(JSON.stringify(res.data));
        Alert.alert('Success', 'Upload successful!');
      })
      .catch((err) => {
        console.log(err);
        Alert.alert('Upload failed', err.message);
      });
  };

  const fetchIncomingJobs = () => {
    Axios.get('https://test.ecomdata.co.uk/api/incoming-jobs')
      .then((res) => setJobsResponse(JSON.stringify(res.data)))
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.body}>
      <Text style={styles.text}>Upload an Image:</Text>
      <ImagePickerButton onImageSelected={(uri) => handlePhotoSelected(uri)} />
      {selectedImage && (
        <Image source={{uri: selectedImage}} style={styles.image} />
      )}
      <Button title="Fetch Incoming Jobs" onPress={fetchIncomingJobs} />
      <Text style={styles.text}>Upload Response: {uploadResponse}</Text>
      <Text style={styles.text}>Incoming Jobs Response: {jobsResponse}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default TestPage;
