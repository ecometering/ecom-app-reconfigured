import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  // TextInput,
  View,
} from "react-native";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { height, unitH, width } from "../../utils/constant";
import Text from "../../components/Text";
import { TextType } from "../../theme/typography";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";

import TextInput from "../../components/TextInput";

import * as ExpoImagePicker from "expo-image-picker";

export default function RiddorReportPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const standardDetails = appContext.standardDetails;
  const jobType = appContext.jobType;
  const title = jobType === "Install" ? "New Meter Details" : jobType;
  const confirmStandard = standardDetails?.confirmStandard;
  const [selectedImage, setSelectedImage] = useState(
    standardDetails?.riddorImage
  );
  const [notes, setNotes] = useState(standardDetails?.notes);
  const [riddorRef, setRiddorRef] = useState(standardDetails?.riddorRef);

  const backPressed = () => {
    appContext.setStandardDetails({
      ...standardDetails,
      riddorImage: selectedImage,
    });
    navigation.goBack();
  };

  const nextPressed = async () => {
    if (!selectedImage) {
      EcomHelper.showInfoMessage("Please choose image");
      return;
    }

    if (!notes) {
      EcomHelper.showInfoMessage("Notes Compulsory !!");
    }

    if (!riddorRef) {
      EcomHelper.showInfoMessage("Riddor reference !!");
    }

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      appContext.setBlobs((prev) => [...prev, blob]);
    } catch (err) {
      console.log(err);
    }

    appContext.setStandardDetails({
      ...standardDetails,
      riddorImage: selectedImage,
      notes,
      riddorRef,
    });

    if (confirmStandard === true) {
      navigation.navigate("SnClientInfoPage");
    } else {
      navigation.navigate("CompositeLabelPage");
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
          <Text type={TextType.BODY_1}>RIDDOR Report</Text>
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
        </View>

        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={styles.spacer} />
          <Text>Notes</Text>
          <View style={styles.row}>
            <TextInput
              value={notes}
              onChangeText={(text) => {
                setNotes(text);
              }}
              style={{
                ...styles.input,
                width: width * 0.8,
                height: unitH * 150,
              }}
              multiline={true}
            />
          </View>
          <View style={styles.spacer} />

          <Text>RIDDOR reference</Text>
          <View style={styles.row}>
            <TextInput
              value={riddorRef}
              onChangeText={(text) => {
                setRiddorRef(text);
              }}
              style={{
                ...styles.input,
                width: width * 0.8,
              }}
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
    justifyContent: "space-between",
  },
  spacer: {
    height: unitH * 50,
  },
  input: {
    // width: width * 0.35,
    // alignSelf: "center",
    // height: unitH * 40,
    backgroundColor: "white",
  },
});
