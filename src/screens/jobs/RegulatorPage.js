import {
  Text,
  View,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState, createRef } from 'react';
import { useRoute } from '@react-navigation/native';

// Components
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import EcomDropDown from '../../components/DropDown';
import OptionalButton from '../../components/OptionButton';
import BarcodeScanner from '../../components/BarcodeScanner';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { SIZE_LIST } from '../../utils/constant';
import { validateRegulator } from './RegulatorPage.validator';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

function RegulatorPage() {
  const route = useRoute();
  const camera = createRef(null);

  const { title } = route.params;
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const { state, setState } = useFormStateContext();
  const { regulatorDetails } = state;

  const [isModal, setIsModal] = useState(false);

  const readSerialNumber = (codes) => {
    setIsModal(false);
    if (codes && codes.data) {
      handleInputChange('serialNumber', codes.data.toString());
    }
  };

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      regulatorDetails: {
        ...prevState.regulatorDetails,
        [name]: value,
      },
    }));
  };

  const nextPressed = async () => {
    const { isValid, message } = validateRegulator(regulatorDetails);

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    goToNextStep();
  };

  const backPressed = async () => {
    goToPreviousStep();
  };

  const scanBarcode = () => {
    setIsModal(true);
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
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView style={styles.content}>
          <View style={styles.body}>
            <View>
              <Text style={styles.titleText}>
                Does the serial number exist? *
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => handleInputChange('serialNoExist', true),
                  () => handleInputChange('serialNoExist', false),
                ]}
                value={
                  regulatorDetails.serialNoExist === undefined
                    ? null
                    : regulatorDetails.serialNoExist
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
            {/* Conditionally render Serial Number input if serialNoExist is true */}
            {regulatorDetails.serialNoExist && (
              <View>
                <Text>Regulator Serial Number</Text>
                <View style={styles.row}>
                  <TextInput
                    onChangeText={(txt) => {
                      const withSpacesAllowed = txt.toUpperCase();
                      const formattedText = withSpacesAllowed.replace(
                        /[^A-Z0-9 ]+/g,
                        ''
                      );
                      handleInputChange('serialNumber', formattedText);
                    }}
                    value={regulatorDetails.serialNumber}
                  />
                  <Button title="📷" onPress={scanBarcode} />
                </View>
              </View>
            )}

            {/* Manufacturer and Model */}
            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text>Manufacturer</Text>
                <TextInput
                  value={regulatorDetails.manufacturer}
                  onChangeText={(txt) => {
                    const capitalise = txt.toUpperCase();
                    const filteredText = capitalise.replace(/[^a-zA-Z ]/g, '');
                    handleInputChange('manufacturer', filteredText);
                  }}
                />
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text>Model</Text>
                <TextInput
                  value={regulatorDetails.model}
                  onChangeText={(txt) => {
                    const capitalise = txt.toUpperCase();
                    const formattedText = capitalise.replace(
                      /[^A-Z0-9]+/g,
                      ''
                    );
                    handleInputChange('model', formattedText);
                  }}
                />
              </View>
            </View>

            {/* Size Dropdown */}

            <EcomDropDown
              value={regulatorDetails.size}
              valueList={SIZE_LIST}
              placeholder={'Select Size'}
              onChange={(item) => {
                handleInputChange('size', item);
              }}
            />

            <View>
              <Text style={styles.titleText}>Is the regulator sealed? *</Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => handleInputChange('isSealedRegulator', true),
                  () => handleInputChange('isSealedRegulator', false),
                ]}
                value={
                  regulatorDetails.isSealedRegulator === undefined
                    ? null
                    : regulatorDetails.isSealedRegulator
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View>
              <Text style={styles.titleText}>
                Is the regulator Threaded or flanged? *
              </Text>
              <OptionalButton
                options={['Threaded', 'Flanged']}
                actions={[
                  () => handleInputChange('ConnectionType', true),
                  () => handleInputChange('ConnectionType', false),
                ]}
                value={
                  regulatorDetails.ConnectionType === undefined
                    ? null
                    : regulatorDetails.ConnectionType
                    ? 'Threaded'
                    : 'Flanged'
                }
              />
            </View>

            <View>
              <Text style={styles.titleText}>
                Has the new meter, customer appliances and pipe work been purged
                and relit satisfactorily including a visual inspection? *
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => handleInputChange('isPurged', true),
                  () => handleInputChange('isPurged', false),
                ]}
                value={
                  regulatorDetails.isPurged === undefined
                    ? null
                    : regulatorDetails.isPurged
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={{ gap: 10 }}>
              <Text style={styles.titleText}>
                Is the installation correctly labelled? *
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => handleInputChange('isLabelled', true),
                  () => handleInputChange('isLabelled', false),
                ]}
                value={
                  regulatorDetails.isLabelled === undefined
                    ? null
                    : regulatorDetails.isLabelled
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={{ gap: 10 }}>
              <Text style={styles.titleText}>
                Is there a purpose made ventilation? *
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => handleInputChange('isVentilation', true),
                  () => handleInputChange('isVentilation', false),
                ]}
                value={
                  regulatorDetails.isVentilation === undefined
                    ? null
                    : regulatorDetails.isVentilation
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            {isModal && (
              <BarcodeScanner
                setIsModal={setIsModal}
                cameraRef={camera}
                barcodeRecognized={readSerialNumber}
              />
            )}
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
    padding: 10,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
});

export default RegulatorPage;
