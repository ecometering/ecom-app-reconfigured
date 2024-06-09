import { useSQLiteContext } from 'expo-sqlite/next';
import * as ExpoImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import React, {
  createRef,
  useState,
  useContext,
} from 'react';
import {
  View,
  Image,
  Alert,
  ScrollView,
  Platform,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

// Components
import TextInput, {
  InputRowWithTitle,
  TextInputWithTitle,
} from '../../components/TextInput';
import Text from '../../components/Text';
import Header from '../../components/Header';
import EcomDropDown from '../../components/DropDown';
import OptionalButton from '../../components/OptionButton';
import ImagePickerButton from '../../components/ImagePickerButton';
import { SIZE_LIST } from '../../utils/constant';
// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { TextType } from '../../theme/typography';
import { PrimaryColors } from '../../theme/colors';
import { AppContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';
import withUniqueKey from '../../utils/renderNavigationWithUniqueKey';

const { width, height } = Dimensions.get('window');

const  WaferCheckPage =() => {
  const route = useRoute();
  const db = useSQLiteContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { jobID, photos, savePhoto, streams, setStreams, streamNumber } = useContext(AppContext);

  const { title, stream, photoKey } = route.params;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;

  const [selectedImage, setSelectedImage] = useState(existingPhoto || {});

  const handleInputChange = (name, value) => {
    setStreams((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    console.log('message: 303, streams: ', streams);
  };

  const handlePhotoSelected = (uri) => {
    setSelectedImage({ title, photoKey, uri });
  };

  const saveToDatabase = async () => {
    const photosJson = JSON.stringify(photos);
    const streamsJson = JSON.stringify(streams);
    try {
      await db
        .runAsync(
          'UPDATE Jobs SET photos = ?, streams = ? WHERE id = ?',
          [photosJson, streamsJson, jobID]
        )
        .then((result) => {
          console.log('photos saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving photos to database:', error);
    }
  };

  const backPressed = () => {
    saveToDatabase();
    if (selectedImage.uri) savePhoto(photoKey, selectedImage);
    
    goToPreviousStep();
  };

  const nextPressed = async () => {
    if (streams[`waferCheck${stream}Exists`] === null) {
      EcomHelper.showInfoMessage('Please select if the wafer Check exists');
      return;
    }
  
    if (streams[`waferCheck${stream}Exists`]) {
      if (!selectedImage?.uri) {
        EcomHelper.showInfoMessage('Please choose an image');
        return;
      }
      if (!streams[`waferCheckSerialNumber${stream}`]) {
        EcomHelper.showInfoMessage('Please input the wafer Check Serial Number.');
        return;
      }
      if (!streams[`waferCheckSize${stream}`]) {
        EcomHelper.showInfoMessage('Please select the wafer Check Size.');
        return;
      }
      if (!streams[`waferCheckManufacturer${stream}`]) {
        EcomHelper.showInfoMessage('Please input the wafer Check Manufacturer.');
        return;
      }
     
    }
  
    await saveToDatabase();
  
    if (selectedImage.uri) savePhoto(photoKey, selectedImage);
  
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
            <Text type={TextType.HEADER_1} style={{ alignSelf: 'center' }}>
              wafer Check Details
            </Text>
            <View style={styles.spacer} />
            <View>
              <Text style={styles.text}>Does the wafer Check exist?</Text>
              <View style={styles.optionContainer}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => {
                      handleInputChange(`waferCheck${stream}Exists`, true);
                      
                    },
                    () => {
                      handleInputChange(`waferCheck${stream}Exists`, false);
                      
                    },
                  ]}
                  value={
                    streams[`waferCheck${stream}Exists`] === null
                      ? null
                      : streams[`waferCheck${stream}Exists`]
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            </View>

            {streams[`waferCheck${stream}Exists`] && (
              <>
                <View style={styles.border}>
                  <View style={styles.row}>
                    <View
                      style={{
                        width: width * 0.45,
                        alignSelf: 'flex-end',
                      }}
                    >
                      <Text>waferCheck Serial Number</Text>
                      <View style={styles.spacer2} />
                      <View style={{ ...styles.row, width: width * 0.35 }}>
                        <TextInput
                          onChangeText={(txt) => {
                            const withSpacesAllowed = txt.toUpperCase();
                            const formattedText = withSpacesAllowed.replace(
                              /[^A-Z0-9]+/g,
                              ''
                            );
                            handleInputChange(
                              `waferCheckSerialNumber${stream}`,
                              formattedText
                            );
                          }}
                          style={{
                            ...styles.input,
                            width: width * 0.25,
                            alignSelf: 'flex-end',
                          }}
                          value={streams[`waferCheckSerialNumber${stream}`]}
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
                        value={streams[`waferCheckSize${stream}`]}
                        valueList={SIZE_LIST}
                        placeholder="Select size"
                        onChange={(item) =>
                          handleInputChange(`waferCheckSize${stream}`, item.value)
                        }
                      />
                    </View>
                  </View>

                  <View style={styles.spacer} />
                  <View
                    style={{
                      flexDirection: 'Column',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <TextInputWithTitle
                        style={{ width: '100%' }}
                        title={'Manufacturer'}
                        value={streams[`waferCheckManufacturer${stream}`]}
                        onChangeText={(txt) => {
                          handleInputChange(`waferCheckManufacturer${stream}`, txt);
                        }}
                      />
                    </View>
                    <View style={styles.spacer} />
                    <View style={{ flex: 1 }}>
                      <TextInputWithTitle
                        style={{ width: '100%' }}
                        title={'Notes'}
                        value={streams[`waferCheckNotes${stream}`]}
                        onChangeText={(txt) => {
                          handleInputChange(`waferCheckNotes${stream}`, txt);
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.spacer} />

                <View style={styles.imagePickerContainer}>
                  <View style={styles.body}>
                    <Text type="caption" style={styles.text}>
                      wafer Check photo
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
              </>
            )}
          </View>
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
export default withUniqueKey(WaferCheckPage);
