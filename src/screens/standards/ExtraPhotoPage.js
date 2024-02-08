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
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { height, unitH, width } from "../../utils/constant";
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import { TextType } from "../../theme/typography";
import OptionalButton from "../../components/OptionButton";
import EcomHelper from "../../utils/ecomHelper";
import { AppContext } from "../../context/AppContext";

import * as ExpoImagePicker from "expo-image-picker";

export default function ExtraPhotoPage() {

  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;
  const title = jobType === "Install" ? "New Meter Details" : jobType;

  const standardDetails = appContext.standardDetails;
  const [hasExtraPhoto, setHasExtraPhoto] = useState(false);
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
    });
    navigation.goBack();
  };

  const nextPressed = async () => {
    if (counter > 0 && hasExtraPhoto === false) {
      appContext.setStandardDetails({
        ...standardDetails,
        extras: result,
      });
      navigation.navigate("SettingsLabelPage");
      return;
    }
    if (!selectedImage) {
      EcomHelper.showInfoMessage("Please choose image");
      return;
    }
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      appContext.setBlobs(prev => [ ...prev, blob ])
    }
    catch(err) {
      console.log(err);
    }
    if (extraComment == null) {
      EcomHelper.showInfoMessage("Please enter comment");
      return;
    }
    const newExtra = {
      extraPhoto: selectedImage,
      extraComment: extraComment,
    };
    let result = [];
    if (extras) {
      setExtras([...extras, newExtra]);
      result = [...extras, newExtra];
    } else {
      setExtras([newExtra]);
      result = [newExtra];
    }

    if (hasExtraPhoto) {
      setCounter(counter + 1);
      console.log(result);
      setSelectedImage(undefined);
      setExtraComment(null);
      // navigation.navigate('ExtraPhotoPage');
    } else {
      appContext.setStandardDetails({
        ...standardDetails,
        extras: result,
      });
      navigation.navigate("SubmitSuccessPage");
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
      <SafeAreaView style={{flex:1}}>
        <Header
          hasLeftBtn={true}
          hasCenterText={true}
          hasRightBtn={true}
          centerText={title}
          leftBtnPressed={backPressed}
          rightBtnPressed={nextPressed}
        />
        <View style={styles.body}>
          <Text type={TextType.CAPTION_3}>{"Extra Photo"}</Text>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          <View style={styles.row}>
            <Button
              title={
                selectedImage === undefined ? "Choose Image" : "Change Image"
              }
              onPress={handleImagePicker}
            />
          </View>
          <View style={styles.spacer} />
          <Text>Comments on Photo</Text>
          <TextInput
            value={extraComment}
            multiline={true}
            style={{ marginTop: 10, width: "100%", height: 150 }}
            onChangeText={(txt) => {
              setExtraComment(txt);
            }}
          />
          <View style={styles.spacer} />
          <Text>Do you Wish to Add extra job photos</Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={["Yes", "No"]}
              actions={[
                () => {
                  setHasExtraPhoto(true);
                },
                () => {
                  setHasExtraPhoto(false);
                },
              ]}
              value={
                hasExtraPhoto == null ? null : hasExtraPhoto ? "Yes" : "No"
              }
            />
          </View>
          <View style={styles.spacer} />
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
