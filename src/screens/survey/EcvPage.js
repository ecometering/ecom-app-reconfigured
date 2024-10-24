import React from 'react';
import {
  View,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import Text from '../../components/Text'; // Assuming you have a Text component
import { TextType } from '../../theme/typography';

// Components
import Header from '../../components/Header';
import EcomDropDown from '../../components/DropDown';
import { TextInputWithTitle } from '../../components/TextInput';
import OptionalButton from '../../components/OptionButton';

// Utils & Context
import EcomHelper from '../../utils/ecomHelper';
import { SIZE_LIST } from '../../utils/constant';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';
import { validateEcvDetails } from './EcvPage.validator';

const isIos = Platform.OS === 'ios';

export default function EcvPage() {
  const { state, setState } = useFormStateContext();
  const { ecvDetails } = state;

  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const handleInputChange = (key, value) => {
    setState((prev) => ({
      ...prev,
      ecvDetails: {
        ...prev.ecvDetails,
        [key]: value,
      },
    }));
  };

  const nextPressed = async () => {
    const { isValid, message } = validateEcvDetails(ecvDetails);

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    goToNextStep();
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
        centerText={'ECV Details'}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={isIos ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.questionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Does the ECV exist? *'}
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => handleInputChange('ecvExists', true),
                  () => handleInputChange('ecvExists', false),
                ]}
                value={
                  ecvDetails.ecvExists === undefined
                    ? null
                    : ecvDetails.ecvExists
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            {ecvDetails.ecvExists && (
              <>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <TextInputWithTitle
                      title="ECV Type"
                      value={ecvDetails.type}
                      onChangeText={(txt) => {
                        const withSpecialChars = txt.toUpperCase();
                        const formattedText = withSpecialChars.replace(
                          /[^A-Z0-9"/ ]+/g,
                          ''
                        );
                        handleInputChange('type', formattedText);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <TextInputWithTitle
                      title="ECV height (mm)"
                      value={ecvDetails.height}
                      onChangeText={(txt) => {
                        const numericValue = txt.replace(/[^0-9.]/g, '');
                        handleInputChange('height', numericValue);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <EcomDropDown
                      value={ecvDetails.size}
                      valueList={SIZE_LIST}
                      placeholder="Select size"
                      onChange={(item) => handleInputChange('size', item.value)}
                    />
                  </View>
                </View>
                <View style={styles.row}>
                  <View style={{ flex: 1 }}>
                    <TextInputWithTitle
                      title="Distance from Kiosk wall (mm)"
                      value={ecvDetails.dfkw}
                      onChangeText={(txt) => {
                        const numericValue = txt.replace(/[^0-9.]/g, '');
                        handleInputChange('dfkw', numericValue);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TextInputWithTitle
                      title="Distance from Rear Kiosk wall (mm)"
                      value={ecvDetails.dfrkw}
                      onChangeText={(txt) => {
                        const numericValue = txt.replace(/[^0-9.]/g, '');
                        handleInputChange('dfrkw', numericValue);
                      }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </>
            )}
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
  scrollView: {
    flex: 1,
    width: '100%',
  },
  body: {
    padding: 10,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    marginBottom: 10,
  },
});

