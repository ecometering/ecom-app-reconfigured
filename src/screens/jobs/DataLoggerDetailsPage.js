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
import { useNavigation } from "@react-navigation/native";
import Text from "../../components/Text";
import TextInput from "../../components/TextInput";
import OptionalButton from "../../components/OptionButton";
import { TextType } from "../../theme/typography";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import BarcodeScanner from "../../components/BarcodeScanner";
import { PrimaryColors } from "../../theme/colors";
import ImagePickerButton from "../../components/ImagePickerButton";


const alphanumericRegex = /^[a-zA-Z0-9]+$/;
const { width, height } = Dimensions.get("window");
export default function DataLoggerDetailsPage() {

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
  console.log("DataLoggerDetailsPage");

  const regulatorDetails = appContext.regulatorDetails;
  const [serialNumber, setSerialNumber] = useState(
    regulatorDetails?.loggerSerialNumber
  );
  const [isMountingBracket, setIsMountingBracket] = useState(
    regulatorDetails?.isMountingBracket
  );
  const [isAdapter, setIsAdapter] = useState(regulatorDetails?.isAdapter);
  const [isPulseSplitter, setIsPulseSplitter] = useState(
    regulatorDetails?.isPulseSplitter
  );
  const [manufacturer, setManufacturer] = useState(
    regulatorDetails?.manufacturer
  );
  const [model, setModel] = useState(regulatorDetails?.model);
  const [loggerOwner, setLoggerOwner] = useState(regulatorDetails?.loggerOwner);
  const [dataloggerImage, setdataloggerImage] = useState(
    regulatorDetails?.loggerImage
  );
  const [isModal, setIsModal] = useState(false);

  const backPressed = () => {
    
      navigation.goBack();
  
    // navigation.goBack();
  };
  console.log(meterDetails);

  const nextPressed = async () => {
    if (!dataloggerImage) {
      EcomHelper.showInfoMessage("Please choose image");
      return;
    }
    try {
      const response = await fetch(dataloggerImage);
      const blob = await response.blob();
      appContext.setBlobs(prev => [ ...prev, blob ])
    }
    catch(err) {
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
    if (isAdapter == null) {
      EcomHelper.showInfoMessage("Please answer if adapter was used");
      return;
    }
    if (isPulseSplitter == null) {
      EcomHelper.showInfoMessage("Please answer if pulse splitter was used");
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
    if (loggerOwner == null) {
      EcomHelper.showInfoMessage("Please choose Logger owner");
      return;
    }
   
          navigation.navigate("DataloggerGateWay");
        
        return;
      }


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
                        if (alphanumericRegex.test(txt)) setSerialNumber(txt);
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
              <View style={styles.spacer} />
              <View style={{ ...styles.row, justifyContent: "flex-start" }}>
                <View style={{ width: width * 0.45 }}>
                  <Text>{"Adaptor used"}</Text>
                  <View style={styles.optionContainer}>
                    <OptionalButton
                      options={["Yes", "No"]}
                      actions={[
                        () => {
                          setIsAdapter(true);
                        },
                        () => {
                          setIsAdapter(false);
                        },
                      ]}
                      value={
                        isAdapter == null ? null : isAdapter ? "Yes" : "No"
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
                          setIsPulseSplitter(true);
                        },
                        () => {
                          setIsPulseSplitter(false);
                        },
                      ]}
                      value={
                        isPulseSplitter == null
                          ? null
                          : isPulseSplitter
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
                        setManufacturer(txt);
                      }}
                      style={{
                        ...styles.input,
                        width: width * 0.25,
                        alignSelf: "flex-end",
                      }}
                      value={manufacturer}
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
                        setModel(txt);
                      }}
                      style={{
                        ...styles.input,
                        width: width * 0.25,
                        alignSelf: "flex-end",
                      }}
                      value={model}
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
                      setLoggerOwner(txt);
                    }}
                    style={{
                      ...styles.input,
                      width: width * 0.25,
                      alignSelf: "flex-end",
                    }}
                    value={loggerOwner}
                  />
                </View>
              </View>
            </View>
            <View style={styles.spacer} />
            <Text type={TextType.BODY_1}>Picture</Text>
            {dataloggerImage && (
              <Image
                source={{ uri: dataloggerImage }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            <View style={styles.row}>
            <ImagePickerButton
              onImageSelected={(uri) => setdataloggerImage(uri)}
            />
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