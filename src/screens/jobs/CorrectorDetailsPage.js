import React, { useContext, useRef, useState,useEffect, createRef } from "react";
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
import { useNavigation } from "@react-navigation/native";
import {
  METER_MANUFACTURER_LIST,
  METER_MODEL_LIST,

  CORRECTOR_METER_MANUFACTURER_LIST,
  CORRECTOR_METER_MODEL_LIST
} from "../../utils/constant";
import Text from "../../components/Text";
import TextInput,{ TextInputWithTitle, InputRowWithTitle } from "../../components/TextInput";
import OptionalButton from "../../components/OptionButton";
import { TextType } from "../../theme/typography";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import BarcodeScanner from "../../components/BarcodeScanner";
import { PrimaryColors } from "../../theme/colors";
import { openDatabase,fetchPhotosJSON,appendPhotoDetail } from "../../utils/database";
import ImagePickerButton from "../../components/ImagePickerButton";
import * as ExpoImagePicker from "expo-image-picker";
import EcomDropDown from "../../components/DropDown";
import { fetchManufacturersForMeterType, fetchModelsForManufacturer } from "../../utils/database";
const alphanumericRegex = /^[a-zA-Z0-9]+$/;
const { width, height } = Dimensions.get("window");

export default function CorrectorDetailsPage() {
  const appContext = useContext(AppContext);
  const navigation = useNavigation();
  const jobType = appContext.jobType;

  console.log("CorrectorDetailsPage");

  const correctorDetails = appContext.correctorDetails;
  const [correctorSerialNumber, setCorrectorSerialNumber] = useState('');
  const [isMountingBracket, setIsMountingBracket] = useState(
    correctorDetails?.isMountingBracket
  );

  const [manufacturer, setManufacturer] = useState(
    correctorDetails?.manufacturer
  );
  const [model, setModel] = useState(correctorDetails?.model);
  
  const [correctorImage, setcorrectorImage] = useState(
    correctorDetails?.loggerImage
  );
  const [isModal, setIsModal] = useState(false);
  const [uncorrectedReads, setUncorrectedReads] = useState(correctorDetails?.uncorrectedReads);
  const [correctedReads, setCorrectedReads] = useState(correctorDetails?.correctedReads);

const camera = createRef(null)

  const backPressed = () => {
    // appContext.setCorrectorDetails(correctorDetails);
      navigation.goBack();
    
  };
const updateCorrectorDetails = async() => { 
  const db = await openDatabase(); 
  const photosJSON = await fetchPhotosJSON(db,jobId);
  const photoDetails = {
    title: "Corrector Image",
    uri: correctorImage,
    photoKey: "correctorImage",
  };
  const updatedPhotosJSON = appendPhotoDetail(photosJSON, photoDetail);

  let existingCorrectorDetailsJSON = '';
  db.transaction(tx => {
    tx.executeSql(
      'SELECT correctorDetails FROM Jobs WHERE id = ?',
      [jobId],
      (_, { rows }) => {
        if (rows.length > 0 && rows._array[0].correctorDetails) {
          existingCorrectorDetailsJSON = rows._array[0].correctorDetails;
        }

        // Parse existing corrector details JSON, or initialize to an empty array if none exist
        const existingCorrectorDetails = existingCorrectorDetailsJSON ? JSON.parse(existingCorrectorDetailsJSON) : [];

        // New corrector details to append
        const newCorrectorDetails = {
          correctorSerialNumber,
          isMountingBracket,
          manufacturer,
          model,
          uncorrectedReads,
          correctedReads,
          correctorImage, // Assuming you want to save the image path as part of the corrector details
        };

        // Append new corrector details
        existingCorrectorDetails.push(newCorrectorDetails);

        // Convert back to JSON string
        const updatedCorrectorDetailsJSON = JSON.stringify(existingCorrectorDetails);

        // Update the database with the new JSON string
        tx.executeSql(
          'UPDATE Jobs SET correctorDetails = ? WHERE id = ?',
          [updatedCorrectorDetailsJSON, jobId],
          () => console.log('Corrector details updated successfully'),
          (_, error) => console.log('Error updating corrector details:', error)
        );
      },
      (_, error) => console.log('Error fetching existing corrector details:', error)
    );
  });
};

  const nextPressed = async () => {
    console.log("nextPressed invoked.");
    if (!correctorImage) {
      EcomHelper.showInfoMessage("Please choose image");
      return;
    }
    try {
      const response = await fetch(correctorImage);
      const blob = await response.blob();
      appContext.setBlobs((prev) => [...prev, blob]);
    } catch (err) {
      console.log(err);
    }
    if (!correctorSerialNumber || correctorSerialNumber === "") {
      EcomHelper.showInfoMessage("Please enter serial number");
      return;
    }
    if (isMountingBracket == null) {
      EcomHelper.showInfoMessage("Please answer if mounting bracket was used");
      return;
    }
    if (manufacturer == null) {
      EcomHelper.showInfoMessage("Please choose manufacturer");
      return;
    }
    if (model == null) {
      EcomHelper.showInfoMessage("Please choose model");
      return;
    }
    updateCorrectorDetails();
    navigation.navigate("CorrectorGateWay",{jobType:jobType});
   

  };
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    fetchManufacturersForMeterType('4').then(data => {
      console.log("---------------1-----------------corrector details", data)
      setManufacturers(data.map(manufacturer => ({ label: manufacturer.Manufacturer, value: manufacturer.Manufacturer }))); // Assuming data is in the correct format
    }).catch(error => console.error(error));
  }, []);

const onManufacturerChange = async (item) => {
  setManufacturer(item);
  console.log("---------item", item)
  try {
    const modelsData = await fetchModelsForManufacturer('4', item.value); // Assuming item.value contains the manufacturer's identifier
    console.log("corrector-----------", modelsData)
    setModels(modelsData.map((model, index) => ({ label: model.label, value: model.value }))); // Update models based on the selected manufacturer
  } catch (error) {
    console.error("Failed to fetch models for manufacturer:", error);
  }
};
  const scanBarcode = () => {
    setIsModal(true);
  };

  const readSerialNumber = (codes) => {
    setIsModal(false);
    setCorrectorSerialNumber(codes.data);
  };


  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={"Corrector Details"}
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
              Corrector Details
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
                  <Text>Corrector Serial Number</Text>
                  <View style={styles.spacer2} />
                  <View style={{ ...styles.row, width: width * 0.35 }}>
                    <TextInput
                      onChangeText={(txt) => {
                        const withSpacesAllowed = txt.toUpperCase();
                          const formattedText = withSpacesAllowed.replace(/[^A-Z0-9]+/g, '');
                          setCorrectorSerialNumber(formattedText);
                      }}
                      style={{
                        ...styles.input,
                        width: width * 0.25,
                        alignSelf: "flex-end",
                      }}
                      value={correctorSerialNumber}
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
                          setIsMountingBracket(true);
                        },
                        () => {
                          setIsMountingBracket(false);
                        },
                      ]}
                      value={
                        isMountingBracket == null
                          ? null
                          : isMountingBracket
                          ? "Yes"
                          : "No"
                      }
                    />
                  </View>
                </View>
              </View>

              <View
                style={{
                  ...styles.row,
                  justifyContent: "flex-start",
                  marginTop: 16,
                }}
              >
                <View style={{ width: width * 0.45 }}>
                  <EcomDropDown
                    width={width * 0.35}
                    value={manufacturer}
                    valueList={manufacturers}
                    placeholder={"Corrector Manufacturer"}
                    onChange={(item) => {
                      console.log("------",item);
                      onManufacturerChange(item)
                    }}
                  />
                </View>

                <EcomDropDown
                  width={width * 0.35}
                  value={model}
                  valueList={models}
                  placeholder={"Corrector model"}
                  onChange={(item) => {
                    console.log(item);
                    setModel(item);
                  }}
                />
              </View>
              <View style={styles.spacer} />
            <InputRowWithTitle
              title1="Uncorrected Reads"
              title2="Corrected Reads"
              onChangeText1={(text) => setUncorrectedReads(text)}
              onChangeText2={(text) => setCorrectedReads(text)}
              placeholder1="Enter Uncorrected Reads"
              placeholder2="Enter Corrected Reads"
              keyboardType1="numeric"
              keyboardType2="numeric"
            />
            </View>
            <View style={styles.spacer} />
            <Text type={TextType.BODY_1}>Picture</Text>
            
            <ImagePickerButton
              onImageSelected={(uri) => setcorrectorImage(uri)}
            />
            {correctorImage && (
              <Image
                source={{ uri: correctorImage }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
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
  image: {
    height: height * 0.25, // Adjust the multiplier to fit your design needs
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
    padding: height * 0.02, // Adjust the multiplier to fit your design needs
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
    minHeight: 40,
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
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  optionContainer: {
    width: width * 0.25, // Adjusted for responsiveness
    marginVertical: height * 0.01, // Adjusted based on screen height
    alignSelf: "flex-start",
  },
  spacer: {
    height: height * 0.02, // Adjusted based on screen height
  },
  spacer2: {
    height: height * 0.01, // Adjusted based on screen height
  },
  closeButtonContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
    // Add any additional styles you need for the close icon
  },
});