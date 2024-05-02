import React, { useContext } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { unitH, width } from "../../utils/constant";
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import Text from "../../components/Text";
import { TextType } from "../../theme/typography";
import SwitchWithTitle from "../../components/Switch";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";

function AssetTypeSelectionPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { title, nextScreen,  } = route.params;

  const { setMeterDetails, jobType, meterDetails,jobID } = useContext(AppContext);

  // Destructuring parameters directly to ensure they're accessed consistently
const saveToDatabase = async () => {
  const meterDetailsJson = JSON.stringify(meterDetails);
  try {
    await db.runAsync(
      'UPDATE Jobs SET meterDetails = ? WHERE id = ?',
      [meterDetailsJson, jobID],
    )
    .then((result) => {
      console.log('meterDetails saved to database:', result);
    });
  } catch (error) {
    console.log('Error saving meterDetails to database:', error);
  }
};


  const handleInputChange = (name, value) => {
    setMeterDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const backPressed = () => {
    console.log("Back Pressed");
    saveToDatabase();
    navigation.goBack();
  };

  const nextPressed = () => {
    console.log("Next Pressed");
    const { isMeter, isAmr, isCorrector } = meterDetails;

    if (!isMeter && !isAmr && !isCorrector) {
      EcomHelper.showInfoMessage("You must select at least one asset type to proceed.");
      return;
    }

    console.log("Meter Details:", { isMeter, isAmr, isCorrector });
   saveToDatabase();
    navigation.navigate(nextScreen);
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
            <Text type={TextType.CAPTION_3}>{jobType}</Text>
            <SwitchWithTitle
              title={"Meter"}
              value={meterDetails.isMeter}
              onValueChange={(e) => {
                handleInputChange('isMeter', e);
                console.log("Meter Switch Changed:", e);
              }}
            />
            <View style={styles.spacer} />
            <SwitchWithTitle
              title={"AMR"}
              value={meterDetails.isAmr}
              onValueChange={(e) => {
                handleInputChange('isAmr', e);
                console.log("AMR Switch Changed:", e);
              }}
            />
            <View style={styles.spacer} />
            <SwitchWithTitle
              title={"Corrector"}
              value={meterDetails.isCorrector}
              onValueChange={(e) => {
                handleInputChange('isCorrector', e);
                console.log("Corrector Switch Changed:", e);
              }}
            />
            <View style={styles.spacer} />
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
    flex: 1,
    marginHorizontal: width * 0.1,
  },
  spacer: {
    height: unitH * 20,
  },
});

export default AssetTypeSelectionPage;