import React, { useContext, useState } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { isIos, unitH, width } from "../../utils/constant";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import Text from "../../components/Text";
import OptionalButton from "../../components/OptionButton";
import TextInput, { TextInputWithTitle } from "../../components/TextInput";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import { PrimaryColors } from "../../theme/colors";
import SignatureScreen from "react-native-signature-canvas";

function StandardPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;
  const standardDetails = appContext.standardDetails;
  const meterDetails = appContext.meterDetails;
  const title = "Standard Details";

  const [testPassed, setTestPassed] = useState(standardDetails?.testPassed);
  const [confirmStandard, setConfirmStandard] = useState(
    standardDetails?.confirmStandard
  );
  const [riddorReportable, setRiddorReportable] = useState(
    standardDetails?.riddorReportable == null
      ? meterDetails?.isStandard
      : standardDetails?.riddorReportable
  );
  const [useOutlet, setUseOutlet] = useState(standardDetails?.useOutlet);
  const [pressure, setPressure] = useState(standardDetails?.pressure);
  const [confirmText, setConfirmText] = useState(standardDetails?.confirmText);
  const [signature, setSignature] = useState(standardDetails?.signature);
  const [isModal, setIsModal] = useState(false);

  console.log("StandardPage");

  const handleOK = (signature) => {
    const base64String = signature.replace("data:image/png;base64,", "");
    setSignature(base64String);
    console.log(base64String);
    setIsModal(false);
  };

  const nextPressed = () => {
    if (testPassed == null) {
      EcomHelper.showInfoMessage("Please answer if tightness test passed");
      return;
    }
    if (confirmStandard == null) {
      EcomHelper.showInfoMessage(
        "Please answer if the network service/ECV confirm to standards"
      );
      return;
    }
    if (riddorReportable == null) {
      EcomHelper.showInfoMessage("Please answer if RIDDOR reportable");
      return;
    }
    if (useOutlet == null) {
      EcomHelper.showInfoMessage("Please answer if Outlet kit is used");
      return;
    }
    if (pressure == null) {
      EcomHelper.showInfoMessage("Please set inlet pressure");
      return;
    }
   
    if (signature == null) {
      EcomHelper.showInfoMessage("Please enter signature");
      return;
    }

    appContext.setStandardDetails({
      ...standardDetails,
      testPassed: testPassed,
      confirmStandard: confirmStandard,
      riddorReportable: riddorReportable,
      useOutlet: useOutlet,
      pressure: pressure,
      confirmText: confirmText,
      signature,
    });
    appContext.setMeterDetails({
      ...meterDetails,
      isStandard: riddorReportable,
    });

    if (riddorReportable === true) {
      navigation.navigate("RiddorReportPage");
    } else {
      if (confirmStandard === true) {
        navigation.navigate("SnClientInfoPage");
      } else {
        navigation.navigate("CompositeLabelPage");
      }
    }
  };
  const backPressed = () => {
    appContext.setStandardDetails({
      ...standardDetails,
      testPassed: testPassed,
      confirmStandard: confirmStandard,
      riddorReportable: riddorReportable,
      useOutlet: useOutlet,
      pressure: pressure,
      confirmText: confirmText,
      signature,
    });

    navigation.goBack();
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
        behavior={isIos ? "padding" : null}
      >
        <ScrollView style={styles.content}>
          <View style={styles.spacer} />
          <View style={styles.body}>
            <Text>Tightness test passed</Text>
            <View style={styles.optionContainer}>
              <OptionalButton
                options={["Yes", "No"]}
                actions={[
                  () => {
                    setTestPassed(true);
                  },
                  () => {
                    setTestPassed(false);
                  },
                ]}
                value={testPassed == null ? null : testPassed ? "Yes" : "No"}
              />
            </View>
            <View style={styles.spacer} />
            <Text>Does the network service /ECV confirm to standards</Text>
            <View style={styles.optionContainer}>
              <OptionalButton
                options={["Yes", "No"]}
                actions={[
                  () => {
                    setConfirmStandard(true);
                  },
                  () => {
                    setConfirmStandard(false);
                  },
                ]}
                value={
                  confirmStandard == null
                    ? null
                    : confirmStandard
                    ? "Yes"
                    : "No"
                }
              />
            </View>
            <View style={styles.spacer} />
            <Text>RIDDOR reportable</Text>
            <View style={styles.optionContainer}>
              <OptionalButton
                options={["Yes", "No"]}
                actions={[
                  () => {
                    setRiddorReportable(true);
                  },
                  () => {
                    setRiddorReportable(false);
                  },
                ]}
                value={
                  riddorReportable == null
                    ? null
                    : riddorReportable
                    ? "Yes"
                    : "No"
                }
              />
            </View>
            <View style={styles.spacer} />
            <Text>Outlet kit be used</Text>
            <View style={styles.optionContainer}>
              <OptionalButton
                options={["Yes", "No"]}
                actions={[
                  () => {
                    setUseOutlet(true);
                  },
                  () => {
                    setUseOutlet(false);
                  },
                ]}
                value={useOutlet == null ? null : useOutlet ? "Yes" : "No"}
              />
            </View>
            <View style={styles.spacer} />
           
              <TextInputWithTitle
                title={"Inlet Pressure"}
                width={'100%'}
                value={pressure}
                onChange={(item) => {
                  setPressure(item);
                }}
                keyboardType='numeric'
              />
              
              <View style={styles.spacer} />
          <TextInputWithTitle
                title={"Notes"}
                value={confirmText}
                onChangeText={(text) => {
                  setConfirmText(text);
                }}
                style={{
                  ...styles.input,
                  width:"100%",
                  height: unitH * 150,
                }}
                multiline={true}
              />
            <View style={styles.spacer} />
            <Text>{`I confirm that all works have been carried out in 
accordance with current industry standards and 
health safety policies`}</Text>
            
          
              
          

            <View style={styles.spacer} />
            <View>
              <Button
                title={"Signature"}
                onPress={() => {
                  setIsModal(true);
                }}
              />
              <View style={styles.spacer} />
              {signature && (
                <Image
                  source={{ uri: `data:image/png;base64,${signature}` }}
                  style={styles.signImage}
                />
              )}
            </View>

            <Modal style={{flex:1}} visible={isModal}>
            <Button
                title="Close"
                onPress={() => {
                  setIsModal(false);
                }}
              />
              <View style={{flex:1, backgroundColor:'red'}}>

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

          </View>
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
    marginHorizontal: width * 0.1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: width * 0.35,
    alignSelf: "center",
    height: unitH * 40,
  },
  optionContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: width * 0.35,
  },
  spacer: {
    height: unitH * 20,
  },
  signImage: { width: unitH * 380, height: unitH * 150, alignSelf: "center" },
});

export default StandardPage;
