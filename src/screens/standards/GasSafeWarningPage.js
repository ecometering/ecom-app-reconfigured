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
  const [customerEmail, setCustomerEmail] = useState(
    standardDetails?.customerEmail
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
      customerEmail: customerEmail,
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
    if (customerEmail == null) {
      EcomHelper.showInfoMessage("Please enter customer email");
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
      customerEmail: customerEmail,
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
        centerText={title}
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
          <TextInputWithTitle
            title={"Customer Email Address"}
            keyboardType="email-address"
            placeholder={""}
            onChangeText={(txt) => {
              setCustomerEmail(txt);
            }}
            value={customerEmail}
            containerStyle={styles.inputContainer}
          />
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
                webStyle={`
                  .m-signature-pad--body {height: 250px;}
                `}
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
  row: {
    // width: width * 0.8,
    alignSelf: "center",
    flexDirection: "row",
  },
  content: {
    flex: 1,
   
  },
  inputContainer: {
    width: '100%',
    alignSelf: "center",
  },
  input: {
    width: "45%",
    alignSelf: "center",
  },
  contactContainer: {
    width: "80%",
    alignSelf: "center",
    alignItems: "flex-start",
  },
  contactContent: {
    // flex: 1,
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  signature: {
    width: width * 0.8,
    height: 150,
    borderWidth: 1,
    borderColor: PrimaryColors.Black,
  },
  optionContainer: {
    width: 100,
    justifyContent: "space-between",
  },
  spacer: {
    height: unitH * 20,
  },
  spacer2: {
    height: 10,
  },
  signImage: { width: unitH * 150, height: unitH * 75, alignSelf: "center" },
});

export default GasSafeWarningPage;
