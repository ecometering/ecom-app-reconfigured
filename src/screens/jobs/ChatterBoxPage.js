import { useSQLiteContext } from 'expo-sqlite/next';
import { useRoute } from '@react-navigation/native';
import React, { useContext, useRef, useState } from 'react';
import {
  View,
  Image,
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Dimensions,
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
import { PrimaryColors } from '../../theme/colors';
import { AppContext } from '../../context/AppContext';
import { makeFontSmallerAsTextGrows } from '../../utils/styles';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';

const alphanumericRegex = /^[a-zA-Z0-9]+$/;
const { width, height } = Dimensions.get('window');

export default function ChatterBoxDetailsPage() {
  const route = useRoute();
  const camera = useRef(null);
  const db = useSQLiteContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const {
    jobID,
    photos,
    jobType,
    savePhoto,
    chatterBoxDetails,
    setChatterBoxDetails,
  } = useContext(AppContext);

  const { title, nextScreen, photoKey } = route.params;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;

  const [isModal, setIsModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(existingPhoto || {});
  const [localChatterBoxDetails, setlocalChatterBoxDetails] = useState({} );

  const handleInputChange = (name, value) => {
    setlocalChatterBoxDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePhotoSelected = (uri) => {
    setSelectedImage({ title, photoKey, uri });
    console.log('Photo saved:', { title, photoKey, uri });
  };

  const saveToDatabase = async () => {
    const photosJson = JSON.stringify(photos);
    const chatterBoxJson = JSON.stringify(localChatterBoxDetails);
    try {
      await db
        .runAsync(
          'UPDATE Jobs SET photos = ?, chatterboxDetails = ? WHERE id = ?',
          [photosJson, chatterBoxJson, jobID]
        )
        .then((result) => {
          console.log('photos saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving photos to database:', error);
    }
  };
  console.log('chatterBoxDetailsPage');

  const backPressed = async () => {
    savePhoto(photoKey, selectedImage);
    setChatterBoxDetails(localChatterBoxDetails);
    await saveToDatabase();
    goToPreviousStep();
  };
  console.log(localChatterBoxDetails);

  const nextPressed = async () => {
    if (!selectedImage?.uri) {
      EcomHelper.showInfoMessage('Please choose image');
      return;
    }

    if (
      !localChatterBoxDetails.serialNumber ||
      localChatterBoxDetails.serialNumber === ''
    ) {
      EcomHelper.showInfoMessage('Please enter serial number');
      return;
    }
  
    if (localChatterBoxDetails.manufacturer == null) {
      EcomHelper.showInfoMessage('Please choose manufacturer');
      return;
    }
    if (localChatterBoxDetails.model == null) {
      EcomHelper.showInfoMessage('Please choose model');
      return;
    }
    if (localChatterBoxDetails.loggerOwner == null) {
      EcomHelper.showInfoMessage('Please choose Logger owner');
      return;
    }
    savePhoto(photoKey, selectedImage);
    setChatterBoxDetails(localChatterBoxDetails);
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
              {title}
            </Text>
            <View style={styles.spacer} />
            <View style={styles.border}>
              <View style={styles.row}>
                <View
                  style={{
                    width: width * 0.45,
                    alignSelf: 'flex-end',
                  }}
                >
                  <Text>chatter box Serial Number</Text>
                  <View style={styles.spacer2} />
                  <View style={{ ...styles.row, width: width * 0.35 }}>
                    <TextInput
                      onChangeText={(txt) => {
                        // Define the alphanumeric regular expression
                        const alphanumericRegex = /^[a-z0-9]+$/i;

                        // Capitalize the text
                        const formattedText = txt.toUpperCase();

                        // Check if the formatted text is alphanumeric
                        if (alphanumericRegex.test(formattedText)) {
                          handleInputChange('serialNumber', formattedText);
                        }
                      }}
                      style={{
                        ...styles.input,
                        width: width * 0.25,
                        alignSelf: 'flex-end',
                        fontSize: makeFontSmallerAsTextGrows(
                          localChatterBoxDetails.serialNumber
                        ),
                      }}
                      value={localChatterBoxDetails.serialNumber}
                    />
                    <Button title="📷" onPress={scanBarcode} />
                  </View>
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={{ ...styles.row, justifyContent: 'flex-start' }}>
                <View style={{ width: width * 0.45 }}>
                  <View style={styles.spacer2} />
                  <Text>Manufacturer</Text>
                  <View style={styles.spacer2} />
                  <View style={{ ...styles.row, width: width * 0.35 }}>
                    <TextInput
                      onChangeText={(txt) => {
                        handleInputChange('manufacturer', txt);
                      }}
                      style={{
                        ...styles.input,
                        width: width * 0.25,
                        alignSelf: 'flex-end',
                      }}
                      value={localChatterBoxDetails.manufacturer}
                    />
                  </View>
                </View>
                <View style={{ width: width * 0.45 }}>
                  <View style={styles.spacer2} />
                  <Text>Model</Text>
                  <View style={styles.spacer2} />
                  <View style={{ ...styles.row, width: width * 0.35 }}>
                    <TextInput
                      onChangeText={(txt) => {
                        handleInputChange('model', txt);
                      }}
                      style={{
                        ...styles.input,
                        width: width * 0.25,
                        alignSelf: 'flex-end',
                      }}
                      value={localChatterBoxDetails.model}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.spacer} />
              <View style={{ width: width * 0.4 }}>
                <View style={styles.spacer2} />
                <Text> owner</Text>
                <View style={styles.spacer2} />
                <View style={{ ...styles.row, width: width * 0.35 }}>
                  <TextInput
                    onChangeText={(txt) => {
                      handleInputChange('loggerOwner', txt);
                    }}
                    style={{
                      ...styles.input,
                      width: width * 0.25,
                      alignSelf: 'flex-end',
                    }}
                    value={localChatterBoxDetails.loggerOwner}
                  />
                </View>
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.imagePickerContainer}>
              <View style={styles.body}>
                <Text type="caption" style={styles.text}>
                  chatterbox photo
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
    height: height * 0.25, // Example: Adjust the factor according to your needs
  },
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: width * 0.05,
  },
  border: {
    borderWidth: 1,
    borderColor: PrimaryColors.Black,
    padding: height * 0.02, // Adjusted from unitH to use a percentage of the screen height
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  buttonContainer: {
    width: width * 0.4,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    width: width * 0.2,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
  },
  headerCell: {
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: height * 0.05, // Adjusted
    justifyContent: 'center',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderColor: PrimaryColors.Black,
    minHeight: height * 0.05, // Adjusted
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    width: width * 0.25, // Adjusted
    marginVertical: height * 0.01, // Adjusted
    alignSelf: 'flex-start',
  },
  spacer: {
    height: height * 0.02, // Adjusted
  },
  spacer2: {
    height: height * 0.01, // Adjusted
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
    // Other styles for the close icon
  },
});
