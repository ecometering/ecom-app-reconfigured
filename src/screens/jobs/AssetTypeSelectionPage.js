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
  const navigation = useNavigation();
  const { params } = useRoute();
  const { setMeterDetails, jobType, meterDetails } = useContext(AppContext);

  // Destructuring parameters directly to ensure they're accessed consistently
  const { title, nextScreen } = params;

  // State initialization
  const [isMeter, setIsMeter] = useState(meterDetails?.isMeter ?? false);
  const [isAmr, setIsAmr] = useState(meterDetails?.isAmr ?? false);
  const [isCorrector, setIsCorrector] = useState(meterDetails?.isCorrector ?? false);

  
console.log("Next Screen:", nextScreen); // Log check
console.log("jobType:", jobType); // Log check

const backPressed = () => {
    console.log("Back Pressed"); // Event handler check
    setMeterDetails({ isMeter, isAmr, isCorrector });
    navigation.goBack();
  };

  const nextPressed = () => {
    console.log("Next Pressed"); // Event handler check
    if (!isMeter && !isAmr && !isCorrector) {
      EcomHelper.showInfoMessage("You must select at least one asset type to proceed.");
      return;
  }

    setMeterDetails({ isMeter, isAmr, isCorrector });
  navigation.navigate(nextScreen, { ...params, meterDetails });


    // Navigate to the determined screen


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
