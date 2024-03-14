// Import necessary libraries
import React from 'react';
import { Alert, Button } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Reusable Image Picker Button Component
const ImagePickerButton = ({ onImageSelected }) => {
  // Key used to save/retrieve the photo URI from AsyncStorage
  const PHOTO_URI_KEY = 'photoUri';

  // Function to request permissions for camera and media library access
  const requestPermissions = async () => {
    try {
      const cameraPermission = await ExpoImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      if (cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted') {
        return true;
      } else {
        Alert.alert('Permissions required', 'Permissions to access camera and media library are required!');
        return false;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Permissions Error', 'Failed to request permissions.');
      return false;
    }
  };

  // Function to save the photo URI to AsyncStorage
  const savePhotoUriToStorage = async (uri) => {
    try {
      await AsyncStorage.setItem(PHOTO_URI_KEY, uri);
      console.log('Photo URI saved to AsyncStorage:', uri);
    } catch (error) {
      console.error('Error saving photo URI to AsyncStorage:', error);
      Alert.alert('Storage Error', 'Failed to save photo URI.');
    }
  };

  // Handler for the image picker
  const handleImagePicker = () => {
    Alert.alert('Choose Image', 'How would you like to choose the image?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Choose from Gallery', onPress: () => chooseFromGallery() },
      { text: 'Take Photo', onPress: () => takePhoto() },
    ]);
  };

  // Function to capture a photo using the device's camera
  const takePhoto = async () => {
    try {
      if (await requestPermissions()) {
        let result = await ExpoImagePicker.launchCameraAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          console.log('Photo taken, attempting to save to gallery...');
          const asset = await MediaLibrary.createAssetAsync(result.assets[0].uri);
          console.log('Photo saved to gallery:', asset.uri);
          await savePhotoUriToStorage(asset.uri); // Save the photo's URI to AsyncStorage
          onImageSelected(asset.uri); // Pass the saved photo's URI
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo and save to gallery.');
    }
  };

  // Function to choose a photo from the device's gallery
  const chooseFromGallery = async () => {
    try {
      if (await requestPermissions()) {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          console.log('Image selected from gallery:', result.assets[0].uri);
          await savePhotoUriToStorage(result.assets[0].uri); // Save the selected image's URI to AsyncStorage
          onImageSelected(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Error selecting image from gallery:', error);
      Alert.alert('Error', 'Failed to select image from gallery.');
    }
  };

  return <Button title="Choose Image" onPress={handleImagePicker} />;
};

export default ImagePickerButton;
