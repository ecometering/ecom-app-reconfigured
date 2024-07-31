import React, { useRef, useState,useEffect } from 'react';
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
import { validateDataLoggerDetails } from './DataLoggerDetailsPage.validator';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

export default function DataLoggerDetailsPage() {
  const route = useRoute();
  const camera = useRef(null);
  const { title, photoKey } = route.params;
  const { state, setState } = useFormStateContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const { photos, dataLoggerDetails,jobType } = state;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;

  const [isModal, setIsModal] = useState(false);

  console.log({ dataLoggerDetails });

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      dataLoggerDetails: {
        ...prevState.dataLoggerDetails,
        [name]: value,
      },
    }));
  };
  useEffect(() => {
    if (!dataLoggerDetails.loggerOwner){
      if (['Install', 'Maintenance'].includes(jobType)) {
        handleInputChange('loggerOwner','Eco Metering Solutions')}}
  })

  const handlePhotoSelected = (uri) => {
    setState((prevState) => ({
      ...prevState,
      photos: {
        ...prevState.photos,
        [photoKey]: { title, photoKey, uri },
      },
    }));
  };

  const backPressed = async () => {
    goToPreviousStep();
  };

  const nextPressed = async () => {
    const { isValid, message } = validateDataLoggerDetails(
      dataLoggerDetails,
      existingPhoto
    );

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

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
                      
                    }}
                    value={dataLoggerDetails.serialNumber}
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
                      dataLoggerDetails.isMountingBracket == null
                        ? null
                        : dataLoggerDetails.isMountingBracket
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
                      dataLoggerDetails.isAdapter == null
                        ? null
                        : dataLoggerDetails.isAdapter
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
                      dataLoggerDetails.isPulseSplitter == null
                        ? null
                        : dataLoggerDetails.isPulseSplitter
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
                      const formattedText = txt.toUpperCase();
                      const filteredText = formattedText.replace(/[^a-zA-Z ]/g, '');
                      handleInputChange('manufacturer', filteredText);
                    }}
                    value={dataLoggerDetails.manufacturer}
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
                    const formattedText = txt.toUpperCase();
                    const filteredText = formattedText.replace(/[^a-zA-Z0-9\-\s]/g, '');
                    handleInputChange('model', filteredText);
                  }}
                  value={dataLoggerDetails.model}
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
                value={dataLoggerDetails.loggerOwner}
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
