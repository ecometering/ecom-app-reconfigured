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
import { validateSlamShut } from './SlamshutPage.validator';
import { useFormStateContext } from '../../context/AppContext';
import withUniqueKey from '../../utils/renderNavigationWithUniqueKey';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const SlamShutPage = () => {
  const route = useRoute();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();
  const {  photos, streams } = state;

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

  const backPressed = () => {
    goToPreviousStep();
  };

  const nextPressed = async () => {
    const { isValid, message } = validateSlamShut(
      streams,
      stream,
      existingPhoto
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
            <Text type={TextType.HEADER_1} style={{ alignSelf: 'center' }}>
              SlamShut Details
            </Text>
            <View>
              <Text style={styles.text}>Does the slamShut exist?</Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange(`slamShut${stream}Exists`, true);
                  },
                  () => {
                    handleInputChange(`slamShut${stream}Exists`, false);
                  },
                ]}
                value={
                  streams[`slamShut${stream}Exists`] === null
                    ? null
                    : streams[`slamShut${stream}Exists`]
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
            {streams[`slamShut${stream}Exists`] && (
              <>
                <View>
                  <Text>SlamShut Serial Number</Text>
                  <TextInput
                    onChangeText={(txt) => {
                      const withSpacesAllowed = txt.toUpperCase();
                      const formattedText = withSpacesAllowed.replace(
                        /[^A-Z0-9]+/g,
                        ''
                      );
                      handleInputChange(
                        `slamShutSerialNumber${stream}`,
                        formattedText
                      );
                    }}
                    value={streams[`slamShutSerialNumber${stream}`]}
                  />
                </View>
                <EcomDropDown
                  value={streams[`slamShutSize${stream}`]}
                  valueList={SIZE_LIST}
                  placeholder="Select size"
                  onChange={(item) =>
                    handleInputChange(`slamShutSize${stream}`, item.value)
                  }
                />
                <TextInputWithTitle
                  title={'Manufacturer'}
                  value={streams[`slamShutManufacturer${stream}`]}
                  onChangeText={(txt) => {
                    handleInputChange(`slamShutManufacturer${stream}`, txt);
                  }}
                />
                <TextInputWithTitle
                  title={'Notes'}
                  value={streams[`slamShutNotes${stream}`]}
                  onChangeText={(txt) => {
                    handleInputChange(`slamShutNotes${stream}`, txt);
                  }}
                />
                <Text type="caption" style={styles.text}>
                  SlamShut photo
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

export default withUniqueKey(SlamShutPage);
