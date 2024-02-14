import React, { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { unitH, unitW, width } from "../../utils/constant";
import Header from "../../components/Header";
import { useNavigation,useRoute } from "@react-navigation/native";
import Text from "../../components/Text";
import { TextType } from "../../theme/typography";
import TextInput from "../../components/TextInput";
import SwitchWithTitle from "../../components/Switch";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";

function AssetTypeSelectionPage() {
  console.log("AssetTypeSelectionPage Mounted"); // Initial render check
  const navigation = useNavigation();
  const route = useRoute();
  const appContext = useContext(AppContext);

  console.log("AppContext Values", appContext); // Log context values

  const { title, nextScreen } = route.params;
  console.log("Title:", title); // Log check
  console.log("Next Screen:", nextScreen); // Log check

  const jobType = appContext.jobType;
  const meterDetails = appContext.meterDetails;

  const [isMeter, setIsMeter] = useState(meterDetails?.isMeter);
  console.log("isMeter State:", isMeter); // State update check

  const [isAmr, setIsAmr] = useState(meterDetails?.isAmr);
  console.log("isAmr State:", isAmr); // State update check

  const [isCorrector, setIsCorrector] = useState(meterDetails?.isCorrector);
  console.log("isCorrector State:", isCorrector); // State update check

  // Removed unused state for clarity

  const backPressed = () => {
    console.log("Back Pressed"); // Event handler check
    appContext.setMeterDetails({
      isMeter: isMeter,
      isAmr: isAmr,
      isCorrector: isCorrector,
    });
    navigation.goBack();
  };

  const nextPressed = () => {
    console.log("Next Pressed"); // Event handler check
    if (!isMeter && !isAmr && !isCorrector) {
      EcomHelper.showInfoMessage(
        "You can move next if at least 1 asset type is selected"
      );
      console.log("No asset type selected"); // Error check
      return;
    }

    appContext.setMeterDetails({
      isMeter: isMeter,
      isAmr: isAmr,
      isCorrector: isCorrector,
    });


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
              value={isMeter}
              onValueChange={(e) => {
                setIsMeter(e);
                console.log("Meter Switch Changed:", e); // State change check
              }}
            />
            <View style={styles.spacer} />
            <SwitchWithTitle
              title={"AMR"}
              value={isAmr}
              onValueChange={(e) => {
                setIsAmr(e);
                console.log("AMR Switch Changed:", e); // State change check
              }}
            />
            <View style={styles.spacer} />
            <SwitchWithTitle
              title={"Corrector"}
              value={isCorrector}
              onValueChange={(e) => {
                setIsCorrector(e);
                console.log("Corrector Switch Changed:", e); // State change check
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
