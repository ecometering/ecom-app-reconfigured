// Import necessary libraries
import React from 'react';
import { Alert, Button } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';

// Reusable Image Picker Button Component
const ImagePickerButton = ({ onImageSelected }) => {
  const requestPermissions = async () => {
    const cameraPermission = await ExpoImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (
      cameraPermission.status === 'granted' &&
      mediaLibraryPermission.status === 'granted'
    ) {
      return true;
    } else {
      alert('Permissions to access camera and media library are required!');
      return false;
    }
  };

  const handleImagePicker = () => {
    Alert.alert('Choose Image', 'How would you like to choose the image?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Choose from Gallery', onPress: () => chooseFromGallery() },
      { text: 'Take Photo', onPress: () => takePhoto() },
    ]);
  };

  const takePhoto = async () => {
    if (await requestPermissions()) {
      let result = await ExpoImagePicker.launchCameraAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    }
  };

  const chooseFromGallery = async () => {
    if (await requestPermissions()) {
      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    }
  };

  return <Button title="Choose Image" onPress={handleImagePicker} />;
};

export default ImagePickerButton;
