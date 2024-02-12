import React, { useContext, useState,useEffect } from "react";
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Header from "../../components/Header";
import { useRoute, useNavigation } from "@react-navigation/native";
import { height, unitH, width } from "../../utils/constant";
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import { TextType } from "../../theme/typography";
import OptionalButton from "../../components/OptionButton";
import EcomHelper from "../../utils/ecomHelper";
import { AppContext } from "../../context/AppContext";

import * as ExpoImagePicker from "expo-image-picker";

export default function ExtraPhotoPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { photoNumber, photoKey, title } = route.params;
  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;

  const standardDetails = appContext.standardDetails;
  const [hasExtraPhoto, setHasExtraPhoto] = useState(false);
  const [AddMorePhotos, setAddMorePhotos] = useState(false);
  const [counter, setCounter] = useState(0);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [extraComment, setExtraComment] = useState(null);
  const [extras, setExtras] = useState(standardDetails?.extras);
  console.log("ExtraPhotoPage");

  const backPressed = () => {
    const newExtra = {
      extraPhoto: selectedImage,
      extraComment: extraComment,
    };
    appContext.setStandardDetails({
      ...standardDetails,
      extras: extras,
    });AddMorePhotos
    navigation.goBack();
  };

  const handleMorePhotosSelection = (selection) => {
    // Logic to update state based on selection for adding more photos
    setAddMorePhotos(selection === "Yes");
  };
  const nextPressed = async () => {
    console.log(`nextPressed called with photoNumber: ${photoNumber}, hasExtraPhoto: ${hasExtraPhoto}`);
  
    // Handle the case where no extra photos are required and it's the initial photo page
    if (photoNumber === 0 && !hasExtraPhoto) {
      console.log("Navigating to SubmitSuccessPage as no extra photos are required and it's the initial photo page");
      navigation.navigate("SubmitSuccessPage");
      return;
    }
  
    // Handle the case where a photo is required or being added
    if (photoNumber > 0 || hasExtraPhoto) {
      // Validate that an image and a comment have been selected/entered
      if (!selectedImage) {
        console.log("No image selected");
        EcomHelper.showInfoMessage("Please choose an image");
        return;
      }
      if (!extraComment) {
        console.log("No comment entered");
        EcomHelper.showInfoMessage("Please enter a comment");
        return;
      }
  
      // Construct the new photo and comment object
      const newExtra = { extraPhoto: selectedImage, extraComment: extraComment };
      console.log(`Adding new photo and comment:`, newExtra);
  
      // Update the extras array with the new photo and comment
      let updatedExtras = extras ? [...extras, newExtra] : [newExtra];
      
      try {
        // Convert the selected image to a blob for storage
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        console.log("Image converted to blob and added to context");
  
        // Update the app context with the new blob and updated extras
        appContext.setBlobs(prev => [...prev, blob]);
        appContext.setStandardDetails({
          ...standardDetails,
          extras: updatedExtras,
        });
  
        // Reset states for the next photo, if applicable
        setSelectedImage(undefined);
        setExtraComment(null);
        setExtras(updatedExtras);
  
        // Decide the next navigation step based on user's choice to add more photos
        if (AddMorePhotos) {
          // Dynamically add a new instance of ExtraPhotoPage to the stack
          let nextPhotoNumber = photoNumber + 1;
          let nextPhotoKey = `extraPhotos_${nextPhotoNumber}`;
          let nextTitle = `Extra Photos ${nextPhotoNumber}`;
          console.log(`Adding new ExtraPhotoPage to the stack with photoNumber: ${nextPhotoNumber}`);
          navigation.push("ExtraPhotoPage", { photoNumber: nextPhotoNumber, photoKey: nextPhotoKey, title: nextTitle });
        } else {
          // Navigate to SubmitSuccessPage if no more photos are required
          console.log("Navigating to SubmitSuccessPage as no more photos are required");
          navigation.navigate("SubmitSuccessPage");
        }
      } catch (err) {
        console.error("Error processing the photo:", err);
      }
    } else if (photoNumber === 0 && hasExtraPhoto) {
      // Handle navigation from the initial photo page to the first ExtraPhotoPage
      console.log("Extra photos are required, navigating to first ExtraPhotoPage");
      navigation.push("ExtraPhotoPage", { photoNumber: 1, photoKey: 'extraPhotos_1', title: 'Extra Photos 1' });
    }
  };
   


  const handleImagePicker = () => {
    Alert.alert("Choose Image", "how to choose image ?", [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "Choose from gallery",
        onPress: chooseFromGallery,
      },
      {
        text: "Take photo",
        onPress: takePhoto,
      },
      {},
    ]);
  };
  const takePhoto = () => {
    const options = {
      title: "Take Photo",
      mediaType: "photo",
      quality: 1,
    };

    ExpoImagePicker.launchCameraAsync(options)
      .then((response) => {
        setSelectedImage(response.assets[0].uri);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const chooseFromGallery = () => {
    const options = {
      title: "Choose from Gallery",
      mediaType: "photo",
      quality: 1,
    };

    ExpoImagePicker.launchImageLibraryAsync(options)
      .then((response) => {
        setSelectedImage(response.assets[0].uri);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={{flex: 1}}>
        <Header
          hasLeftBtn={true}
          hasCenterText={true}
          hasRightBtn={true}
          centerText={title}
          leftBtnPressed={backPressed}
          rightBtnPressed={nextPressed}
        />
        <View style={styles.body}>
          <Text type={TextType.CAPTION_3}>{title}</Text>
  
          {/* Question 1: Are any extra photos required? */}
          {photoNumber === 0 && (
            <>
              <Text>Are any extra photos required?</Text>
              <View style={styles.optionContainer}>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => setHasExtraPhoto(true),
                    () => setHasExtraPhoto(false),
                  ]}
                  value={hasExtraPhoto == null ? null : hasExtraPhoto ? "Yes" : "No"}
                />
              </View>
            </>
          )}
  
  {((hasExtraPhoto && photoNumber === 0) || photoNumber > 0) && (
  <>
    {selectedImage && (
      <Image
        source={{ uri: selectedImage }}
        style={styles.image}
        resizeMode="contain"
      />
    )}
    <View style={styles.row}>
      <Button
        title={selectedImage === undefined ? "Choose Image" : "Change Image"}
        onPress={handleImagePicker}
      />
    </View>
    <Text>Comments on Photo</Text>
    <TextInput
      value={extraComment}
      multiline={true}
      style={{ marginTop: 10, width: "100%", height: 150 }}
      onChangeText={setExtraComment}
    />
    {/* Ensure this part is not nested incorrectly and that its conditions for rendering are met */}
    <Text>Do you wish to add more job photos?</Text>
    <View style={styles.optionContainer}>
      <OptionalButton
        options={["Yes", "No"]}
        actions={[
          () => setAddMorePhotos(true),
          () => setAddMorePhotos(false),
        ]}
        value={AddMorePhotos == null ? null : AddMorePhotos ? "Yes" : "No"}
      />
    </View>
  </>
)}
          
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex:1
  },
  body: {
    marginHorizontal: width * 0.1,
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
  },
  optionContainer: {
    width: 100,
    marginVertical: unitH * 10,
    alignSelf: "flex-start",
  },
  spacer: {
    height: unitH * 50,
  },
});
