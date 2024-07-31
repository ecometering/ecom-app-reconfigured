import { useSQLiteContext } from 'expo-sqlite/next';
import { useRoute } from '@react-navigation/native';
import React, { useState, useEffect, createRef } from 'react';
import {
  View,
  Image,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import EcomDropDown from '../../components/DropDown';
import OptionalButton from '../../components/OptionButton';
import BarcodeScanner from '../../components/BarcodeScanner';
import ImagePickerButton from '../../components/ImagePickerButton';
import TextInput, { TextInputWithTitle } from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { PrimaryColors } from '../../theme/colors';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';
import { validateCorrectorDetails } from './CorrectorDetailsPage.validator';
import correctors from '../../../assets/json/correctors.json';

export default function CorrectorDetailsPage() {
  const route = useRoute();
  const camera = createRef(null);
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();

  const { photos, correctorDetails } = state;

  const { title, photoKey } = route.params;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;

  const [isModal, setIsModal] = useState(false);

  const [selectedImage, setSelectedImage] = useState(existingPhoto || {});



  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      correctorDetails: {
        ...prevState.correctorDetails,
        [name]: value,
      },
    }));
  };

  const handlePhotoSelected = (uri) => {
    setSelectedImage({ title, photoKey, uri });
    setState((prevState) => ({
      ...prevState,
      photos: {
        ...prevState.photos,
        [photoKey]: { title, photoKey, uri },
      },
    }));
  };

  const scanBarcode = () => {
    setIsModal(true);
  };

  const readSerialNumber = (codes) => {
    setIsModal(false);
    if (codes && codes.data) {
      handleInputChange('serialNumber', codes.data.toString());
    }
  };

  const backPressed = async () => {
    goToPreviousStep();
  };

  const nextPressed = async () => {
    const { isValid, message } = validateCorrectorDetails(
      correctorDetails,
      selectedImage
    );

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    goToNextStep();
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
            <View style={styles.border}>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Text>Corrector Serial Number</Text>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TextInput
                      onChangeText={(txt) => {
                        const withSpacesAllowed = txt.toUpperCase();
                        const formattedText = withSpacesAllowed.replace(
                          /[^A-Z0-9]+/g,
                          ''
                        );
                        handleInputChange('serialNumber', formattedText);
                      }}
                      style={{
                        ...styles.input,
                        
                      }}
                      value={correctorDetails.serialNumber}
                    />
                    <Button title="📷" onPress={scanBarcode} />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>Mounting bracket used?</Text>
                  <OptionalButton
                    options={['Yes', 'No']}
                    actions={[
                      () => {
                        handleInputChange('isMountingBracket', true);
                      },
                      () => {
                        handleInputChange('isMountingBracket', false);
                      },
                    ]}
                    value={
                      correctorDetails.isMountingBracket == null
                        ? null
                        : correctorDetails.isMountingBracket
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </View>
              </View>

              <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <EcomDropDown
                  value={correctorDetails.manufacturer}
                  valueList={
                    correctors
                      ? correctors
                          .map(({ Manufacturer }) => ({
                            label: Manufacturer,
                            value: Manufacturer,
                          }))
                          .filter(
                            (v, i, a) =>
                              a.findIndex((t) => t.label === v.label) === i
                          )
                          .sort((a, b) => a.label.localeCompare(b.label))
                      : []
                  }
                  placeholder="Select a Manufacturer"
                  onChange={(item) => {
                    handleInputChange('manufacturer', item);
                  }}
                />

                <EcomDropDown
                  value={correctorDetails.model}
                  valueList={
                    
                    correctorDetails.manufacturer
                      ? correctors
                          .filter(
                            ({ Manufacturer }) =>
                              Manufacturer ===
                              correctorDetails.manufacturer?.value
                          )
                          .map(({ ModelDescription }) => ({
                            label: ModelDescription,
                            value: ModelDescription,
                          }))
                          .filter(
                            (v, i, a) =>
                              a.findIndex((t) => t.label === v.label) === i
                          )
                          .sort((a, b) => a.label.localeCompare(b.label))
                      : []
                  }
                  placeholder="Select Model Code"
                  onChange={(item) => handleInputChange('model', item.value)}
                />
              </View>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <TextInputWithTitle
                    title={'Uncorrected Reads'}
                    value={correctorDetails.uncorrected}
                    keyboardType="numeric"
                    onChangeText={(txt) => {
                      const filteredText = txt.replace(/[^0-9.]/g, '');
                      handleInputChange('uncorrected', filteredText);
                    }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInputWithTitle
                    title={'corrected Reads'}
                    value={correctorDetails.corrected}
                    keyboardType="numeric"
                    onChangeText={(txt) => {
                      const filteredText = txt.replace(/[^0-9.]/g, '');
                      handleInputChange('corrected', filteredText);
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={styles.imagePickerContainer}>
              <View style={styles.body}>
                <Text type="caption" style={styles.text}>
                  Corrector photo
                </Text>
                <ImagePickerButton
                  onImageSelected={handlePhotoSelected}
                  currentImage={selectedImage?.uri}
                />
                {selectedImage?.uri && (
                  <Image
                    source={{ uri: selectedImage?.uri }}
                    style={styles.image}
                  />
                )}
              </View>
            </View>
          </View>

          {isModal && (
            <BarcodeScanner
              setIsModal={setIsModal}
              cameraRef={camera}
              barcodeRecognized={readSerialNumber}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 400,
  },
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: 10,
    gap: 20,
  },
  border: {
    borderWidth: 1,
    borderColor: PrimaryColors.Black,
    padding: 10,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  buttonContainer: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap', // Added to wrap elements on smaller screens
  },
  button: {},
  headerCell: {
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5, // Added for smaller screens
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5, // Added for smaller screens
  },
  optionContainer: {},
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
    // Add any additional styles you need for the close icon
  },
});
