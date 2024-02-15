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
import Text from "../../components/Text";
import { TextInputWithTitle } from "../../components/TextInput";
import Header from "../../components/Header";
import { useNavigation,useRoute } from "@react-navigation/native";
import OptionalButton from "../../components/OptionButton";
import { unitH, width } from "../../utils/constant";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import * as ExpoImagePicker from "expo-image-picker";
import ImagePickerButton from "../../components/ImagePickerButton";
function SiteQuestionsPage() {
  const navigation = useNavigation();

  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;
  console.log("Job Type:", jobType);
  const meterDetails = appContext.meterDetails;
  
  const [isSafe, setIsSafe] = useState(meterDetails?.isSafe);
  const [isGerneric, setIsGerneric] = useState(meterDetails?.isGerneric);
  const [genericReason, setGenericReason] = useState(
    meterDetails?.genericReason
  );
  const [isCarryOut, setIsCarryOut] = useState(meterDetails?.isCarryOut);
  const [carryOutReason, setCarryOutReason] = useState(
    meterDetails?.carryOutReason
  );
  const [isFitted, setIsFitted] = useState(meterDetails?.isFitted);
  const [isStandard, setIsStandard] = useState(meterDetails?.isStandard);

  const [byPassImage, setByPassImage] = useState(meterDetails?.byPassImage);


  const backPressed = () => {
    const currentMeterDetails = {
      ...appContext.meterDetails,
      isSafe: isSafe,
      isGerneric: isGerneric,
      genericReason: genericReason,
      isCarryOut: isCarryOut,
      carryOutReason: carryOutReason,
      isFitted: isFitted,
      isStandard: isStandard,
      byPassImage: byPassImage,
    };
    appContext.setMeterDetails(currentMeterDetails);
    navigation.goBack();
  };

  const nextPressed = async () => {
    console.log("nextPressed invoked.");
  
    // Validation checks
    if (
      isSafe === null ||
      isGerneric === null ||
      isCarryOut === null ||
      isFitted === null ||
      isStandard === null
    ) {
      EcomHelper.showInfoMessage("Please answer all questions");
      console.log("Validation failed: Not all questions answered.");
      return;
    }
  
    // Attempt to upload bypass image if present
  
    // Update meter details in context
    const currentMeterDetails = {
      ...appContext.meterDetails,
      isSafe: isSafe,
      isGerneric: isGerneric,
      genericReason: genericReason,
      isCarryOut: isCarryOut,
      carryOutReason: carryOutReason,
      isFitted: isFitted,
      isStandard: isStandard,
      byPassImage: byPassImage,
    };
  
    appContext.setMeterDetails(currentMeterDetails);
    console.log("Meter details updated in context:", currentMeterDetails);
  
    // Conditional navigation based on jobType
    switch(jobType) {
      case "Warrant":
      case "Removal":
        navigation.navigate("removal");
        console.log("Navigating to RemovalFlowNavigator");
        break;
      case "Exchange":
        navigation.navigate("exchange");
        console.log("Navigating to ExchangeFlowNavigator");
        break;
      case "Install":
        navigation.navigate("install");
        console.log("Navigating to InstallFlowNavigator");
        break;
      case "Maintenance":
        navigation.navigate("maintenance");
        console.log("Navigating to MaintenanceFlowNavigator");
        break;
      case "Survey":
        navigation.navigate("survey");
        console.log("Navigating to SurveyFlowNavigator");
        break;
      default:
        console.log(`Unknown job type: ${jobType}`);
        // Fallback navigation or error handling
        break;
    }
  };  
  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={""}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <ScrollView style={styles.content}>
        <View style={styles.body}>
          <View style={styles.spacer} />
          <Text>
            Is meter location safe and approved for a meter installation to take
            place
          </Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={["Yes", "No"]}
              actions={[
                () => {
                  setIsSafe(true);
                },
                () => {
                  setIsSafe(false);
                },
              ]}
              value={isSafe === null ? null : isSafe ? "Yes" : "No"}
            />
          </View>
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Text>Is the job covered by the generic risk assessment</Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={["Yes", "No"]}
              actions={[
                () => {
                  setIsGerneric(true);
                },
                () => {
                  setIsGerneric(false);
                },
              ]}
              value={isGerneric === null ? null : isGerneric ? "Yes" : "No"}
            />
          </View>
          {!isGerneric && (
            <TextInputWithTitle
              title={
                "Why is this job not covered by the generic risk assesment"
              }
              placeholder={""}
              value={genericReason}
              onChangeText={(txt) => {
                setGenericReason(txt);
              }}
            
            />
          )}
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Text>Can the Job be carried out</Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={["Yes", "No"]}
              actions={[
                () => {
                  setIsCarryOut(true);
                },
                () => {
                  setIsCarryOut(false); //// sub mit "Job as abort"
                },
              ]}
              value={isCarryOut === null ? null : isCarryOut ? "Yes" : "No"}
            />
          </View>
          {!isCarryOut && (
            <TextInputWithTitle
              title={"Why it cant be carried out"}
              placeholder={""}
              value={carryOutReason}
              onChangeText={(txt) => {
                setCarryOutReason(txt);
              }}
              containerStyle={styles.inputContainer}
            />
          )}
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Text>Is a bypass fitted</Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={["Yes", "No"]}
              actions={[
                () => {
                  setIsFitted(true);
                },
                () => {
                  setIsFitted(false);
                },
              ]}
              value={isFitted === null ? null : isFitted ? "Yes" : "No"}
            />
          </View>

          
          
          {isFitted && (
            <View style={styles.imagePickerContainer}>
              <ImagePickerButton
                onImageSelected={(uri) => setByPassImage(uri)}
              />
              {byPassImage && (
                <Image
                  source={{ uri: byPassImage }}
                  style={styles.image}
                />
              )}
            </View>
          )}
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Text>
            Does the Customer installation Pipework and appliances conform to
            current standards
          </Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={["Yes", "No"]}
              actions={[
                () => {
                  setIsStandard(true);
                },
                () => {
                  setIsStandard(false);
                },
              ]}
              value={isStandard === null ? null : isStandard ? "Yes" : "No"}
            />
          </View>
        </View>
      </ScrollView>
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
  optionContainer: {
    width: 100,
    marginVertical: unitH * 10,
    alignSelf: "flex-start",
  },
  spacer: {
    height: unitH * 10,
  },
  inputContainer: {
    flex: 1,
  },
  image: {
    width: 200,
    height:200,
    alignSelf: "center",
  },
});

export default SiteQuestionsPage;
