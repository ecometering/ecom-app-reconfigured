import React, { useContext, useState } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
} from "react-native";
import { unitH, width } from "../../utils/constant";
import Header from "../../components/Header";
import { useNavigation } from "@react-navigation/native";
import { TextInputWithTitle } from "../../components/TextInput";
import OptionalButton from "../../components/OptionButton";
import SignatureScreen from "react-native-signature-canvas";
import { PrimaryColors } from "../../theme/colors";
import EcomHelper from "../../utils/ecomHelper";
import { AppContext } from "../../context/AppContext";

function GasSafeWarningPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;
  const title = jobType === "Install" ? "New Meter Details" : jobType;
  const standardDetails = appContext.standardDetails;

  const [certificateReference, setCertificateReference] = useState(
    standardDetails?.certificateReference
  );
  const [engineerId, setEngineerId] = useState(standardDetails?.engineerId);
  const [jobNumber, setJobNumber] = useState(standardDetails?.jobNumber);
  const [emergencyService, setEmergencyService] = useState(
    standardDetails?.emergencyService
  );
  const [isPropertyRented, setIsPropertyRented] = useState(
    standardDetails?.isPropertyRented
  );
  const [isCustomerAvailable, setIsCustomerAvailable] = useState(
    standardDetails?.isCustomerAvailable
  );
                                     
  const [isModal, setIsModal] = useState(false);
  const [isCustomerSign, setIsCustomerSign] = useState(true);
  const [customerSign, setCustomerSign] = useState(
    standardDetails?.customerSign
  );
  const [engineerSign, setEngineerSign] = useState(
    standardDetails?.engineerSign
  );

  console.log("GasSafeWarningPage");

  const handleOK = (signature) => {
    const base64String = signature.replace("data:image/png;base64,", "");
    console.log("isCustomerSign", isCustomerSign);
    // Use the base64String as needed
    if (isCustomerSign) {
      setCustomerSign(base64String);
    } else {
      setEngineerSign(base64String);
    }
    console.log(base64String);
    setIsModal(false);
  };

  const backPressed = () => {
    appContext.setStandardDetails({
      ...standardDetails,
      certificateReference: certificateReference,
      engineerId: engineerId,
      jobNumber: jobNumber,
      emergencyService: emergencyService,
      isPropertyRented: isPropertyRented,
      isCustomerAvailable: isCustomerAvailable,
      engineerSign: engineerSign,
      customerSign: customerSign,
    });
    navigation.goBack();
  };

  const nextPressed = () => {
    // validate
    if (certificateReference == null) {
      EcomHelper.showInfoMessage("Please enter Certificate Reference");
      return;
    }
    if (engineerId == null) {
      EcomHelper.showInfoMessage("Please enter Engineer ID");
      return;
    }
    if (jobNumber == null) {
      EcomHelper.showInfoMessage("Please enter Job Number");
      return;
    }
    if (emergencyService == null) {
      EcomHelper.showInfoMessage(
        "Please enter Details of gas EmergencySErvice Provider RED"
      );
      return;
    }
    if (isPropertyRented == null) {
      EcomHelper.showInfoMessage("Please answer if the property is rented");
      return;
    }
    if (isCustomerAvailable == null) {
      EcomHelper.showInfoMessage(
        "Please answer if Customer was available on site"
      );
      return;
    }
    if (customerSign == null) {
      EcomHelper.showInfoMessage("Please check Customer Signature");
      return;
    }
    if (engineerSign == null) {
      EcomHelper.showInfoMessage("Please check Engineer Signature");
      return;
    }

    appContext.setStandardDetails({
      ...standardDetails,
      certificateReference: certificateReference,
      engineerId: engineerId,
      jobNumber: jobNumber,
      emergencyService: emergencyService,
      isPropertyRented: isPropertyRented,
      isCustomerAvailable: isCustomerAvailable,
      engineerSign: engineerSign,
      customerSign: customerSign,
    });

    navigation.navigate("CompositeLabelPhoto");
  };
  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={"Gas Safe Warning Notice"}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={[styles.content,{marginHorizontal:'5%'}]}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView style={styles.content}>
          <TextInputWithTitle
            title={"Certificate Reference"}
            placeholder={""}
            onChangeText={(txt) => {
              setCertificateReference(txt);
            }}
            value={certificateReference}
            containerStyle={styles.inputContainer}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Engineers ID"}
            placeholder={""}
            value={engineerId}
            onChangeText={(txt) => {
              setEngineerId(txt);
            }}
            containerStyle={styles.inputContainer}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Job Number"}
            placeholder={""}
            value={jobNumber}
            onChangeText={(txt) => {
              setJobNumber(txt);
            }}
            containerStyle={styles.inputContainer}
          />
          <View style={styles.spacer} />
          <TextInputWithTitle
            title={"Details of gas EmergencyService Provider REF"}
            placeholder={""}
            onChangeText={(txt) => {
              setEmergencyService(txt);
            }}
            value={emergencyService}
            containerStyle={styles.inputContainer}
          />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View
            style={{
              marginHorizontal: width * 0.1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                justifyContent: "space-between",
                height: unitH * 80,
                width: width * 0.4,
              }}
            >
              <Text>{"Is the property Rented?"}</Text>
              <View style={styles.spacer2} />
              <View style={styles.optionContainer}>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      setIsPropertyRented(true);
                    },
                    () => {
                      setIsPropertyRented(false);
                    },
                  ]}
                  value={
                    isPropertyRented == null
                      ? null
                      : isPropertyRented
                      ? "Yes"
                      : "No"
                  }
                />
              </View>
            </View>

            <View
              style={{
                justifyContent: "space-between",
                height: unitH * 80,
                width: width * 0.4,
              }}
            >
              <Text>{"Was Customer available on site"}</Text>
              <View style={styles.spacer2} />
              <View style={styles.optionContainer}>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      setIsCustomerAvailable(true);
                    },
                    () => {
                      setIsCustomerAvailable(false);
                    },
                  ]}
                  value={
                    isCustomerAvailable == null
                      ? null
                      : isCustomerAvailable
                      ? "Yes"
                      : "No"
                  }
                />
              </View>
            </View>
          </View>
          
          <View style={styles.spacer} />
          <View style={styles.row}>
            <View>
              <Button
                title={"Customer Signature"}
                onPress={() => {
                  setIsModal(true);
                  setIsCustomerSign(true);
                }}
              />
              <View style={styles.spacer2} />
              {customerSign && (
                <Image
                  source={{ uri: `data:image/png;base64,${customerSign}` }}
                  style={styles.signImage}
                />
              )}
            </View>

            <View>
              <Button
                title={"Engineer Signature"}
                onPress={() => {
                  setIsModal(true);
                  setIsCustomerSign(false);
                }}
              />
              <View style={styles.spacer2} />
              <Image
                source={{ uri: `data:image/png;base64,${engineerSign}` }}
                style={styles.signImage}
              />
            </View>
          </View>
          <Modal visible={isModal}>
            <Button
              title="Close"
              onPress={() => {
                setIsModal(false);
              }}
            />
            <View
              style={{
               flex:1
              }}
            >
              <SignatureScreen
                onOK={handleOK}
                webStyle={ `.m-signature-pad {
                  box-shadow: none; border: none;
                  margin-left: 0px;
                  margin-top: 0px;
                } 
                 .m-signature-pad--body
                  canvas {
                    background-color: #E5E5F1;
                  }
                .m-signature-pad--body 
                .m-signature-pad--footer {display: none; margin: 0px;}
                body,html {
                   width: 100%; 
                   height: 68%;
                }`}
                backgroundColor={PrimaryColors.Sand}
                scrollable={true}
              />
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 0.1,
    alignItems: "center",
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 16,
  },
  signatureSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  signImage: {
    width: width * 0.8,
    height: 150,
    resizeMode: "contain",
    marginVertical: 15,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GasSafeWarningPage;
