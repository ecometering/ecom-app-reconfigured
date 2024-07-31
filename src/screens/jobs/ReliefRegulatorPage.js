import React from 'react';
import {
  View,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
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
import withUniqueKey from '../../utils/renderNavigationWithUniqueKey';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';
import { validateReliefRegulator } from './ReliefRegulatorPage.validator';

const ReliefRegulatorPage = () => {
  const route = useRoute();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();
  const { photos, streams } = state;

  const { title, stream, photoKey } = route.params;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;
  React.useEffect(() => {
    if (streams[`reliefRegulator${stream}Exists`] === undefined) {
      handleInputChange(`reliefRegulator${stream}Exists`, false);
    }
  }, [stream, streams]);

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

  const backPressed = async () => {
    goToPreviousStep();
  };

  const nextPressed = async () => {
    const { isValid, message } = validateReliefRegulator(
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
              Relief Regulator Details
            </Text>
            <View>
              <Text style={styles.text}>Does the reliefRegulator exist?</Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange(`reliefRegulator${stream}Exists`, true);
                  },
                  () => {
                    handleInputChange(`reliefRegulator${stream}Exists`, false);
                  },
                ]}
                value={
                  streams[`reliefRegulator${stream}Exists`] === null
                    ? null
                    : streams[`reliefRegulator${stream}Exists`]
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
            {streams[`reliefRegulator${stream}Exists`] && (
              <>
                <View>
                  <Text>Relief Regulator Serial Number</Text>
                  <TextInput
                    onChangeText={(txt) => {
                      const withSpacesAllowed = txt.toUpperCase();
                      const formattedText = withSpacesAllowed.replace(
                        /[^A-Z0-9]+/g,
                        ''
                      );
                      handleInputChange(
                        `reliefRegulatorSerialNumber${stream}`,
                        formattedText
                      );
                    }}
                    value={streams[`reliefRegulatorSerialNumber${stream}`]}
                  />
                </View>
                <EcomDropDown
                  value={streams[`reliefRegulatorSize${stream}`]}
                  valueList={SIZE_LIST}
                  placeholder="Select size"
                  onChange={(item) =>
                    handleInputChange(
                      `reliefRegulatorSize${stream}`,
                      item.value
                    )
                  }
                />
                <TextInputWithTitle
                  title={'Manufacturer'}
                  value={streams[`reliefRegulatorManufacturer${stream}`]}
                  onChangeText={(txt) => {
                    handleInputChange(
                      `reliefRegulatorManufacturer${stream}`,
                      txt
                    );
                  }}
                />
                <TextInputWithTitle
                  title={'Notes'}
                  value={streams[`reliefRegulatorNotes${stream}`]}
                  onChangeText={(txt) => {
                    handleInputChange(`reliefRegulatorNotes${stream}`, txt);
                  }}
                />
                <Text type="caption" style={styles.text}>
                  Relief Regulator photo
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

export default withUniqueKey(ReliefRegulatorPage);
