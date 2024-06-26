import React, { useContext, useState } from 'react';
import {
  Dimensions,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';
import Header from '../../components/Header';
import { TextInputWithTitle } from '../../components/TextInput';
import OptionalButton from '../../components/OptionButton';
import SignatureScreen from 'react-native-signature-canvas';
import { PrimaryColors } from '../../theme/colors';
import EcomHelper from '../../utils/ecomHelper';
import { AppContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';
const { width, height } = Dimensions.get('window');
function GasSafeWarningPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const appContext = useContext(AppContext);
 const {jobID,photos,savePhoto,standardDetails} = appContext
  const title = "Riddor Report"



  const [certificateReference, setCertificateReference] = useState(
    standardDetails?.certificateReference
  );
  const [emergencyService, setEmergencyService] = useState(
    standardDetails?.emergencyService
  );
  const [isPropertyRented, setIsPropertyRented] = useState(
    standardDetails?.isPropertyRented
  );
  const [isCustomerAvailable, setIsCustomerAvailable] = useState(
    standardDetails?.isCustomerAvailable
  );

  const [isModal, setIsModal] = useState(false);
  const [isCustomerSign, setIsCustomerSign] = useState(true);
  const [customerSign, setCustomerSign] = useState(
    standardDetails?.customerSign
  );
  const [engineerSign, setEngineerSign] = useState(
    standardDetails?.engineerSign
  );

  console.log('GasSafeWarningPage');

  const handleOK = (signature) => {
    const base64String = signature.replace('data:image/png;base64,', '');
    console.log('isCustomerSign', isCustomerSign);
    // Use the base64String as needed
    if (isCustomerSign) {
      setCustomerSign(base64String);
    } else {
      setEngineerSign(base64String);
    }
    console.log(base64String);
    setIsModal(false);
  };

  const backPressed = () => {
    appContext.setStandardDetails({
      ...standardDetails,
      certificateReference: certificateReference,
      emergencyService: emergencyService,
      isPropertyRented: isPropertyRented,
      isCustomerAvailable: isCustomerAvailable,
      engineerSign: engineerSign,
      customerSign: customerSign,
    });
    goToPreviousStep();
  };

  const nextPressed = async () => {
    // validate
    if (certificateReference == null) {
      EcomHelper.showInfoMessage('Please enter Certificate Reference');
      return;
    }
        if (emergencyService == null) {
      EcomHelper.showInfoMessage(
        'Please enter Details of gas EmergencySErvice Provider RED'
      );
      return;
    }
    if (isPropertyRented == null) {
      EcomHelper.showInfoMessage('Please answer if the property is rented');
      return;
    }
    if (isCustomerAvailable == null) {
      EcomHelper.showInfoMessage(
        'Please answer if Customer was available on site'
      );
      return;
    }
    if (isCustomerAvailable && customerSign == null) {
      EcomHelper.showInfoMessage('Please check Customer Signature');
      return;
    }
    if (engineerSign == null) {
      EcomHelper.showInfoMessage('Please check Engineer Signature');
      return;
    }

    const standards = {
      ...standardDetails,
      certificateReference: certificateReference,
      emergencyService: emergencyService,
      isPropertyRented: isPropertyRented,
      isCustomerAvailable: isCustomerAvailable,
      engineerSign: engineerSign,
      customerSign: customerSign,
    };

    appContext.setStandardDetails(standards);
    await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
      JSON.stringify(standards),
      appContext.jobID,
    ]);

    goToNextStep();
  };
  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'Gas Safe Warning Notice'}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={[styles.content, { marginHorizontal: '5%' }]}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView style={styles.content}>
          <TextInputWithTitle
            title={'Certificate Reference'}
            placeholder={''}
            onChangeText={(txt) => {
              setCertificateReference(txt);
            }}
            value={certificateReference}
            containerStyle={styles.inputContainer}
          />
          <View style={styles.spacer} />
         
          
          <TextInputWithTitle
            title={'Details of gas EmergencyService Provider REF'}
            placeholder={''}
            onChangeText={(txt) => {
              setEmergencyService(txt);
            }}
            value={emergencyService}
            containerStyle={styles.inputContainer}
          />
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <View
            style={{
              marginHorizontal: width * 0.05, // Adjusted to create a gap between the sections
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                justifyContent: 'space-between',
                height: height * 0.1,
                width: width * 0.35, // Adjusted width to accommodate the spacer
              }}
            >
              <Text>{'Is the property Rented?'}</Text>
              <View style={styles.spacer2} />
              <View style={styles.optionsContainer}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      setIsPropertyRented(true);
                    },
                    () => {
                      setIsPropertyRented(false);
                    },
                  ]}
                  value={
                    isPropertyRented == null
                      ? null
                      : isPropertyRented
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            </View>

            {/* Spacer View for the gap */}
            <View style={{ width: 20 }}></View>

            <View
              style={{
                justifyContent: 'space-between',
                height: height * 0.1,
                width: width * 0.35, // Adjusted width to match the first section
              }}
            >
              <Text>{'Was Customer available on site'}</Text>
              <View style={styles.spacer2} />
              <View style={styles.optionsContainer}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      setIsCustomerAvailable(true);
                    },
                    () => {
                      setIsCustomerAvailable(false);
                    },
                  ]}
                  value={
                    isCustomerAvailable == null
                      ? null
                      : isCustomerAvailable
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            </View>
          </View>

          <View style={styles.spacer} />
          <View style={styles.row}>
            {isCustomerAvailable && (
              <View>
                <Button
                  title={'Customer Signature'}
                  onPress={() => {
                    setIsModal(true);
                    setIsCustomerSign(true);
                  }}
                />
                <View style={styles.spacer2} />
                {customerSign && (
                  <Image
                    source={{ uri: `data:image/png;base64,${customerSign}` }}
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
              <View style={styles.spacer2} />
              <Image
                source={{ uri: `data:image/png;base64,${engineerSign}` }}
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
