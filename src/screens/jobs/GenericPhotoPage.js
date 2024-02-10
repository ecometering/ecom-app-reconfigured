import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet
} from "react-native";
import Text from "../../components/Text";
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import * as ExpoImagePicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';
import { TextType, TextStyles } from '../../theme/typography';


function GenericPhotoPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const appContext = useContext(AppContext);

  const { title, onPhotoSelected, photoKey, nextScreen } = route.params;
  const existingPhoto = appContext[photoKey];
  const [selectedImage, setSelectedImage] = useState(existingPhoto);

  const backPressed = () => {
    navigation.goBack();
  };

  const nextPressed = async () => {
    if (!selectedImage) {
      EcomHelper.showInfoMessage("Please choose an image");
      return;
    }

    // Assuming onPhotoSelected updates the app context or performs necessary actions with the selected image
    if (onPhotoSelected && typeof onPhotoSelected === 'function') {
      onPhotoSelected(selectedImage, appContext);
    }

    // Optionally update the app context or navigate to the next screen with additional parameters as needed
    navigation.navigate(nextScreen, { selectedImage });
  };

  const takePhoto = async () => {
    const cameraPermission = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (cameraPermission.status !== 'granted') {
      alert('Camera permission is required to take photos.');
      return;
    }

    let result = await ExpoImagePicker.launchCameraAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);

      // Save the photo in the device's gallery
      const asset = await MediaLibrary.createAssetAsync(result.uri);
      const albumName = "Ecom Jobs";
      await MediaLibrary.createAlbumAsync(albumName, asset, false)
        .then(() => {
          console.log('Photo saved to album');
        })
        .catch((error) => {
          console.error('Error saving photo to album:', error);
        });
    }
  };

  const chooseFromGallery = async () => {
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    if (mediaLibraryPermission.status !== 'granted') {
      alert('Media library permission is required to choose photos.');
      return;
    }

    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.uri);
    }
  };

  const handleImagePicker = () => {
    Alert.alert("Choose Image", "How would you like to choose the image?", [
      { text: "Cancel", style: "cancel" },
      { text: "Choose from Gallery", onPress: chooseFromGallery },
      { text: "Take Photo", onPress: takePhoto },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={backPressed}
        centerText={title}
        hasRightBtn={true}
        rightBtnPressed={nextPressed}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text type={TextType.CAPTION_2} style={styles.text}>{title}</Text>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}
          <Button
            title={selectedImage ? "Change Image" : "Choose Image"}
            onPress={handleImagePicker}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: '10%',
  },
  text: {
    alignSelf: "flex-start",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  spacer: {
    height: 50, // Adjust based on layout needs, possibly using useScreenDimensions
  },
});


export default GenericPhotoPage;
