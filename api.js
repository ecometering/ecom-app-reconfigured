import React, { useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';

const API_ENDPOINT = 'https://test.ecomdata.co.uk/api/upload-photos/';

const App = () => {
  const [photoType, setPhotoType] = useState('SitePhoto');
  const [jobId, setJobId] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]?.uri);
    }
  };

  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert('NO PHOTOT');
      return;
    }
    const formData = new FormData();
    formData.append('photo_type', photoType);
    formData.append('job_id', jobId);
    formData.append('description', description);
    formData.append('photo', {
      uri: photo,
      type: 'image/jpeg', // or the correct type based on your photo URI
      name: 'photo.jpg',
    });

    try {
      const response = await axios.post(API_ENDPOINT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 'Authorization': `Bearer ${API_TOKEN}`
        },
      });
      Alert.alert('Success', 'Photo uploaded successfully!');
    } catch (error) {
      Alert.alert('Error', `Failed to upload photo. ${error}`);
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit_ = async () => {
    if (!photo) {
      Alert.alert('NO PHOTOT');
      return;
    }
    const formData = new FormData();
    formData.append('photo_type', photoType);
    formData.append('userId', 'user123');
    formData.append('job_id', jobId);
    formData.append('description', description);
    formData.append('photo', {
      uri: photo,
      type: 'image/jpeg', // or the correct type based on your photo URI
      name: 'photo.png',
    });

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Photo uploaded successfully!');
      } else {
        Alert.alert(
          'Error',
          `Failed to upload photo. ${responseData.message || 'Unknown error'}`
        );
        console.error('Error uploading image:', responseData);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to upload photo. ${error.message || 'Unknown error'}`
      );
      console.error('Error uploading image:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Photo Type:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPhotoType}
        value={photoType}
      />
      <Text style={styles.label}>Job ID:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setJobId}
        value={jobId}
        keyboardType="numeric"
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDescription}
        value={description}
        multiline
      />
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {photo && (
        <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />
      )}
      <Button title="Upload Photo" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
});

export default App;
