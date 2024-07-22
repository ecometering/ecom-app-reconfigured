import React, { useRef, useState } from 'react';
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
import BarcodeScanner from '../../components/BarcodeScanner';
import ImagePickerButton from '../../components/ImagePickerButton';

// Context and Helpers
import EcomHelper from '../../utils/ecomHelper';
import { TextType } from '../../theme/typography';
import { useFormStateContext } from '../../context/AppContext';
import { validateChatterBox } from './ChatterBoxPage.validator';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

export default function ChatterBoxDetailsPage() {
  const route = useRoute();
  const camera = useRef(null);
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const { state, setState } = useFormStateContext();
  const { photos, chatterBoxDetails } = state;

  const { title, photoKey } = route.params;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;

  const [isModal, setIsModal] = useState(false);

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      chatterBoxDetails: {
        ...prevState.chatterBoxDetails,
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

  const backPressed = async () => {
    goToPreviousStep();
  };

  const nextPressed = async () => {
    const { isValid, message } = validateChatterBox(
      chatterBoxDetails,
      existingPhoto
    );

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    goToNextStep();
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
            <Text type={TextType.HEADER_1}>{title}</Text>

            <View>
              <Text>Chatter box Serial Number</Text>
              <View style={styles.row}>
                <TextInput
                  onChangeText={(txt) => {
                    const alphanumericRegex = /^[a-z0-9]+$/i;
                    const formattedText = txt.toUpperCase();
                    if (
                      alphanumericRegex.test(formattedText) ||
                      formattedText === ''
                    ) {
                      handleInputChange('serialNumber', formattedText);
                    }
                  }}
                  value={chatterBoxDetails.serialNumber}
                />
                <Button title="📷" onPress={scanBarcode} />
              </View>
            </View>

            <View>
              <Text>Manufacturer</Text>
              <View>
                <TextInput
                  onChangeText={(txt) => {
                    handleInputChange('manufacturer', txt);
                  }}
                  value={chatterBoxDetails.manufacturer}
                />
              </View>
            </View>

            <View>
              <Text>Model</Text>
              <View>
                <TextInput
                  onChangeText={(txt) => {
                    handleInputChange('model', txt);
                  }}
                  value={chatterBoxDetails.model}
                />
              </View>
            </View>

            <View>
              <Text>Owner</Text>
              <View>
                <TextInput
                  onChangeText={(txt) => {
                    handleInputChange('loggerOwner', txt);
                  }}
                  value={chatterBoxDetails.loggerOwner}
                />
              </View>
            </View>

            <View style={styles.imagePickerContainer}>
              <View>
                <Text type="caption" style={styles.text}>
                  Chatterbox photo
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
    padding: 10,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
