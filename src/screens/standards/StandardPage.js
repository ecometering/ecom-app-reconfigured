import {
  View,
  Image,
  Modal,
  Button,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useContext, useState } from 'react';
import SignatureScreen from 'react-native-signature-canvas';

import { isIos } from '../../utils/constant';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import { TextInputWithTitle } from '../../components/TextInput';

// Context
import { AppContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';

// Utils
import EcomHelper from '../../utils/ecomHelper';
import { PrimaryColors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');
function StandardPage() {
  const appContext = useContext(AppContext);
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const title = 'Standard Details';
  const { standardDetails, meterDetails, jobID, setStandardDetails,jobType } =
    appContext;

  const riddorReportable =
    standardDetails?.riddorReportable == null
      ? meterDetails?.isStandard
      : standardDetails?.riddorReportable;

  const [isModal, setIsModal] = useState(false);

  const handleOK = (signature) => {
    const base64String = signature.replace('data:image/png;base64,', '');
    setStandardDetails((curState) => ({
      ...curState,
      signature: base64String,
    }));
    setIsModal(false);
  };

  const nextPressed = async () => {
    const meterDetailsUpdate = {
      ...meterDetails,
      isStandard: riddorReportable,
    };
    // console.log('Standard Details before JSON:', standards);
    // console.log('Meter Details before JSON:', meterDetailsUpdate);

    try {
      if (standardDetails?.conformStandard == null) {
        EcomHelper.showInfoMessage(
          'Please answer if the network service/ECV conform to standards'
        );
        return;
      }

      if (standardDetails?.pressure == null) {
        EcomHelper.showInfoMessage('Please set inlet pressure');
        return;
      }

      if (standardDetails?.signature == null) {
        EcomHelper.showInfoMessage('Please enter signature');
        return;
      }
      if (riddorReportable == null) {
        EcomHelper.showInfoMessage('Please answer if RIDDOR reportable');
        return;
      }
      if (meterDetails?.isMeter) {
        if (jobType === 'Install' || jobType === 'Exchange') {
          if (standardDetails?.testPassed == null) {
            EcomHelper.showInfoMessage('Please answer if tightness test passed');
            return;
          }
          if (standardDetails?.useOutlet == null) {
            EcomHelper.showInfoMessage('Please answer if Outlet kit is used');
            return;
          }
        }
      }

      await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
        JSON.stringify(),
        jobID,
      ]);

      appContext.setMeterDetails(meterDetailsUpdate);

      await db.runAsync('UPDATE Jobs SET meterDetails = ? WHERE id = ?', [
        JSON.stringify(meterDetailsUpdate),
        jobID,
      ]);

      setStandardDetails(standardDetails);
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
        centerText={title}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={isIos ? 'padding' : null}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.spacer} />
          <View style={styles.body}>
            <View style={styles.spacer} />
            <Text>Does the network service /ECV conform to standards</Text>
            <View style={styles.optionContainer}>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    setStandardDetails((curState) => ({
                      ...curState,
                      conformStandard: true,
                    }));
                  },
                  () => {
                    setStandardDetails((curState) => ({
                      ...curState,
                      conformStandard: false,
                    }));
                  },
                ]}
                value={
                  standardDetails?.conformStandard == null
                    ? null
                    : standardDetails?.conformStandard
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
            <View style={styles.spacer} />
            <Text>RIDDOR reportable</Text>
            <View style={styles.optionContainer}>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    setStandardDetails((curState) => ({
                      ...curState,
                      riddorReportable: true,
                    }));
                  },
                  () => {
                    setStandardDetails((curState) => ({
                      ...curState,
                      riddorReportable: false,
                    }));
                  },
                ]}
                value={
                  riddorReportable == null
                    ? null
                    : riddorReportable
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
            <View style={styles.spacer} />
            <View style={styles.container}>
            {jobType !=="Survey" && (
              <>
                  <View style={styles.spacer} />
            <Text>Any Additional materials used</Text>
            <View style={styles.optionContainer}>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    setStandardDetails((curState) => ({
                      ...curState,
                      additionalMaterials: true,
                    }));
                  },
                  () => {
                    setStandardDetails((curState) => ({
                      ...curState,
                      additionalMaterials: false,
                    }));
                  },
                ]}
                value={
                  standardDetails?.additionalMaterials == null
                    ? null
                    : standardDetails?.additionalMaterials
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
            <View style={styles.spacer} />
            <Text>Any chatterBox installed</Text>
            <View style={styles.optionContainer}>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    setStandardDetails((curState) => ({
                      ...curState,
                      chatterbox: true,
                    }));
                  },
                  () => {
                    setStandardDetails((curState) => ({
                      ...curState,
                      chatterbox: false,
                    }));
                  },
                ]}
                value={
                  standardDetails?.chatterbox == null
                    ? null
                    : standardDetails?.chatterbox
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
              
              </>
            )}
            </View>
            <View style={styles.spacer} />
            <View style={styles.container}>
              {meterDetails?.isMeter  && (jobType === 'Install' || jobType === 'Exchange') && (
                <>
                  <Text>Outlet kit been used</Text>
                  <View style={styles.optionContainer}>
                    <OptionalButton
                      options={['Yes', 'No']}
                      actions={[
                        () =>
                          setStandardDetails((curState) => ({
                            ...curState,
                            useOutlet: true,
                          })),
                        () =>
                          setStandardDetails((curState) => ({
                            ...curState,
                            useOutlet: false,
                          })),
                      ]}
                      value={
                        standardDetails?.useOutlet == null
                          ? null
                          : standardDetails?.useOutlet
                          ? 'Yes'
                          : 'No'
                      }
                    />
                  </View>
              
                  <View style={styles.spacer} />
                  <Text>Tightness test passed</Text>
                  <View style={styles.optionContainer}>
                    <OptionalButton
                      options={['Yes', 'No']}
                      actions={[
                        () =>
                          setStandardDetails((curState) => ({
                            ...curState,
                            testPassed: true,
                          })),
                        () =>
                          setStandardDetails((curState) => ({
                            ...curState,
                            testPassed: false,
                          })),
                      ]}
                      value={
                        standardDetails?.testPassed == null
                          ? null
                          : standardDetails?.testPassed
                          ? 'Yes'
                          : 'No'
                      }
                    />
                  </View>
                </>
              )}
            </View>

            <View style={styles.spacer} />
            <TextInputWithTitle
              title={'Inlet Pressure'}
              width={'100%'}
              value={standardDetails?.pressure}
              onChange={(event) => {
                // its sendign native event with numeric keyboard
                setStandardDetails((curState) => ({
                  ...curState,
                  pressure: event.nativeEvent.text,
                }));
              }}
              keyboardType="numeric"
            />

            <View style={styles.spacer} />
            <TextInputWithTitle
              title={'Notes'}
              value={standardDetails?.conformText}
              onChangeText={(text) => {
                setStandardDetails((curState) => ({
                  ...curState,
                  conformText: text,
                }));
              }}
              style={{
                ...styles.input,
                width: '100%',
                height: height * 0.2,
              }}
              multiline={true}
            />
            <View style={styles.spacer} />
            <Text>
              I confirm that all works have been carried out in accordance with
              current industry standards and health safety policies
            </Text>
            <View style={styles.spacer} />
            <View>
              <Button
                title={'Signature'}
                onPress={() => {
                  setIsModal(true);
                }}
              />
              <View style={styles.spacer} />
              {standardDetails?.signature && (
                <Image
                  source={{
                    uri: `data:image/png;base64,${standardDetails?.signature}`,
                  }}
                  style={styles.signImage}
                />
              )}
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center', // Centers the modal content vertically
    alignItems: 'center', // Centers the modal content horizontally
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalInnerContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signatureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signImage: {
    width: width * 0.8,
    height: height * 0.2,
    alignSelf: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.4, // Adjusted for responsiveness
  },
});

export default StandardPage;
