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
const jobType = appContext.jobType; 
console.log("jobType", jobType);
  const existingPhoto = appContext[photoKey];
  const [selectedImage, setSelectedImage] = useState(existingPhoto);

  console.log("GenericPhotoPage rendered with params:", { title, photoKey, nextScreen });
  console.log("Existing photo:", existingPhoto);

  const backPressed = () => {
    console.log("Back button pressed");
    navigation.goBack();
  };

  const nextPressed = async () => {
    console.log("Next button pressed");

    if (!selectedImage) {
      console.log("No image selected");
      EcomHelper.showInfoMessage("Please choose an image");
      return;
    }

    console.log("Selected image:", selectedImage);
    // onPhotoSelected(selectedImage, appContext);
    console.log("Navigating to next screen:", nextScreen);
    navigation.navigate(nextScreen);
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    console.log("Media library permission status:", status);
    return status === 'granted';
  };

  const handleImagePicker = () => {
    console.log("Opening image picker alert");
    Alert.alert("Choose Image", "How would you like to choose the image?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Choose from Gallery",
        onPress: chooseFromGallery,
      },
      {
        text: "Take Photo",
        onPress: takePhoto,
      },
    ]);
  };

  const takePhoto = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      EcomHelper.showInfoMessage("Permissions to access camera and media library are required!");
      return;
    }
    let options = {
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        quality: 1,
    };

    let result = await ExpoImagePicker.launchCameraAsync(options);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = await MediaLibrary.createAssetAsync(result.assets[0].uri);
      setSelectedImage(asset.uri);
    }
  };

  const chooseFromGallery = async () => {
    const options = {
      mediaType: ExpoImagePicker.MediaTypeOptions.Images,
      quality: 1,
    };

    const result = await ExpoImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri);
    }
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
          <Text type="caption" style={styles.text}>{title}</Text>
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
