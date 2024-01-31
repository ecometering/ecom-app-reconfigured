import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Text from "../../components/Text";
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { height, unitH, width } from "../../utils/constant";
import { TextType } from "../../theme/typography";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import * as ExpoImagePicker from "expo-image-picker";
import * as MediaLibrary from 'expo-media-library';

function GenericPhotoPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const appContext = useContext(AppContext);

  const { title, onPhotoSelected, photoKey, nextScreen } = route.params;

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
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.content}>
        <Header
          hasLeftBtn={true}
          hasCenterText={true}
          hasRightBtn={true}
          centerText={title}
          leftBtnPressed={backPressed}
          rightBtnPressed={nextPressed}
        />
        <View style={styles.spacer} />
        <View style={styles.body}>
          <Text type={TextType.CAPTION_2} style={styles.text}>
            {title}
          </Text>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          <View style={styles.row}>
            <Button
              title={selectedImage ? "Change Image" : "Choose Image"}
              onPress={handleImagePicker}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: width,
    height: height,
  },
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: width * 0.1,
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
    height: unitH * 50,
  },
});

export default GenericPhotoPage;
