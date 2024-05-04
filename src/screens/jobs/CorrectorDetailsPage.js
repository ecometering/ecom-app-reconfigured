import { useSQLiteContext } from 'expo-sqlite/next';
import * as ExpoImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useRef,
  useState,
  useEffect,
  createRef,
  useContext,
} from 'react';
import {
  View,
  Image,
  Alert,
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
import EcomDropDown from '../../components/DropDown';
import OptionalButton from '../../components/OptionButton';
import BarcodeScanner from '../../components/BarcodeScanner';
import ImagePickerButton from '../../components/ImagePickerButton';
import TextInput, {
  InputRowWithTitle,
  TextInputWithTitle,
} from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { tablename } from '../../utils/constant';
import { TextType } from '../../theme/typography';
import { PrimaryColors } from '../../theme/colors';
import { AppContext } from '../../context/AppContext';
import {
  openDatabase,
  fetchPhotosJSON,
  appendPhotoDetail,
} from '../../utils/database';

const alphanumericRegex = /^[a-zA-Z0-9]+$/;
const { width, height } = Dimensions.get('window');

export default function CorrectorDetailsPage() {
  const route = useRoute();
  const db = useSQLiteContext();
  const camera = createRef(null);
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const {
    jobID,
    photos,
    jobType,
    savePhoto,
    correctorDetails,
    setCorrectorDetails,
  } = useContext(AppContext);

  const { title, nextScreen, photoKey } = route.params;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;

  const [models, setModels] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [correctorModelCodes, setCorrectorModelCodes] = useState([]);
  const [localCorrectorDetails, setLocalCorrectorDetails] = useState(
    correctorDetails ?? {}
  );
  const [correctorManufacturers, setCorrectorManufacturers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(existingPhoto || {});

  const handleInputChange = (name, value) => {
    setLocalCorrectorDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    console.log('value updated:', name);
    console.log('value updated:', value);
    console.log('Corrector Details:', localCorrectorDetails);
  };

  const handlePhotoSelected = (uri) => {
    setSelectedImage({ title, photoKey, uri });
    console.log('Photo saved:', { title, photoKey, uri });
  };

  const saveToDatabase = async () => {
    const photosJson = JSON.stringify(photos);
    const correctorJson = JSON.stringify(localCorrectorDetails);
    try {
      await db
        .runAsync(
          'UPDATE Jobs SET photos = ?, correctorDetails = ? WHERE id = ?',
          [photosJson, correctorJson, jobID]
        )
        .then((result) => {
          console.log('photos saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving photos to database:', error);
    }
  };

  async function getCorrectorManufacturers() {
    try {
      const query = `SELECT DISTINCT Manufacturer FROM ${tablename[9]}`;
      const result = await db.getAllAsync(query);
      setCorrectorManufacturers(
        result
          .map((manu) => ({
            label: manu.Manufacturer,
            value: manu.Manufacturer,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    } catch (err) {
      console.error('SQL Error: ', err);
    }
  }

  async function getCorrectorModelCodes() {
    try {
      const query = `SELECT DISTINCT "ModelCode" FROM ${tablename[9]} WHERE Manufacturer = '${localCorrectorDetails.manufacturer}'`;
      const result = await db.getAllAsync(query);
      setCorrectorModelCodes(
        result
          .map((model) => ({
            label: model['ModelCode'],
            value: model['ModelCode'],
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
    } catch (err) {
      console.error('SQL Error: ', err);
    }
  }
  const backPressed = () => {
    saveToDatabase();
    if (selectedImage.uri) savePhoto(photoKey, selectedImage);
    setCorrectorDetails(localCorrectorDetails);
    navigation.goBack();
  };

  const nextPressed = async () => {
    console.log('nextPressed invoked.');
    if (!selectedImage?.uri) {
      EcomHelper.showInfoMessage('Please choose image');
      return;
    }
    if (
      !localCorrectorDetails.serialNumber ||
      localCorrectorDetails.serialNumber === ''
    ) {
      EcomHelper.showInfoMessage('Please enter serial number');
      return;
    }
    if (localCorrectorDetails.isMountingBracket == null) {
      EcomHelper.showInfoMessage('Please answer if mounting bracket was used');
      return;
    }
    if (localCorrectorDetails.manufacturer == null) {
      EcomHelper.showInfoMessage('Please choose manufacturer');
      return;
    }
    if (localCorrectorDetails.model == null) {
      EcomHelper.showInfoMessage('Please choose model');
      return;
    }
    saveToDatabase();
    if (selectedImage.uri) savePhoto(photoKey, selectedImage);
    setCorrectorDetails(localCorrectorDetails);
    navigation.navigate(nextScreen);
  };

  useEffect(() => {
    getCorrectorManufacturers();
  }, [db]);

  useEffect(() => {
    if (localCorrectorDetails.manufacturer) {
      getCorrectorModelCodes();
    }
  }, [db, localCorrectorDetails.manufacturer]);

  const onManufacturerChange = async (item) => {
    handleInputChange('manufacturer', item.value);
    console.log('---------item', item);
    try {
      const modelsData = await fetchModelsForManufacturer('4', item.value); // Assuming item.value contains the manufacturer's identifier
      console.log('corrector-----------', modelsData);
      setCorrectorModelCodes(
        modelsData.map((model, index) => ({
          label: model.label,
          value: model.value,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch models for manufacturer:', error);
    }
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
        centerText={'Corrector Details'}
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
              Corrector Details
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
                  <Text>Corrector Serial Number</Text>
                  <View style={styles.spacer2} />
                  <View style={{ ...styles.row, width: width * 0.35 }}>
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
                        width: width * 0.25,
                        alignSelf: 'flex-end',
                      }}
                      value={localCorrectorDetails.serialNumber}
                    />
                    <Button title="📷" onPress={scanBarcode} />
                  </View>
                </View>
                <View>
                  <Text>{'Mounting bracket used?'}</Text>
                  <View style={styles.optionContainer}>
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
                        localCorrectorDetails.isMountingBracket == null
                          ? null
                          : localCorrectorDetails.isMountingBracket
                          ? 'Yes'
                          : 'No'
                      }
                    />
                  </View>
                </View>
              </View>

              <View
                style={{
                  ...styles.row,
                  justifyContent: 'flex-start',
                  marginTop: 16,
                }}
              >
                <View style={{ width: width * 0.45 }}>
                  <EcomDropDown
                    width={width * 0.35}
                    value={localCorrectorDetails.manufacturer}
                    valueList={correctorManufacturers}
                    placeholder="Select a Manufacturer"
                    onChange={(item) =>
                      handleInputChange('manufacturer', item.value)
                    }
                  />
                </View>

                <EcomDropDown
                  width={width * 0.35}
                  value={localCorrectorDetails.model}
                  valueList={correctorModelCodes}
                  placeholder="Select Model Code"
                  onChange={(item) => handleInputChange('model', item.value)}
                />
              </View>
              <View style={styles.spacer} />
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <View style={{ flex: 0.5 }}>
                  <TextInputWithTitle
                    style={{ width: '100%' }}
                    title={'Uncorrected Reads'}
                    value={localCorrectorDetails.uncorrected}
                    keyboardType="numeric" // Set keyboardType to numeric
                    onChangeText={(txt) => {
                      const filteredText = txt.replace(/[^0-9]/g, ''); // Allow only numbers
                      handleInputChange('uncorrected', filteredText);
                    }}
                  />
                </View>
                <View style={{ flex: 0.5 }}>
                  <TextInputWithTitle
                    style={{ width: '100%' }}
                    title={'corrected Reads'}
                    value={localCorrectorDetails.corrected}
                    keyboardType="numeric" // Set keyboardType to numeric
                    onChangeText={(txt) => {
                      const filteredText = txt.replace(/[^0-9]/g, ''); // Allow only numbers
                      handleInputChange('corrected', filteredText);
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={styles.spacer} />

            <View style={styles.imagePickerContainer}>
              <View style={styles.body}>
                <Text type="caption" style={styles.text}>
                  AMR photo
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
    height: height * 0.25, // Adjust the multiplier to fit your design needs
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
    padding: height * 0.02, // Adjust the multiplier to fit your design needs
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
    minHeight: 40,
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
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    width: width * 0.25, // Adjusted for responsiveness
    marginVertical: height * 0.01, // Adjusted based on screen height
    alignSelf: 'flex-start',
  },
  spacer: {
    height: height * 0.02, // Adjusted based on screen height
  },
  spacer2: {
    height: height * 0.01, // Adjusted based on screen height
  },
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
