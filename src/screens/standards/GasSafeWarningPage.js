import {
  Text,
  View,
  Modal,
  Image,
  Button,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import SignatureScreen from 'react-native-signature-canvas';

// Components
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import { TextInputWithTitle } from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { PrimaryColors } from '../../theme/colors';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';
import { useSQLiteContext } from 'expo-sqlite/next';
import { validateGasSafeWarning } from './GasSafeWarningPage.validator';

function GasSafeWarningPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const { state, setState } = useFormStateContext();
  const { standardDetails, jobID } = state;

  const [isModal, setIsModal] = useState(false);
  const [isCustomerSign, setIsCustomerSign] = useState(true);

  const db = useSQLiteContext();

  const updateDB = async () => {
    await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
      JSON.stringify(standardDetails),
      jobID,
    ]);
  };

  const handleInputChange = (key, value) => {
    setState({
      ...state,
      standardDetails: {
        ...standardDetails,
        [key]: value,
      },
    });
  };

  const handleOK = (signature) => {
    const base64String = signature.replace('data:image/png;base64,', '');
    setState({
      ...state,
      standardDetails: {
        ...standardDetails,
        ...(isCustomerSign
          ? { customerSign: base64String }
          : { engineerSign: base64String }),
      },
    });
    setIsModal(false);
  };

  const backPressed = () => {
    updateDB();
    goToPreviousStep();
  };

  const nextPressed = async () => {
    const { isValid, message } = validateGasSafeWarning(standardDetails);

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    updateDB();
    goToNextStep();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'Gas Safe Warning Notice'}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView>
          <View style={{ gap: 10 }}>
            <TextInputWithTitle
              title={'Certificate Reference'}
              placeholder={''}
              onChangeText={(txt) => {
                handleInputChange('certificateReference', txt);
              }}
              value={standardDetails?.certificateReference}
            />

            <TextInputWithTitle
              title={'Details of gas EmergencyService Provider REF'}
              placeholder={''}
              onChangeText={(txt) => {
                handleInputChange('emergencyService', txt);
              }}
              value={standardDetails?.emergencyService}
            />

            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                  gap: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    minHeight: 40,
                  }}
                >
                  {'Is the property Rented?'}
                </Text>
                <View style={styles.optionsContainer}>
                  <OptionalButton
                    options={['Yes', 'No']}
                    actions={[
                      () => {
                        handleInputChange('isPropertyRented', true);
                      },
                      () => {
                        handleInputChange('isPropertyRented', false);
                      },
                    ]}
                    value={
                      standardDetails?.isPropertyRented == null
                        ? null
                        : standardDetails?.isPropertyRented
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </View>
              </View>

              <View
                style={{
                  flex: 1,
                  gap: 10,
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    minHeight: 40,
                  }}
                >
                  {'Was Customer available on site'}
                </Text>
                <View style={styles.optionsContainer}>
                  <OptionalButton
                    options={['Yes', 'No']}
                    actions={[
                      () => {
                        handleInputChange('isCustomerAvailable', true);
                      },
                      () => {
                        handleInputChange('isCustomerAvailable', false);
                      },
                    ]}
                    value={
                      standardDetails?.isCustomerAvailable == null
                        ? null
                        : standardDetails?.isCustomerAvailable
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </View>
              </View>
            </View>

            <View>
              {standardDetails?.isCustomerAvailable && (
                <View>
                  <Button
                    title={'Customer Signature'}
                    onPress={() => {
                      setIsModal(true);
                      setIsCustomerSign(true);
                    }}
                  />

                  {standardDetails?.customerSign && (
                    <Image
                      source={{
                        uri: `data:image/png;base64,${standardDetails?.customerSign}`,
                      }}
                      style={styles.signImage}
                    />
                  )}
                </View>
              )}

              <View>
                <Button
                  title={'Engineer Signature'}
                  onPress={() => {
                    setIsModal(true);
                    setIsCustomerSign(false);
                  }}
                />

                <Image
                  source={{
                    uri: `data:image/png;base64,${standardDetails?.engineerSign}`,
                  }}
                  style={styles.signImage}
                />
              </View>
            </View>

            <Modal
              animationType="slide"
              transparent={true}
              visible={isModal}
              onRequestClose={() => {
                setIsModal(!isModal);
              }}
            >
              <View style={styles.modalOverlay}>
                <View style={[styles.modalInnerContainer]}>
                  <View style={{ height: 350 }}>
                    <SignatureScreen
                      onOK={handleOK}
                      webStyle={`.m-signature-pad { ... }`}
                      backgroundColor={PrimaryColors.Sand}
                      scrollable={true}
                    />
                  </View>
                  <Button
                    title="Close"
                    onPress={() => {
                      setIsModal(false);
                    }}
                  />
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalInnerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    left: 20,
    right: 20,
  },
  signImage: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
  },
});

export default GasSafeWarningPage;
