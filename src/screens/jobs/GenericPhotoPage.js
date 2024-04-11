import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Dimensions, View, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext } from '../../context/AppContext';
import Header from '../../components/Header';
import Text from '../../components/Text';
import ImagePickerButton from '../../components/ImagePickerButton';

const { width, height } = Dimensions.get('window');

function GenericPhotoPage() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { title, photoKey, nextScreen } = params;
  const { photos, savePhoto } = useAppContext();
  const existingPhoto = photos[photoKey];
  const [selectedImage, setSelectedImage] = useState(existingPhoto?.uri || null);

  const handlePhotoSelected = (uri) => {
    setSelectedImage(uri);
    savePhoto(photoKey, { title, photoKey, uri });
  };

  const nextPressed = () => {
    if (selectedImage) {
      // If a photo has been selected, navigate to the next screen
      navigation.navigate(nextScreen);
    } else {
      // If no photo has been selected, show an alert
      Alert.alert("Select a Photo", "Please select a photo before proceeding.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={() => navigation.goBack()}
        hasCenterText
        centerText={title}
        hasRightBtn={true}
        rightBtnPressed={nextPressed} // Use nextPressed here
      />
      <ScrollView style={styles.flex}>
        <View style={styles.body}>
          <Text type="caption" style={styles.text}>{title}</Text>
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
