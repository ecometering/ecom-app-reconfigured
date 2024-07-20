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
import { TextType } from '../../theme/typography';
import { SIZE_LIST } from '../../utils/constant';
import { useFormStateContext } from '../../context/AppContext';
import withUniqueKey from '../../utils/renderNavigationWithUniqueKey';
import { validateActiveRegulator } from './ActiveRegulatorPage.validator';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const ActiveRegulatorPage = () => {
  const route = useRoute();
  const db = useSQLiteContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();
  const { jobID, photos, streams } = state;

  const { title, stream, photoKey } = route.params;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      streams: {
        ...prevState.streams,
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
    const { isValid, message } = validateActiveRegulator(
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
              Active Regulator Details
            </Text>
            <View>
              <Text style={styles.text}>Does the activeRegulator exist?</Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange(`activeRegulator${stream}Exists`, true);
                  },
                  () => {
                    handleInputChange(`activeRegulator${stream}Exists`, false);
                  },
                ]}
                value={
                  streams[`activeRegulator${stream}Exists`] === null
                    ? null
                    : streams[`activeRegulator${stream}Exists`]
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
            {streams[`activeRegulator${stream}Exists`] && (
              <>
                <View>
                  <Text>Active Regulator Serial Number</Text>
                  <TextInput
                    onChangeText={(txt) => {
                      const withSpacesAllowed = txt.toUpperCase();
                      const formattedText = withSpacesAllowed.replace(
                        /[^A-Z0-9]+/g,
                        ''
                      );
                      handleInputChange(
                        `activeRegulatorSerialNumber${stream}`,
                        formattedText
                      );
                    }}
                    value={streams[`activeRegulatorSerialNumber${stream}`]}
                  />
                </View>
                <EcomDropDown
                  value={streams[`activeRegulatorSize${stream}`]}
                  valueList={SIZE_LIST}
                  placeholder="Select size"
                  onChange={(item) =>
                    handleInputChange(
                      `activeRegulatorSize${stream}`,
                      item.value
                    )
                  }
                />
                <TextInputWithTitle
                  title={'Manufacturer'}
                  value={streams[`activeRegulatorManufacturer${stream}`]}
                  onChangeText={(txt) => {
                    handleInputChange(
                      `activeRegulatorManufacturer${stream}`,
                      txt
                    );
                  }}
                />
                <TextInputWithTitle
                  title={'Notes'}
                  value={streams[`activeRegulatorNotes${stream}`]}
                  onChangeText={(txt) => {
                    handleInputChange(`activeRegulatorNotes${stream}`, txt);
                  }}
                />
                <Text type="caption" style={styles.text}>
                  Active Regulator photo
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

export default withUniqueKey(ActiveRegulatorPage);
