import React, { useContext, useState } from "react";
import {
  Alert,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions
} from "react-native";
import Text from "../../components/Text";
import { TextInputWithTitle } from "../../components/TextInput";
import Header from "../../components/Header";
import { useNavigation,useRoute } from "@react-navigation/native";
import OptionalButton from "../../components/OptionButton";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";
import * as ExpoImagePicker from "expo-image-picker";
import ImagePickerButton from "../../components/ImagePickerButton";
const { width, height } = Dimensions.get('window');
import { openDatabase,appendPhotoDetail,fetchPhotosJSON } from "../../utils/database";
function SiteQuestionsPage() {
  const navigation = useNavigation();
const route = useRoute();
const { jobId } = route.params;
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

const updateSiteQuestions = async () => {
  const db = await openDatabase();
  const photosJSON = await fetchPhotosJSON(db, jobId);
  const photoDetails = {
    title: "Bypass Image", // Example title, adjust as needed
    uri: byPassImage,
    photoKey: "bypassImage" // Example photoKey, adjust as needed
  };

  // JSONify the photoDetails object
  const photoDetailsJSON = JSON.stringify(photoDetails);
 const updatedPhotosJSON = appendPhotoDetail(photosJSON, photoDetailsJSON);

 const siteQuestionsJSON = JSON.stringify({
  isSafe,
  isGerneric,
  genericReason,
  isCarryOut,
  carryOutReason,
  isFitted,
  isStandard
});

db.transaction(tx => {
  tx.executeSql(
    'UPDATE Jobs SET siteQuestions = ?, photos = ? WHERE id = ?',
    [siteQuestionsJSON, updatedPhotosJSON, jobId],
    (_, result) => {
      console.log('Site questions and photos updated successfully');
      handleNavigationBasedOnConditions();
    },
    (_, error) => {
      console.log('Error updating site questions and photos in database:', error);
    }
  );

  });
};

const nextPressed = async () => {
    console.log("nextPressed invoked.");
  
    // Individual validation checks with specific messages
    if (isSafe === null) {
      EcomHelper.showInfoMessage("Please indicate if the meter location is safe.");
      return;
    }
    if (isGerneric === null) {
      EcomHelper.showInfoMessage("Please indicate if the job is covered by the generic risk assessment.");
      return;
    }
    if (isCarryOut === null) {
      EcomHelper.showInfoMessage("Please indicate if the job can be carried out.");
      return;
    }
    if (isCarryOut === false && (!carryOutReason || carryOutReason.trim().length === 0)) {
      EcomHelper.showInfoMessage("Please indicate why the job can't be carried out.");
      return;
    }  
    if (isFitted === null) {
      EcomHelper.showInfoMessage("Please indicate if a bypass is fitted.");
      return;
    }
    if (isStandard === null) {
      EcomHelper.showInfoMessage("Please indicate if the customer installation conforms to current standards.");
      return;
    }
    // Add additional checks here as needed
  
    // If all checks pass, update meter details in context
    const currentMeterDetails = {
      ...appContext.meterDetails,
      isSafe,
      isGerneric,
      genericReason,
      isCarryOut,
      carryOutReason,
      isFitted,
      isStandard,
      byPassImage,
    };
  
    appContext.setMeterDetails(currentMeterDetails);
    console.log("Meter details updated in context:", currentMeterDetails);
  
    // Continue with conditional navigation based on jobType and conditions
    handleNavigationBasedOnConditions();
};

const handleNavigationBasedOnConditions = () => {
    if (!isSafe || !isStandard) {
      navigation.navigate("StandardPage", { fromPage: "SiteQuestionsPage" });
      console.log("Navigating to StandardPage");
    } else if (!isCarryOut) {
      navigation.navigate("RebookPage", { fromPage: "SiteQuestionsPage" });
      console.log("Navigating to RebookPage");
    } else {
      // Continue with conditional navigation based on jobType
      switch (jobType) {
        case "Warrant":
        case "Removal":
          navigation.navigate("removal", { jobId });
          console.log("Navigating to RemovalFlowNavigator");
          break;
        case "Exchange":
          navigation.navigate("exchange", { jobId });
          console.log("Navigating to ExchangeFlowNavigator");
          break;
        case "Install":
          navigation.navigate("install", { jobId });
          console.log("Navigating to InstallFlowNavigator");
          break;
        case "Maintenance":
          navigation.navigate("maintenance", { jobId });
          console.log("Navigating to MaintenanceFlowNavigator");
          break;
        case "Survey":
          navigation.navigate("survey", { jobId });
          console.log("Navigating to SurveyFlowNavigator");
          break;
        default:
          console.log(`Unknown job type: ${jobType}`);
          // Fallback navigation or error handling
          break;
      }
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
    width: width * 0.25, // Example adjustment, assuming you want the container to be 25% of screen width
    marginVertical: height * 0.01, // Adjusted based on screen height
    alignSelf: "flex-start",
  },
  spacer: {
    height: height * 0.01, // Adjusted based on screen height
  },
  inputContainer: {
    flex: 1,
  },
  image: {
    width: width * 0.5, // Adjusted to be half of screen width
    height: height * 0.25, // Example adjustment, assuming you want the image to be 25% of screen height
    alignSelf: "center",
  },
});

export default SiteQuestionsPage;
