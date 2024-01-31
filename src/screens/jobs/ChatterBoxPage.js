import React, { useContext, useRef, useState } from "react";
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Text from "../../components/Text";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { width, unitH } from "../../utils/constant";
import TextInput from "../../components/TextInput";
import EcomHelper from "../../utils/ecomHelper";
import { AppContext } from "../../context/AppContext";
import BarcodeScanner from "../../components/BarcodeScanner";

import * as ExpoImagePicker from "expo-image-picker";

const alphanumericRegex = /^[a-zA-Z0-9]+$/;

function ChatterBoxPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;
  const title = jobType === "Install" ? "New Meter Details" : jobType;
  const regulatorDetails = appContext.regulatorDetails;
  const camera = useRef(null);
  const [isModal, setIsModal] = useState(false);
  const [serialNumber, setSerialNumber] = useState(
    regulatorDetails?.chatterSerialNumber
  );
  const [manufacturer, setManufacturer] = useState(
    regulatorDetails?.chatterManufacturer
  );
  const [selectedImage, setSelectedImage] = useState(
    regulatorDetails?.chatterImage
  );
  const [model, setModel] = useState(regulatorDetails?.chatterModel);

  const nextPressed = async () => {
    if (!selectedImage) {
      EcomHelper.showInfoMessage("Please choose image");
      return;
    }

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      appContext.setBlobs((prev) => [...prev, blob]);
    } catch (err) {
      console.log(err);
    }
    if (!manufacturer) {
      EcomHelper.showInfoMessage("Please choose manufacturer");
      return;
    }
    if (!serialNumber) {
      EcomHelper.showInfoMessage("Please choose serial number");
      return;
    }
    if (!model) {
      EcomHelper.showInfoMessage("Please choose model");
      return;
    }

    appContext.setRegulatorDetails({
      ...regulatorDetails,
      chatterManufacturer: manufacturer,
      chatterSerialNumber: serialNumber,
      chatterModel: model,
      chatterImage: selectedImage,
    });

    navigation.navigate("StandardPage");
  };
  const backPressed = () => {
    appContext.setRegulatorDetails({
      ...regulatorDetails,
      chatterManufacturer: manufacturer,
      chatterSerialNumber: serialNumber,
      chatterModel: model,
      chatterImage: selectedImage,
    });
    navigation.goBack();
  };

  const scanBarcode = () => {
    setIsModal(true);
  };

  const readSerialNumber = (codes) => {
    EcomHelper.showInfoMessage(codes.data);
    console.log(codes);
    setIsModal(false);
    setSerialNumber(codes.data);
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
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={title}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView style={styles.content}>
          <View style={styles.body}>
            <View style={styles.row}>
              <View style={{ width: width * 0.4 }}>
                <View style={styles.spacer2} />
                <Text>Chatterbox Manufacturer</Text>
                <View style={styles.spacer2} />
                <TextInput
                  value={manufacturer}
                  onChangeText={(txt) => {
                    if (alphanumericRegex.test(txt)) setManufacturer(txt);
                  }}
                  style={styles.input}
                />
              </View>
              <View style={{ width: width * 0.4, alignItems: "flex-start" }}>
                <Text>Chatterbox model</Text>
                <View style={styles.spacer2} />
                <TextInput
                  value={model}
                  onChangeText={(txt) => {
                    if (alphanumericRegex.test(txt)) setModel(txt);
                  }}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View
                style={{
                  width: width * 0.45,
                  alignSelf: "flex-end",
                }}
              >
                <Text>ChatterBox serial Number</Text>
                <View style={styles.spacer2} />
                <View style={{ ...styles.row, width: width * 0.35 }}>
                  <TextInput
                    onChangeText={(txt) => {
                      if (alphanumericRegex.test(txt)) setSerialNumber(txt);
                    }}
                    style={{
                      width: width * 0.25,
                      alignSelf: "flex-end",
                    }}
                    value={serialNumber}
                  />
                  <Button title="📷" onPress={scanBarcode} />
                </View>
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.spacer} />
            <View style={styles.spacer} />

            <Text>{"Chatter Box Image"}</Text>
            <View style={styles.spacer} />
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
          </View>
          {isModal && (
            <BarcodeScanner
              setIsModal={setIsModal}
              cameraRef={camera}
              barcodeRecognized={readSerialNumber}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: width * 0.05,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  input: {
    width: width * 0.35,
  },
  optionContainer: {
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  spacer: {
    height: unitH * 20,
  },
  spacer2: {
    height: 10,
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
  },
  image: {
    height: unitH * 200,
  },
});

export default ChatterBoxPage;
