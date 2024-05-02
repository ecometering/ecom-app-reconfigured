import React, { useContext, useRef, useState,useEffect } from "react";
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
  Dimensions
} from "react-native";
import Header from "../../components/Header";
import { useNavigation,useRoute } from "@react-navigation/native";
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import OptionalButton from "../../components/OptionButton";
import { TextType } from "../../theme/typography";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import BarcodeScanner from "../../components/BarcodeScanner";
import { PrimaryColors } from "../../theme/colors";
import ImagePickerButton from "../../components/ImagePickerButton";
import { useSQLiteContext } from 'expo-sqlite/next';

const alphanumericRegex = /^[a-zA-Z0-9]+$/;
const { width, height } = Dimensions.get("window");
export default function DataLoggerDetailsPage() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { title, nextScreen, photoKey } = route.params;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;
  const [selectedImage, setSelectedImage] = useState(existingPhoto?.uri || null);

  const { jobType, dataLoggerDetails, setDataLoggerDetails, jobID,photos,savePhoto } = useContext(AppContext);
  const handleInputChange = (name, value) => {
    setDataLoggerDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));

    console.log('value updated:', name);
    console.log('value updated:', value);
    console.log('Corrector Details:', dataLoggerDetails);
  };

  const handlePhotoSelected = (uri) => {
    setSelectedImage(uri);
    savePhoto(photoKey, { title, photoKey, uri });
    console.log('Photo saved:', { title, photoKey, uri });
  };
  const camera = useRef(null);
  const saveToDatabase = async () => {
    const photosJson = JSON.stringify(photos);
    const dataloggerJson = JSON.stringify(dataLoggerDetails);
    try {
      await db.runAsync(
        'UPDATE Jobs SET photos = ?, dataloggerDetails = ? WHERE id = ?',
        [photosJson, dataloggerJson, jobID],
      )
        .then((result) => {
          console.log('photos saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving photos to database:', error);
    }
  };
  console.log("DataLoggerDetailsPage");



  
  const [isModal, setIsModal] = useState(false);

  const backPressed = () => {
    saveToDatabase();
      navigation.goBack();
  
  };
  console.log(dataLoggerDetails);

  const nextPressed = async () => {
    if (!photos.InstalledAMR) {
      EcomHelper.showInfoMessage("Please choose image");
      return;
    }
    
    if (!dataLoggerDetails.serialNumber || dataLoggerDetails.serialNumber === "") {
      EcomHelper.showInfoMessage("Please enter serial number");
      return;
    }
    if (dataLoggerDetails.isMountingBracket == null) {
      EcomHelper.showInfoMessage("Please answer if mounting bracket was used");
      return;
    }
    if (dataLoggerDetails.isAdapter == null) {
      EcomHelper.showInfoMessage("Please answer if adapter was used");
      return;
    }
    if (dataLoggerDetails.isPulseSplitter == null) {
      EcomHelper.showInfoMessage("Please answer if pulse splitter was used");
      return;
    }
    if (dataLoggerDetails.manufacturer == null) {
      EcomHelper.showInfoMessage("Please choose manufacturer");
      return;
    }
    if (dataLoggerDetails.model == null) {
      EcomHelper.showInfoMessage("Please choose model");
      return;
    }
    if (dataLoggerDetails.loggerOwner == null) {
      EcomHelper.showInfoMessage("Please choose Logger owner");
      return;
    }
    saveToDatabase();
          navigation.navigate(nextScreen);
        
        return;
      }


  const scanBarcode = () => {
    setIsModal(true);
  };

  const readSerialNumber = (codes) => {
    setIsModal(false);
    if (codes && codes.data) {
      handleInputChange("serialNumber", codes.data.toString());
    }
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
            <Text type={TextType.HEADER_1} style={{ alignSelf: "center" }}>
              AMR
            </Text>
            <View style={styles.spacer} />
            <View style={styles.border}>
              <View style={styles.row}>
                <View
                  style={{
                    width: width * 0.45,
                    alignSelf: "flex-end",
                  }}
                >
                  <Text>Data logger Serial Number</Text>
                  <View style={styles.spacer2} />
                  <View style={{ ...styles.row, width: width * 0.35 }}>
                    <TextInput
                    onChangeText={(txt) => {
                      // Define the alphanumeric regular expression
                      const alphanumericRegex = /^[a-z0-9]+$/i;

                      // Capitalize the text
                      const formattedText = txt.toUpperCase();

                      // Check if the formatted text is alphanumeric
                      if (alphanumericRegex.test(formattedText)) {
                        handleInputChange("serialNumber", formattedText);
                      }
                    }}
                    style={{
                      ...styles.input,
                      width: width * 0.25,
                      alignSelf: "flex-end",
                    }}
                    value={dataLoggerDetails.serialNumber}
                  />
                    <Button title="📷" onPress={scanBarcode} />
                  </View>
                </View>
                <View>
                  <Text>{"Mounting bracket used?"}</Text>
                  <View style={styles.optionContainer}>
                    <OptionalButton
                      options={["Yes", "No"]}
                      actions={[
                        () => {
                          handleInputChange("isMountingBracket", true);
                        },
                        () => {
                         handleInputChange("isMountingBracket", false);
                        },
                      ]}
                      value={
                        dataLoggerDetails.isMountingBracket == null
                          ? null
                          : dataLoggerDetails.isMountingBracket
                          ? "Yes"
                          : "No"
                      }
                    />
                  </View>
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={{ ...styles.row, justifyContent: "flex-start" }}>
              <View style={{ width: width * 0.45 }}>
              <Text>{"Adaptor used"}</Text>
              <View style={styles.optionContainer}>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      handleInputChange("isAdapter", true);
                    },
                    () => {
                      handleInputChange("isAdapter", false);
                    },
                  ]}
                  value={
                    dataLoggerDetails.isAdapter === null ? null : dataLoggerDetails.isAdapter ? "Yes" : "No"
                  }
                />
              </View>
            </View>
                <View>
                  <Text>{"Pulse splitter Used"}</Text>
                  <View style={styles.optionContainer}>
                    <OptionalButton
                      options={["Yes", "No"]}
                      actions={[
                        () => {
                          handleInputChange("isPulseSplitter", true);
                        },
                        () => {
                          handleInputChange("isPulseSplitter", false);
                        },
                      ]}
                      value={
                        dataLoggerDetails.isPulseSplitter == null
                          ? null
                          : dataLoggerDetails.isPulseSplitter
                          ? "Yes"
                          : "No"
                      }
                    />
                  </View>
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={styles.spacer} />
              <View style={{ ...styles.row, justifyContent: "flex-start" }}>
                <View style={{ width: width * 0.45 }}>
                  <View style={styles.spacer2} />
                  <Text>Manufacturer</Text>
                  <View style={styles.spacer2} />
                  <View style={{ ...styles.row, width: width * 0.35 }}>
                    <TextInput
                      onChangeText={(txt) => {
                        handleInputChange("manufacturer", txt);
                      }}
                      style={{
                        ...styles.input,
                        width: width * 0.25,
                        alignSelf: "flex-end",
                      }}
                      value={dataLoggerDetails.manufacturer}
                    />
                  </View>
                </View>
                <View style={{ width: width * 0.45 }}>
                  <View style={styles.spacer2} />
                  <Text>Model</Text>
                  <View style={styles.spacer2} />
                  <View style={{ ...styles.row, width: width * 0.35 }}>
                    <TextInput
                      onChangeText={(txt) => {
                        handleInputChange("model", txt);
                      }}
                      style={{
                        ...styles.input,
                        width: width * 0.25,
                        alignSelf: "flex-end",
                      }}
                      value={dataLoggerDetails.model}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={{ width: width * 0.4 }}>
                <View style={styles.spacer2} />
                <Text>Logger owner</Text>
                <View style={styles.spacer2} />
                <View style={{ ...styles.row, width: width * 0.35 }}>
                  <TextInput
                    onChangeText={(txt) => {
                      handleInputChange("loggerOwner", txt);
                    }}
                    style={{
                      ...styles.input,
                      width: width * 0.25,
                      alignSelf: "flex-end",
                    }}
                    value={dataLoggerDetails.loggerOwner}
                  />
                </View>
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.imagePickerContainer}>
              
             
          
              <View style={styles.body}>
          <Text type="caption" style={styles.text}>AMR photo</Text>
          <ImagePickerButton
            onImageSelected={handlePhotoSelected}
            currentImage={selectedImage}
          />
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}
        </View>
            </View>
            </View>
         
          {isModal && <BarcodeScanner
            setIsModal={setIsModal}
            cameraRef={camera}
            barcodeRecognized={readSerialNumber}
          />}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: height * 0.25, // Example: Adjust the factor according to your needs
  },
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: width * 0.05,
  },
  border: {
    borderWidth: 1,
    borderColor: PrimaryColors.Black,
    padding: height * 0.02, // Adjusted from unitH to use a percentage of the screen height
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  buttonContainer: {
    width: width * 0.4,
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  button: {
    width: width * 0.2,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
  },
  headerCell: {
    textAlign: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: height * 0.05, // Adjusted
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    textAlign: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: height * 0.05, // Adjusted
    justifyContent: "center",
    alignItems: "center",
  },
  optionContainer: {
    width: width * 0.25, // Adjusted
    marginVertical: height * 0.01, // Adjusted
    alignSelf: "flex-start",
  },
  spacer: {
    height: height * 0.02, // Adjusted
  },
  spacer2: {
    height: height * 0.01, // Adjusted
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
    // Other styles for the close icon
  },
});