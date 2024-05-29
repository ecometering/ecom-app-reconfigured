import { useContext, useRef, useState, useEffect } from 'react';
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
} from 'react-native';
import { TextType } from '../../theme/typography';
import { PrimaryColors } from '../../theme/colors';

import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import EcomDropDown from '../../components/DropDown';
import TextInput, { TextInputWithTitle } from '../../components/TextInput';
import { AppContext } from '../../context/AppContext';
import EcomHelper from '../../utils/ecomHelper';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';
const isIos = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
import { useSQLiteContext } from 'expo-sqlite/next';
export default function VentsDetailsPage() {
  const route = useRoute();
  const { title} = route.params;
  const { ventDetails, setVentDetails } = useContext(AppContext);
  const navigation = useNavigation();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const handleInputChange = (key, value) => {
    setVentDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log('ventDetails', ventDetails);
  };
  const saveToDatabase = async () => {
    const kioskJson = JSON.stringify(kioskDetails)
    try {
      await db 
      .runAsync ( 
        'UPDATE Jobs SET kioskDetails =? WHERE id = ?',
        [kioskJson, job.id]
      )
      .then((result) => {
        console.log('Kiosk Details saved to database:', result);
      });
  } catch (error) {
    console.log('Error saving Kiosk details to database:', error);
  }
    };
  const nextPressed = async () => {
    const {
      type,
      condition,
      isWeatherResistant,
      isLockable,
      isVegitationFree,
      isStable,
      isFloodingFree,
      isExplosionReliefRoof,
      height,
      width,
      length,
      isAccessible,
      isSteps,
    } = ventDetails;

    if (!type) {
      EcomHelper.showInfoMessage(
        'vent Type is required. Please enter the vent Type.'
      );
    } else if (!condition) {
      EcomHelper.showInfoMessage(
        'vent Condition is required. Please enter the vent Condition.'
      );
    } else if (isWeatherResistant === null) {
      EcomHelper.showInfoMessage(
        'Is vent weather resistant? Please select an option.'
      );
    } else if (isLockable === null) {
      EcomHelper.showInfoMessage('Is vent lockable? Please select an option.');
    } else if (isVegitationFree === null) {
      EcomHelper.showInfoMessage(
        'Is vent free of vegetation, trees, etc.? Please select an option.'
      );
    } else if (isStable === null) {
      EcomHelper.showInfoMessage(
        'Is vent/housing stable? Please select an option.'
      );
    } else if (isFloodingFree === null) {
      EcomHelper.showInfoMessage(
        'Is vent free of flooding? Please select an option.'
      );
    } else if (isExplosionReliefRoof === null) {
      EcomHelper.showInfoMessage(
        'Is vent roof an explosion relief roof? Please select an option.'
      );
    } else if (!height) {
      EcomHelper.showInfoMessage(
        'vent height is required. Please enter the vent height.'
      );
    } else if (!width) {
      EcomHelper.showInfoMessage(
        'vent width is required. Please enter the vent width.'
      );
    } else if (!length) {
      EcomHelper.showInfoMessage(
        'vent length is required. Please enter the vent length.'
      );
    } else if (isAccessible === null) {
      EcomHelper.showInfoMessage(
        'Is vent easily accessible? Please select an option.'
      );
    } else if (isSteps === null) {
      EcomHelper.showInfoMessage(
        'Are there steps leading up to the vent? Please select an option.'
      );
    } else {
      goToNextStep();
    }
  };

  const backPressed = async () => {
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
        behavior={isIos ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.body}>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="vent Type"
                  value={ventDetails.type}
                  onChangeText={(txt) => {
                    const withSpecialChars = txt.toUpperCase();
                    const formattedText = withSpecialChars.replace(
                      /[^A-Z0-9"/ ]+/g,
                      ''
                    );
                    handleInputChange('type', formattedText);
                  }}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="vent Condition"
                  value={ventDetails.condition}
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
                  {'Is vent weather resistant? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isWeatherResistant', true);
                    },
                    () => {
                      handleInputChange('isWeatherResistant', false);
                    },
                  ]}
                  value={
                    ventDetails.isWeatherResistant === null
                      ? null
                      : ventDetails.isWeatherResistant
                      ? 'Yes'
                      : 'No'
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {'Is vent lockable? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isLockable', true);
                    },
                    () => {
                      handleInputChange('isLockable', false);
                    },
                  ]}
                  value={
                    ventDetails.isLockable === null
                      ? null
                      : ventDetails.isLockable
                      ? 'Yes'
                      : 'No'
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {'Is vent free of vegetation, trees, etc.? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isVegitationFree', true);
                    },
                    () => {
                      handleInputChange('isVegitationFree', false);
                    },
                  ]}
                  value={
                    ventDetails.isVegitationFree === null
                      ? null
                      : ventDetails.isVegitationFree
                      ? 'Yes'
                      : 'No'
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {'Is vent/housing stable? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isStable', true);
                    },
                    () => {
                      handleInputChange('isStable', false);
                    },
                  ]}
                  value={
                    ventDetails.isStable === null
                      ? null
                      : ventDetails.isStable
                      ? 'Yes'
                      : 'No'
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {'Is vent Free of Flooding? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isFloodingFree', true);
                    },
                    () => {
                      handleInputChange('isFloodingFree', false);
                    },
                  ]}
                  value={
                    ventDetails.isFloodingFree === null
                      ? null
                      : ventDetails.isFloodingFree
                      ? 'Yes'
                      : 'No'
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {'Is vent roof an explosion relief roof? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isExplosionReliefRoof', true);
                    },
                    () => {
                      handleInputChange('isExplosionReliefRoof', false);
                    },
                  ]}
                  value={
                    ventDetails.isExplosionReliefRoof === null
                      ? null
                      : ventDetails.isExplosionReliefRoof
                      ? 'Yes'
                      : 'No'
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.optionContainer}>
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {'Is vent easily accessible? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isAccessible', true);
                    },
                    () => {
                      handleInputChange('isAccessible', false);
                    },
                  ]}
                  value={
                    ventDetails.isAccessible === null
                      ? null
                      : ventDetails.isAccessible
                      ? 'Yes'
                      : 'No'
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View
                style={[styles.optionContainer, styles.lastOptionContainer]}
              >
                <Text type={TextType.CAPTION_2} style={styles.questionText}>
                  {'Are there steps leading up to the vent? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange('isSteps', true);
                    },
                    () => {
                      handleInputChange('isSteps', false);
                    },
                  ]}
                  value={
                    ventDetails.isSteps === null
                      ? null
                      : ventDetails.isSteps
                      ? 'Yes'
                      : 'No'
                  }
                  style={styles.optionalButton}
                />
              </View>
            </View>
            <Text type={TextType.CAPTION_2} style={styles.sectionTitle}>
              {'Internal vent Dimensions'}
            </Text>
            <View style={styles.row}>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="Height (cm)"
                  value={ventDetails.height}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('height', numericValue);
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="Width (cm)"
                  value={ventDetails.width}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('width', numericValue);
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
              <View style={styles.inputContainer}>
                <TextInputWithTitle
                  title="Length (cm)"
                  value={ventDetails.length}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
