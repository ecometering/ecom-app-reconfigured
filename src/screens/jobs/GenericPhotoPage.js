import React, { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useRoute } from '@react-navigation/native';
import {
  View,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import Text from '../../components/Text';
import Header from '../../components/Header';
import ImagePickerButton from '../../components/ImagePickerButton';

import { useAppContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const { width, height } = Dimensions.get('window');

function GenericPhotoPage() {
  db = useSQLiteContext();
  const { params } = useRoute();
  const { title, photoKey } = params;
  const { photos, savePhoto, jobID } = useAppContext();
  const existingPhoto = photos?.[photoKey];
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  // RN uses cache storeage when picking image from gallery
  // existing url may not work if the image is deleted from the gallery
  // or deleted from the cache storage
  // TODO: can move the image upload to a server and store the url in the database
  const [selectedImage, setSelectedImage] = useState(
    existingPhoto?.uri || null
  );

  const handlePhotoSelected = (uri) => {
    setSelectedImage(uri);
    savePhoto(photoKey, { title, photoKey, uri });
    console.log('Photo saved:', { title, photoKey, uri });
    console.log('photos:', photos);
  };
  const savePhotoToDatabase = async () => {
    const photosJson = JSON.stringify(photos);
    try {
      await db
        .runAsync('UPDATE Jobs SET photos = ? WHERE id = ?', [
          photosJson,
          jobID,
        ])
        .then((result) => {
          console.log('photos saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving photos to database:', error);
    }
  };
  const nextPressed = () => {
    if (selectedImage) {
      savePhotoToDatabase();
      // If a photo has been selected, navigate to the next screen
      goToNextStep();
    } else {
      // If no photo has been selected, show an alert
      Alert.alert('Select a Photo', 'Please select a photo before proceeding.');
    }
  };
  const backPressed = () => {
    savePhotoToDatabase();
    goToPreviousStep();
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={backPressed}
        hasCenterText
        centerText={title}
        hasRightBtn={true}
        rightBtnPressed={nextPressed} // Use nextPressed here
      />
      <ScrollView style={styles.flex}>
        <View style={styles.body}>
          <Text type="caption" style={styles.text}>
            {title}
          </Text>
          <ImagePickerButton
            onImageSelected={handlePhotoSelected}
            currentImage={selectedImage}
          />
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginTop: 20,
    resizeMode: 'contain',
  },
});

export default GenericPhotoPage;
