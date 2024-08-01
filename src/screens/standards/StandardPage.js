import {
  View,
  Image,
  Modal,
  Button,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import SignatureScreen from 'react-native-signature-canvas';

import { isIos } from '../../utils/constant';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import { TextInputWithTitle } from '../../components/TextInput';

// Context
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

// Utils
import EcomHelper from '../../utils/ecomHelper';
import { PrimaryColors } from '../../theme/colors';
import { validateStandardDetails } from './StandardPage.validator';

function StandardPage() {
  const signatureWidth = EcomHelper.getSignatureWidth();
  const { state, setState } = useFormStateContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { standards, meterDetails, jobType } = state;

  const [isModal, setIsModal] = useState(false);

  const handleOK = (signature) => {
    const base64String = signature.replace('data:image/png;base64,', '');
    setState((prevState) => ({
      ...prevState,
      standards: {
        ...prevState.standards,
        signature: base64String,
      },
    }));
    setIsModal(false);
  };

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      standards: {
        ...prevState.standards,
        [name]: value,
      },
    }));
  };

  const nextPressed = async () => {
    const { isValid, message } = validateStandardDetails(
      standards,
      meterDetails,
      jobType
    );

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    try {
      goToNextStep();
    } catch (error) {
      console.error('Error updating job details:', error);
      EcomHelper.showInfoMessage(
        'Error updating job details. Please try again.'
      );
    }
  };

  const backPressed = () => {
    goToPreviousStep();
  };

  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'Standard Details'}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={isIos ? 'padding' : null}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.body}>
            {[
              {
                key: 'conformStandard',
                question: 'Does the network service /ECV conform to standards',
                options: ['Yes', 'No'],
                extra: () => {
                  if (standards?.conformStandard === false) {
                    return (
                      <TextInputWithTitle
                        title={
                          'ECV Reference '
                        }
                        placeholder={''}
                        value={standards?.ecvRef}
                        onChangeText={(txt) => {
                          const withSpacesAllowed = txt.toUpperCase();
                        const formattedText = withSpacesAllowed.replace(
                          /[^A-Z0-9]+/g,
                          ''
                        );
                          handleInputChange('ecvRef', formattedText);
                        }}
                      />
                    );
                  }
                },
              },
              {
                key: 'riddorReportable',
                question: 'RIDDOR reportable',
                options: ['Yes', 'No'],
              },
              ...(jobType !== 'Survey'
                ? [
                    {
                      key: 'additionalMaterials',
                      question: 'Any Additional materials used',
                      options: ['Yes', 'No'],
                    },
                    ...(jobType === 'Install' || jobType === 'Exchange'? [
                    {
                      key: 'chatterbox',
                      question: 'Any chatterBox installed',
                      options: ['Yes', 'No'],
                    },
                  ]:[])
                  ]
                : []),
              ...(meterDetails?.isMeter &&
              (jobType === 'Install' || jobType === 'Exchange')
                ? [
                    {
                      key: 'useOutlet',
                      question: 'Outlet kit been used',
                      options: ['Yes', 'No'],
                    },
                    {
                      key: 'testPassed',
                      question: 'Tightness test passed',
                      options: ['Yes', 'No'],
                    },
                  ]
                : []),
            ].map((item) => {
              return (
                <View
                  style={{
                    gap: 10,
                  }}
                  key={item?.key}
                >
                  <Text>{item?.question}</Text>
                  <View style={styles.optionContainer}>
                    <OptionalButton
                      options={item?.options}
                      actions={[
                        () => {
                          handleInputChange(item?.key, true);
                        },
                        () => {
                          handleInputChange(item?.key, false);
                        },
                      ]}
                      value={
                        standards?.[item?.key] === undefined
                          ? null
                          : standards?.[item?.key]
                          ? item?.options[0]
                          : item?.options[1]
                      }
                    />
                  </View>
                  {item?.extra && item?.extra()}
                </View>
              );
            })}

            <TextInputWithTitle
              title={'Inlet Pressure'}
              value={standards?.pressure}
              onChange={(event) => {
                // its sendign native event with numeric keyboard
                handleInputChange('pressure', event.nativeEvent.text);
              }}
              keyboardType="numeric"
            />

            <TextInputWithTitle
              title={'Notes'}
              value={standards?.conformText}
              onChangeText={(text) => {
                handleInputChange('conformText', text);
              }}
              style={{ height: 200 }}
              multiline={true}
            />

            <Text>
              I confirm that all works have been carried out in accordance with
              current industry standards and health safety policies
            </Text>

            <View>
              <Button
                title={'Signature'}
                onPress={() => {
                  setIsModal(true);
                }}
              />

              {standards?.signature && (
                <Image
                  source={{
                    uri: `data:image/png;base64,${standards?.signature}`,
                  }}
                  style={styles.signImage}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModal}
        onRequestClose={() => {
          setIsModal(!isModal);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalInnerContainer}>
            <SignatureScreen
              onOK={handleOK}
              webStyle={`
                .m-signature-pad { box-shadow: none; border: none; width: ${signatureWidth}; height: 70%; } 
                .m-signature-pad--body { border: none; }
                .m-signature-pad--footer { margin: 0px; }
                body, html { width: 100%; height: 100%;}
              `}
              backgroundColor={PrimaryColors.Sand}
              style={styles.signatureCanvas}
              webviewContainerStyle={styles.webviewContainer}
            />
            <Button
              title="Close"
              onPress={() => {
                setIsModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  body: {
    gap: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInnerContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signatureCanvas: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: PrimaryColors.Sand,
    borderRadius: 10,
  },
  signImage: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
  },
  webviewContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: PrimaryColors.Sand,
    borderRadius: 10,
  },
});
export default StandardPage;
