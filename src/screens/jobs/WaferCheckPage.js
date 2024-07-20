import {
  View,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useRoute } from '@react-navigation/native';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import EcomDropDown from '../../components/DropDown';
import OptionalButton from '../../components/OptionButton';
import ImagePickerButton from '../../components/ImagePickerButton';
import TextInput, { TextInputWithTitle } from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { SIZE_LIST } from '../../utils/constant';
import { TextType } from '../../theme/typography';
import { useFormStateContext } from '../../context/AppContext';
import { validateWaferCheck } from './WaferCheckPage.validator';
import withUniqueKey from '../../utils/renderNavigationWithUniqueKey';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const WaferCheckPage = () => {
  const route = useRoute();
  const db = useSQLiteContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();
  const { jobID, photos, streams } = state;

  const { title, stream, photoKey } = route.params;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;

  const handleInputChange = (name, value) => {
    setState((prevDetails) => ({
      ...prevDetails,
      streams: {
        ...prevDetails.streams,
        [name]: value,
      },
    }));
  };

  const handlePhotoSelected = (uri) => {
    setState((prevDetails) => ({
      ...prevDetails,
      photos: {
        ...prevDetails.photos,
        [photoKey]: { title, photoKey, uri },
      },
    }));
  };

  const saveToDatabase = async () => {
    const photosJson = JSON.stringify(photos);
    const streamsJson = JSON.stringify(streams);
    try {
      await db
        .runAsync('UPDATE Jobs SET photos = ?, streams = ? WHERE id = ?', [
          photosJson,
          streamsJson,
          jobID,
        ])
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
    const { isValid, message } = validateWaferCheck(
      streams,
      stream,
      existingPhoto
    );

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    await saveToDatabase();
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
              Wafer Check Details
            </Text>
            <View>
              <Text style={styles.text}>Does the waferCheck exist?</Text>
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
            {streams[`waferCheck${stream}Exists`] && (
              <>
                <View>
                  <Text>Wafer Check Serial Number</Text>
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
                    value={streams[`waferCheckSerialNumber${stream}`]}
                  />
                </View>
                <EcomDropDown
                  value={streams[`waferCheckSize${stream}`]}
                  valueList={SIZE_LIST}
                  placeholder="Select size"
                  onChange={(item) =>
                    handleInputChange(`waferCheckSize${stream}`, item.value)
                  }
                />
                <TextInputWithTitle
                  title={'Manufacturer'}
                  value={streams[`waferCheckManufacturer${stream}`]}
                  onChangeText={(txt) => {
                    handleInputChange(`waferCheckManufacturer${stream}`, txt);
                  }}
                />
                <TextInputWithTitle
                  title={'Notes'}
                  value={streams[`waferCheckNotes${stream}`]}
                  onChangeText={(txt) => {
                    handleInputChange(`waferCheckNotes${stream}`, txt);
                  }}
                />
                <Text type="caption" style={styles.text}>
                  Wafer Check photo
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
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    gap: 20,
  },
});

export default withUniqueKey(WaferCheckPage);
