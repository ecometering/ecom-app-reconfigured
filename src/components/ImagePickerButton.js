// Import necessary libraries
import React from 'react';
import { Alert, Button } from 'react-native';
import * as ExpoImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import RNFS from 'react-native-fs'; // Import react-native-fs

// Reusable Image Picker Button Component
const ImagePickerButton = ({ onImageSelected }) => {
  const copyFileToPermanentStorage = async (tempUri) => {
    try {
      const filename = tempUri.split('/').pop();
      // Construct the permanent path
      const permanentUri = `${RNFS.DocumentDirectoryPath}/${filename}`;
      // Copy the file to the new location
      await RNFS.copyFile(tempUri, permanentUri);

      const accessibleUri = permanentUri.startsWith('file://')
        ? permanentUri
        : `file://${permanentUri}`;

      console.log('File copied to:', accessibleUri);
      return accessibleUri;
    } catch (error) {
      console.error('Error copying file:', error);
      throw error; // Rethrow or handle the error appropriately
    }
  };

  const requestPermissions = async () => {
    try {
      const cameraPermission =
        await ExpoImagePicker.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();

      if (
        cameraPermission.status === 'granted' &&
        mediaLibraryPermission.status === 'granted'
      ) {
        return true;
      } else {
        Alert.alert(
          'Permissions required',
          'Permissions to access camera and media library are required!'
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Permissions Error', 'Failed to request permissions.');
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
    try {
      if (await requestPermissions()) {
        let result = await ExpoImagePicker.launchCameraAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          console.log('Photo taken, attempting to save to gallery...');
          // Here's where we handle considerations for createAssetAsync
          const asset = await MediaLibrary.createAssetAsync(
            result.assets[0].uri
          );
          console.log('Photo saved to gallery:', asset.uri);

          const permURI = await copyFileToPermanentStorage(
            result.assets[0].uri
          );
          console.log('Photo saved to gallery:', permURI);
          onImageSelected(permURI); // Pass the saved photo's URI
        }
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo and save to gallery.');
    }
  };

  const chooseFromGallery = async () => {
    try {
      if (await requestPermissions()) {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
          mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
          console.log('Image selected from gallery:', result.assets[0].uri);
          const permURI = await copyFileToPermanentStorage(
            result.assets[0].uri
          );
          console.log('Photo saved to gallery:', permURI);
          onImageSelected(permURI);
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
