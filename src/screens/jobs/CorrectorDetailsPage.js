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
} from "react-native";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import {
  METER_MANUFACTURER_LIST,
  METER_MODEL_LIST,
  unitH,
  width,
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
import { openDatabase } from "../../utils/database";
import ImagePickerButton from "../../components/ImagePickerButton";
import * as ExpoImagePicker from "expo-image-picker";
import EcomDropDown from "../../components/DropDown";
import { fetchManufacturersForMeterType, fetchModelsForManufacturer } from "../../utils/database";
const alphanumericRegex = /^[a-zA-Z0-9]+$/;

export default function CorrectorDetailsPage() {
  const appContext = useContext(AppContext);
  const navigation = useNavigation();
  const jobType = appContext.jobType;
  const title = jobType === "Install" ? "New Meter Details" : jobType;
  const meterDetails = appContext.meterDetails;
  const removedMeterDetails = appContext.removedMeterDetails;
  const camera = useRef(null);

  const isPassedRemoval = appContext.passedRemoval;
  const isStartRemoval = appContext.startRemoval;
  console.log(">>> Passed Removal >>>", isPassedRemoval);
  console.log(">>> Start Removal >>>", isStartRemoval);
  console.log("CorrectorDetailsPage");

  const regulatorDetails = appContext.regulatorDetails;
  const [serialNumber, setSerialNumber] = useState('');
  const [isMountingBracket, setIsMountingBracket] = useState(
    regulatorDetails?.isMountingBracket
  );

  const [manufacturer, setManufacturer] = useState(
    regulatorDetails?.manufacturer
  );
  const [model, setModel] = useState(regulatorDetails?.model);
  
  const [selectedImage, setSelectedImage] = useState(
    regulatorDetails?.loggerImage
  );
  const [isModal, setIsModal] = useState(false);
  const [uncorrectedReads, setUncorrectedReads] = useState('');
  const [correctedReads, setCorrectedReads] = useState('');

  const backPressed = () => {
   
      navigation.goBack();
    
  };
  console.log(meterDetails);

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
    if (!serialNumber || serialNumber === "") {
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
    setModels(modelsData.map((model, index) => ({ label: model["Model Code (A0083)"], value: index }))); // Update models based on the selected manufacturer
  } catch (error) {
    console.error("Failed to fetch models for manufacturer:", error);
  }
};
  const scanBarcode = () => {
    setIsModal(true);
  };

  const readSerialNumber = (codes) => {
    setIsModal(false);
    setSerialNumber(codes.data);
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
                        if (alphanumericRegex.test(txt)) {
                          setSerialNumber(txt.toUpperCase());
                        } else {
                          setSerialNumber(txt);
                        }
                      }}
                      style={{
                        ...styles.input,
                        width: width * 0.25,
                        alignSelf: "flex-end",
                      }}
                      value={serialNumber}
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
              onImageSelected={(uri) => setSelectedImage(uri)}
            />
            {selectedImage && (
              <Image
                source={{ uri: selectedImage }}
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
    height: unitH * 200,
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
    padding: unitH * 20,
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
    width: 100,
    marginVertical: unitH * 10,
    alignSelf: "flex-start",
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
    // Other styles for the close icon
  },
});
