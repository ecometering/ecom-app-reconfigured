import React, { useRef, useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useRoute } from '@react-navigation/native';
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
import TextInput from '../../components/TextInput';
import OptionalButton from '../../components/OptionButton';
import BarcodeScanner from '../../components/BarcodeScanner';
import ImagePickerButton from '../../components/ImagePickerButton';

// Context and Helpers
import EcomHelper from '../../utils/ecomHelper';
import { TextType } from '../../theme/typography';
import { useFormStateContext } from '../../context/AppContext';
import { makeFontSmallerAsTextGrows } from '../../utils/styles';
import { validateDataLoggerDetails } from './DataLoggerDetailsPage.validator';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

export default function DataLoggerDetailsTwoPage() {
  const route = useRoute();
  const camera = useRef(null);
  const db = useSQLiteContext();
  const { title, photoKey } = route.params;
  const { state, setState } = useFormStateContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const { jobID, photos, dataLoggerDetailsTwo } = state;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;

  const [isModal, setIsModal] = useState(false);

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      dataLoggerDetailsTwo: {
        ...prevState.dataLoggerDetailsTwo,
        [name]: value,
      },
    }));
  };

  const handlePhotoSelected = (uri) => {
    setState((prevState) => ({
      ...prevState,
      photos: {
        ...prevState.photos,
        [photoKey]: { title, photoKey, uri },
      },
    }));
  };

  const saveToDatabase = async () => {
    const photosJson = JSON.stringify(photos);
    const dataloggerJson = JSON.stringify(dataLoggerDetailsTwo);
    try {
      await db
        .runAsync(
          'UPDATE Jobs SET photos = ?, dataloggerDetails = ? WHERE id = ?',
          [photosJson, dataloggerJson, jobID]
        )
        .then((result) => {
          console.log('photos saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving photos to database:', error);
    }
  };

  const backPressed = async () => {
    await saveToDatabase();
    goToPreviousStep();
  };

  const nextPressed = async () => {
    const { isValid, message } = validateDataLoggerDetails(
      dataLoggerDetailsTwo,
      existingPhoto
    );

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    await saveToDatabase();
    goToNextStep();
    return;
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
            <Text type={TextType.HEADER_1} style={{ alignSelf: 'center' }}>
              AMR
            </Text>
            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text>Data logger Serial Number</Text>
                <View style={styles.row}>
                  <TextInput
                    onChangeText={(txt) => {
                      const alphanumericRegex = /^[a-z0-9]+$/i;
                      const formattedText = txt.toUpperCase();
                      if (alphanumericRegex.test(formattedText)) {
                        handleInputChange('serialNumber', formattedText);
                      }
                    }}
                    style={{
                      ...styles.input,
                      alignSelf: 'flex-end',
                      fontSize: makeFontSmallerAsTextGrows(
                        dataLoggerDetailsTwo.serialNumber
                      ),
                    }}
                    value={dataLoggerDetailsTwo.serialNumber}
                  />
                  <Button title="📷" onPress={scanBarcode} />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text>{'Mounting bracket used?'}</Text>
                <View>
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
                      dataLoggerDetailsTwo.isMountingBracket == null
                        ? null
                        : dataLoggerDetailsTwo.isMountingBracket
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text>{'Adaptor used'}</Text>
                <View>
                  <OptionalButton
                    options={['Yes', 'No']}
                    actions={[
                      () => {
                        handleInputChange('isAdapter', true);
                      },
                      () => {
                        handleInputChange('isAdapter', false);
                      },
                    ]}
                    value={
                      dataLoggerDetailsTwo.isAdapter == null
                        ? null
                        : dataLoggerDetailsTwo.isAdapter
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text>{'Pulse splitter Used'}</Text>
                <View>
                  <OptionalButton
                    options={['Yes', 'No']}
                    actions={[
                      () => {
                        handleInputChange('isPulseSplitter', true);
                      },
                      () => {
                        handleInputChange('isPulseSplitter', false);
                      },
                    ]}
                    value={
                      dataLoggerDetailsTwo.isPulseSplitter == null
                        ? null
                        : dataLoggerDetailsTwo.isPulseSplitter
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text>Manufacturer</Text>
                <View style={styles.row}>
                  <TextInput
                    onChangeText={(txt) => {
                      handleInputChange('manufacturer', txt);
                    }}
                    value={dataLoggerDetailsTwo.manufacturer}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text>Model</Text>
                <TextInput
                  onChangeText={(txt) => {
                    handleInputChange('model', txt);
                  }}
                  value={dataLoggerDetailsTwo.model}
                />
              </View>
            </View>
            <View
              style={{
                flex: 1,
              }}
            >
              <Text>Logger owner</Text>
              <TextInput
                onChangeText={(txt) => {
                  handleInputChange('loggerOwner', txt);
                }}
                value={dataLoggerDetailsTwo.loggerOwner}
              />
            </View>
            <View style={styles.imagePickerContainer}>
              <View>
                <Text type="caption" style={styles.text}>
                  AMR photo
                </Text>
                <ImagePickerButton
                  onImageSelected={handlePhotoSelected}
                  currentImage={existingPhoto?.uri}
                />
                {existingPhoto?.uri && (
                  <Image
                    source={{ uri: existingPhoto?.uri }}
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
    height: 300,
    width: '100%',
  },
  content: {
    flex: 1,
  },
  body: {
    gap: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
});
