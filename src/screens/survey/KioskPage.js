import { useContext, useRef, useState, useEffect } from "react";
import { useSQLiteContext } from 'expo-sqlite/next';
import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Text,
} from "react-native";
import { TextType } from "../../theme/typography";
import { PrimaryColors } from "../../theme/colors";
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

import { useNavigation, useRoute } from "@react-navigation/native";
import Header from "../../components/Header";
import OptionalButton from "../../components/OptionButton";
import EcomDropDown from "../../components/DropDown";
import TextInput, { TextInputWithTitle } from "../../components/TextInput";
import { AppContext } from "../../context/AppContext";
import EcomHelper from "../../utils/ecomHelper";

const isIos = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

export default function KioskPage() {
  const db = useSQLiteContext();
  const route = useRoute();
  const { title} = route.params;
  const { kioskDetails, setKioskDetails,jobID } = useContext(AppContext);
  const navigation = useNavigation();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const handleInputChange = (key, value) => {
    setKioskDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log("kioskDetails", kioskDetails);
  };
  const saveToDatabase = async () => {
    const kioskJson = JSON.stringify(kioskDetails)
    try {
      await db 
      .runAsync ( 
        'UPDATE Jobs SET kioskDetails =? WHERE id = ?',
        [kioskJson, jobID]
      )
      .then((result) => {
        console.log('Kiosk Details saved to database:', result);
      });
  } catch (error) {
    console.log('Error saving Kiosk details to database:', error);
  }
    };


  const nextPressed = async () => {
    const { type, condition, isWeatherResistant, isLockable, isVegitationFree, isStable, isFloodingFree, isExplosionReliefRoof, height, width, length, isAccessible, isSteps } = kioskDetails;
  
    if (!type) {
      EcomHelper.showInfoMessage("Kiosk Type is required. Please enter the Kiosk Type.");
    } else if (!condition) {
      EcomHelper.showInfoMessage("Kiosk Condition is required. Please enter the Kiosk Condition.");
    } else if (isWeatherResistant === null) {
      EcomHelper.showInfoMessage("Is kiosk weather resistant? Please select an option.");
    } else if (isLockable === null) {
      EcomHelper.showInfoMessage("Is kiosk lockable? Please select an option.");
    } else if (isVegitationFree === null) {
      EcomHelper.showInfoMessage("Is kiosk free of vegetation, trees, etc.? Please select an option.");
    } else if (isStable === null) {
      EcomHelper.showInfoMessage("Is kiosk/housing stable? Please select an option.");
    } else if (isFloodingFree === null) {
      EcomHelper.showInfoMessage("Is kiosk free of flooding? Please select an option.");
    } else if (isExplosionReliefRoof === null) {
      EcomHelper.showInfoMessage("Is kiosk roof an explosion relief roof? Please select an option.");
    } else if (!height) {
      EcomHelper.showInfoMessage("Kiosk height is required. Please enter the kiosk height.");
    } else if (!width) {
      EcomHelper.showInfoMessage("Kiosk width is required. Please enter the kiosk width.");
    } else if (!length) {
      EcomHelper.showInfoMessage("Kiosk length is required. Please enter the kiosk length.");
    } else if (isAccessible === null) {
      EcomHelper.showInfoMessage("Is kiosk easily accessible? Please select an option.");
    } else if (isSteps === null) {
      EcomHelper.showInfoMessage("Are there steps leading up to the kiosk? Please select an option.");
    } else {
      saveToDatabase();
      goToNextStep();
    }
  };

  const backPressed = async () => {
    saveToDatabase();
    goToPreviousStep();
  };

  return (
    <SafeAreaView style={styles.container}>
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
        behavior={isIos ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.body}>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="Kiosk Type"
                  value={kioskDetails.type}
                  onChangeText={(txt) => {
                    const withSpecialChars = txt.toUpperCase();
                    const formattedText = withSpecialChars.replace(/[^A-Z0-9"/ ]+/g, '');
                    handleInputChange('type', formattedText);
                  }}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="Kiosk Condition"
                  value={kioskDetails.condition}
                  onChangeText={(txt) => {
                    const formattedText = txt.replace(/[^A-Za-z]+/g, '');
                    handleInputChange('condition', formattedText);
                  }}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {"Is kiosk weather resistant? *"}
                </Text>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      handleInputChange('isWeatherResistant', true);
                    },
                    () => {
                      handleInputChange('isWeatherResistant', false);
                    }
                  ]}
                  value={
                    kioskDetails.isWeatherResistant === null
                      ? null
                      : kioskDetails.isWeatherResistant
                        ? "Yes"
                        : "No"
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {"Is kiosk lockable? *"}
                </Text>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      handleInputChange('isLockable', true);
                    },
                    () => {
                      handleInputChange('isLockable', false);
                    }
                  ]}
                  value={
                    kioskDetails.isLockable === null
                      ? null
                      : kioskDetails.isLockable
                        ? "Yes"
                        : "No"
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {"Is kiosk free of vegetation, trees, etc.? *"}
                </Text>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      handleInputChange('isVegitationFree', true);
                    },
                    () => {
                      handleInputChange('isVegitationFree', false);
                    }
                  ]}
                  value={
                    kioskDetails.isVegitationFree === null
                      ? null
                      : kioskDetails.isVegitationFree
                        ? "Yes"
                        : "No"
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {"Is kiosk/housing stable? *"}
                </Text>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      handleInputChange('isStable', true);
                    },
                    () => {
                      handleInputChange('isStable', false);
                    }
                  ]}
                  value={
                    kioskDetails.isStable === null
                      ? null
                      : kioskDetails.isStable
                        ? "Yes"
                        : "No"
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {"Is Kiosk Free of Flooding? *"}
                </Text>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      handleInputChange('isFloodingFree', true);
                    },
                    () => {
                      handleInputChange('isFloodingFree', false);
                    }
                  ]}
                  value={
                    kioskDetails.isFloodingFree === null
                      ? null
                      : kioskDetails.isFloodingFree
                        ? "Yes"
                        : "No"
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {"Is kiosk roof an explosion relief roof? *"}
                </Text>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      handleInputChange('isExplosionReliefRoof', true);
                    },
                    () => {
                      handleInputChange('isExplosionReliefRoof', false);
                    }
                  ]}
                  value={
                    kioskDetails.isExplosionReliefRoof === null
                      ? null
                      : kioskDetails.isExplosionReliefRoof
                        ? "Yes"
                        : "No"
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {"Is kiosk easily accessible? *"}
                </Text>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      handleInputChange('isAccessible', true);
                    },
                    () => {
                      handleInputChange('isAccessible', false);
                    }
                  ]}
                  value={
                    kioskDetails.isAccessible === null
                      ? null
                      : kioskDetails.isAccessible
                        ? "Yes"
                        : "No"
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.optionContainer, styles.lastOptionContainer]}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {"Are there steps leading up to the kiosk? *"}
                </Text>
                <OptionalButton
                  options={["Yes", "No"]}
                  actions={[
                    () => {
                      handleInputChange('isSteps', true);
                    },
                    () => {
                      handleInputChange('isSteps', false);
                    }
                  ]}
                  value={
                    kioskDetails.isSteps === null
                      ? null
                      : kioskDetails.isSteps
                        ? "Yes"
                        : "No"
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <Text type={TextType.CAPTION_2} style={styles.sectionTitle}>
              {"Internal Kiosk Dimensions"}
            </Text>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="Height (mm)"
                  value={kioskDetails.height}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, "");
                    handleInputChange('height', numericValue);
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="Width (mm)"
                  value={kioskDetails.width}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, "");
                    handleInputChange('width', numericValue);
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="Length (mm)"
                  value={kioskDetails.length}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, "");
                    handleInputChange('length', numericValue);
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    
    scrollViewContent: {
      paddingBottom: 20,
    },
    body: {
      marginHorizontal: width * 0.05,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    inputContainer: {
      flex: 1,
      marginTop: 8,
      marginLeft: 8,
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      padding: 10,
    },
    optionContainer: {
      flex: 1,
      marginTop: 8,
      marginLeft: 8,
    },
    lastOptionContainer: {
      marginBottom: 10,
    },
    questionText: {
      marginBottom: 5,
    },
    optionalButton: {
      marginTop: 0,
    },
    sectionTitle: {
      marginTop: 10,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 20,
      width: '100%',
      paddingHorizontal: 20,
    },
    actionButton: {
      backgroundColor: PrimaryColors.Blue,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 100,
    },
    buttonText: {
      color: PrimaryColors.White,
      fontSize: 18,
      fontWeight: 'bold',
    },
    confirmText: {
      fontSize: 14,
      color: PrimaryColors.Black,
      paddingHorizontal: 10,
    },
  });