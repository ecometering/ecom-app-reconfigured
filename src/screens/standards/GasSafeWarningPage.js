import {
  Text,
  View,
  Modal,
  Image,
  Button,
  Platform,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useContext, useState } from 'react';
import SignatureScreen from 'react-native-signature-canvas';

// Components
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import { TextInputWithTitle } from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { PrimaryColors } from '../../theme/colors';
import { AppContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const { width, height } = Dimensions.get('window');

function GasSafeWarningPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const appContext = useContext(AppContext);
  const { standardDetails } = appContext || {};

  const [isModal, setIsModal] = useState(false);
  const [isCustomerSign, setIsCustomerSign] = useState(true);

  const handleOK = (signature) => {
    const base64String = signature.replace('data:image/png;base64,', '');

    if (isCustomerSign) {
      appContext.setStandardDetails({
        ...standardDetails,
        customerSign: base64String,
      });
    } else {
      appContext.setStandardDetails({
        ...standardDetails,
        engineerSign: base64String,
      });
    }
    setIsModal(false);
  };

  const backPressed = () => {
    goToPreviousStep();
  };

  const nextPressed = async () => {
    if (standardDetails.certificateReference == null) {
      EcomHelper.showInfoMessage('Please enter Certificate Reference');
      return;
    }
    if (standardDetails.emergencyService == null) {
      EcomHelper.showInfoMessage(
        'Please enter Details of gas EmergencySErvice Provider RED'
      );
      return;
    }
    if (standardDetails.isPropertyRented == null) {
      EcomHelper.showInfoMessage('Please answer if the property is rented');
      return;
    }
    if (standardDetails.isCustomerAvailable == null) {
      EcomHelper.showInfoMessage(
        'Please answer if Customer was available on site'
      );
      return;
    }
    if (
      standardDetails.isCustomerAvailable &&
      standardDetails.customerSign == null
    ) {
      EcomHelper.showInfoMessage('Please check Customer Signature');
      return;
    }
    if (standardDetails.engineerSign == null) {
      EcomHelper.showInfoMessage('Please check Engineer Signature');
      return;
    }

    await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
      JSON.stringify(standardDetails),
      appContext.jobID,
    ]);

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
          <TextInputWithTitle
            title={'Certificate Reference'}
            placeholder={''}
            onChangeText={(txt) => {
              appContext.setStandardDetails({
                ...standardDetails,
                certificateReference: txt,
              });
            }}
            value={standardDetails?.certificateReference}
            containerStyle={styles.inputContainer}
          />

          <TextInputWithTitle
            title={'Details of gas EmergencyService Provider REF'}
            placeholder={''}
            onChangeText={(txt) => {
              appContext.setStandardDetails({
                ...standardDetails,
                emergencyService: txt,
              });
            }}
            value={standardDetails?.emergencyService}
            containerStyle={styles.inputContainer}
          />

          <View
            style={{
              flexDirection: 'row',
              flex: 2,
            }}
          >
            <View
              style={{
                flex: 1,
                gap: 10,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                }}
              >
                {'Is the property Rented?'}
              </Text>
              <View style={styles.optionsContainer}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      appContext.setStandardDetails({
                        ...standardDetails,
                        isPropertyRented: true,
                      });
                    },
                    () => {
                      appContext.setStandardDetails({
                        ...standardDetails,
                        isPropertyRented: false,
                      });
                    },
                  ]}
                  value={
                    appContext.isPropertyRented == null
                      ? null
                      : appContext.isPropertyRented
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
                }}
              >
                {'Was Customer available on site'}
              </Text>
              <View style={styles.optionsContainer}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      appContext.setStandardDetails({
                        ...standardDetails,
                        isCustomerAvailable: true,
                      });
                    },
                    () => {
                      appContext.setStandardDetails({
                        ...standardDetails,
                        isCustomerAvailable: false,
                      });
                    },
                  ]}
                  value={
                    appContext.isCustomerAvailable == null
                      ? null
                      : appContext.isCustomerAvailable
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            </View>
          </View>

          <View style={styles.row}>
            {appContext.isCustomerAvailable && (
              <View>
                <Button
                  title={'Customer Signature'}
                  onPress={() => {
                    setIsModal(true);
                    setIsCustomerSign(true);
                  }}
                />

                {standardDetails.customerSign && (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${standardDetails.customerSign}`,
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
                  uri: `data:image/png;base64,${standardDetails.engineerSign}`,
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
              <View
                style={[
                  styles.modalInnerContainer,
                  { width: width * 0.8, height: height * 0.6 },
                ]}
              >
                <Button
                  title="Close"
                  onPress={() => {
                    setIsModal(false);
                  }}
                />
                <SignatureScreen
                  onOK={handleOK}
                  webStyle={`.m-signature-pad { ... }`}
                  backgroundColor={PrimaryColors.Sand}
                  scrollable={true}
                />
              </View>
            </View>
          </Modal>
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
    paddingHorizontal: width * 0.1,
    alignItems: 'center',
    marginBottom: 20,
  },
  optionTitle: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalInnerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signImage: {
    width: width * 0.8,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 15,
  },
});

export default GasSafeWarningPage;
