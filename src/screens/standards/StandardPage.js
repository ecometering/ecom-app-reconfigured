import React, { useContext, useState } from 'react';
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import { isIos } from '../../utils/constant';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import Text from '../../components/Text';
import OptionalButton from '../../components/OptionButton';
import TextInput, { TextInputWithTitle } from '../../components/TextInput';
import { AppContext } from '../../context/AppContext';
import EcomHelper from '../../utils/ecomHelper';
import { PrimaryColors } from '../../theme/colors';
import SignatureScreen from 'react-native-signature-canvas';

const { width, height } = Dimensions.get('window');
function StandardPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;
  const { standardDetails, meterDetails, jobID } = appContext;
  const title = 'Standard Details';

  const [testPassed, setTestPassed] = useState(standardDetails?.testPassed);
  const [conformStandard, setconformStandard] = useState(
    standardDetails?.conformStandard
  );
  const [riddorReportable, setRiddorReportable] = useState(
    standardDetails?.riddorReportable == null
      ? meterDetails?.isStandard
      : standardDetails?.riddorReportable
  );
  const [useOutlet, setUseOutlet] = useState(standardDetails?.useOutlet);
  const [pressure, setPressure] = useState(standardDetails?.pressure);
  const [conformText, setconformText] = useState(standardDetails?.conformText);
  const [signature, setSignature] = useState(standardDetails?.signature);
  const [isModal, setIsModal] = useState(false);

  const handleOK = (signature) => {
    const base64String = signature.replace('data:image/png;base64,', '');
    setSignature(base64String);
    console.log(base64String);
    setIsModal(false);
  };

  const nextPressed = async () => {
    const standards = {
      ...standardDetails,
      testPassed: testPassed,
      conformStandard: conformStandard,
      riddorReportable: riddorReportable,
      useOutlet: useOutlet,
      pressure: pressure,
      conformText: conformText,
      signature,
    };

    const meterDetailsUpdate = {
      ...meterDetails,
      isStandard: riddorReportable,
    };
    // console.log('Standard Details before JSON:', standards);
    // console.log('Meter Details before JSON:', meterDetailsUpdate);

    try {
      if (conformStandard == null) {
        EcomHelper.showInfoMessage(
          'Please answer if the network service/ECV conform to standards'
        );
        return;
      }

      if (pressure == null) {
        EcomHelper.showInfoMessage('Please set inlet pressure');
        return;
      }

      if (signature == null) {
        EcomHelper.showInfoMessage('Please enter signature');
        return;
      }
      if (riddorReportable == null) {
        EcomHelper.showInfoMessage('Please answer if RIDDOR reportable');
        return;
      }
      if (meterDetails?.isMeter) {
        if (testPassed == null) {
          EcomHelper.showInfoMessage('Please answer if tightness test passed');
          return;
        }

        if (useOutlet == null) {
          EcomHelper.showInfoMessage('Please answer if Outlet kit is used');
          return;
        }
      }

      appContext.setStandardDetails(standards);
      await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
        JSON.stringify(standards),
        jobID,
      ]);

      appContext.setMeterDetails(meterDetailsUpdate);

      await db.runAsync('UPDATE Jobs SET meterDetails = ? WHERE id = ?', [
        JSON.stringify(meterDetailsUpdate),
        jobID,
      ]);

      if (riddorReportable === true) {
        navigation.navigate('RiddorReportPage');
      } else {
        if (conformStandard === false) {
          navigation.navigate('SnClientInfoPage');
        } else {
          navigation.navigate('CompositeLabelPhoto');
        }
      }
    } catch (error) {
      console.error('Error updating job details:', error);
      EcomHelper.showInfoMessage(
        'Error updating job details. Please try again.'
      );
    }
  };

  const backPressed = () => {
    appContext.setStandardDetails({
      ...standardDetails,
      testPassed: testPassed,
      conformStandard: conformStandard,
      riddorReportable: riddorReportable,
      useOutlet: useOutlet,
      pressure: pressure,
      conformText: conformText,
      signature,
    });

    navigation.goBack();
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
                    setconformStandard(true);
                  },
                  () => {
                    setconformStandard(false);
                  },
                ]}
                value={
                  conformStandard == null
                    ? null
                    : conformStandard
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
                    setRiddorReportable(true);
                  },
                  () => {
                    setRiddorReportable(false);
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
              {meterDetails?.isMeter && (
                <>
                  <Text>Outlet kit be used</Text>
                  <View style={styles.optionContainer}>
                    <OptionalButton
                      options={['Yes', 'No']}
                      actions={[
                        () => setUseOutlet(true),
                        () => setUseOutlet(false),
                      ]}
                      value={
                        useOutlet == null ? null : useOutlet ? 'Yes' : 'No'
                      }
                    />
                  </View>
                  <View style={styles.spacer} />
                  <Text>Tightness test passed</Text>
                  <View style={styles.optionContainer}>
                    <OptionalButton
                      options={['Yes', 'No']}
                      actions={[
                        () => setTestPassed(true),
                        () => setTestPassed(false),
                      ]}
                      value={
                        testPassed == null ? null : testPassed ? 'Yes' : 'No'
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
              value={pressure}
              onChange={(event) => {
                // its sendign native event with numeric keyboard
                setPressure(event.nativeEvent.text);
              }}
              keyboardType="numeric"
            />

            <View style={styles.spacer} />
            <TextInputWithTitle
              title={'Notes'}
              value={conformText}
              onChangeText={(text) => {
                setconformText(text);
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
              {signature && (
                <Image
                  source={{ uri: `data:image/png;base64,${signature}` }}
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
