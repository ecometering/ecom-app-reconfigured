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
  const appContext = useContext(AppContext);
  const{jobDetails,jobType,photos} = appContext;
  console.log("Job Type:", jobType);

  const [siteQuestions, setSiteQuestions] = useState({
    isSafe: "",
    isGeneric: "",
    genericReason: "",
    isCarryOut: "",
    carryOutReason: "", 
    isFitted: "",
    isStandard: "",
  });
  const handleInputChange = (name, value) => {
    setSiteQuestions(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  
  

  const [byPassImage, setByPassImage] = useState(siteQuestions?.byPassImage);


  const backPressed = () => {
    appContext.setSiteQuestions(siteQuestions);
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

 const siteQuestionsJSON = JSON.stringify(siteQuestions);

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
    if (siteQuestions.isSafe === null) {
      EcomHelper.showInfoMessage("Please indicate if the meter location is safe.");
      return;
    }
    if (siteQuestions.isGeneric === null) {
      EcomHelper.showInfoMessage("Please indicate if the job is covered by the generic risk assessment.");
      return;
    }
    if (siteQuestions.isCarryOut === null) {
      EcomHelper.showInfoMessage("Please indicate if the job can be carried out.");
      return;
    }
    if (siteQuestions.carryOutReasonisCarryOut === false && (!siteQuestions.carryOutReason || siteQuestions.carryOutReason.trim().length === 0)) {
      EcomHelper.showInfoMessage("Please indicate why the job can't be carried out.");
      return;
    }  
    if (siteQuestions.isFitted === null) {
      EcomHelper.showInfoMessage("Please indicate if a bypass is fitted.");
      return;
    }
    if (siteQuestions.isStandard === null) {
      EcomHelper.showInfoMessage("Please indicate if the customer installation conforms to current standards.");
      return;
    }
    // Add additional checks here as needed
  
    // If all checks pass, update meter details in context
    appContext.setSiteQuestions(siteQuestions);
    console.log("Site questions updated in context:", appContext);
  
    // Continue with conditional navigation based on jobType and conditions
    handleNavigationBasedOnConditions();
};

const handleNavigationBasedOnConditions = () => {
    if (!siteQuestions.isSafe || !siteQuestions.isStandard) {
      navigation.navigate("StandardPage", { fromPage: "SiteQuestionsPage" });
      console.log("Navigating to StandardPage");
    } else if (!siteQuestions.isCarryOut) {
      navigation.navigate("RebookPage", { fromPage: "SiteQuestionsPage" });
      console.log("Navigating to RebookPage");
    } else {
      // Continue with conditional navigation based on jobType
      switch (jobType) {
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
                  handleInputChange("isSafe", true);
                },
                () => {
                  handleInputChange("isSafe", false);
                },
              ]}
              value={siteQuestions.isSafe === null ? null : siteQuestions.isSafe ? "Yes" : "No"}
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
                  handleInputChange("isGeneric", true);
                },
                () => {
                  handleInputChange("isGeneric", false);
                },
              ]}
              value={siteQuestions.isGeneric === null ? null : siteQuestions.isGeneric ? "Yes" : "No"}
            />
          </View>
          {!siteQuestions.isGeneric && (
            <TextInputWithTitle
              title={
                "Why is this job not covered by the generic risk assesment"
              }
              placeholder={""}
              value={siteQuestions.genericReason}
              onChangeText={(txt) => {
                handleInputChange("genericReason", txt);
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
                  handleInputChange("isCarryOut", true);
                },
                () => {
                  handleInputChange("isCarryOut", false);},
              ]}
              value={siteQuestions.isCarryOut === null ? null : siteQuestions.isCarryOut ? "Yes" : "No"}
            />
          </View>
          {!siteQuestions.isCarryOut && (
            <TextInputWithTitle
              title={"Why it cant be carried out"}
              placeholder={""}
              value={siteQuestions.carryOutReason}
              onChangeText={(txt) => {
                handleInputChange("carryOutReason", txt);
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
                 handleInputChange ("isFitted", true);
                },
                () => {
                  handleInputChange ("isFitted", false);
                },
              ]}
              value={siteQuestions.isFitted === null ? null : siteQuestions.isFitted ? "Yes" : "No"}
            />
          </View>

          
          
          {siteQuestions.isFitted && (
            <View style={styles.imagePickerContainer}>
              <ImagePickerButton
                onImageSelected={(uri) => handleInputChange ("byPassImage", uri)}
              />
              {siteQuestions.byPassImage && (
                <Image
                  source={{ uri: siteQuestions.byPassImage }}
                  style={styles.image}
                  photoKey="bypassImage"
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
                  handleInputChange("isStandard", true);
                },
                () => {
                  handleInputChange("isStandard", false);
                },
              ]}
              value={siteQuestions.isStandard === null ? null : siteQuestions.isStandard ? "Yes" : "No"}
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