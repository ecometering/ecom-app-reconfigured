import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React from 'react';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import ImagePickerButton from '../../components/ImagePickerButton';

// Context
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

// Utils
import { TextType } from '../../theme/typography';
import EcomHelper from '../../utils/ecomHelper';
import { validateRiddorReport } from './RiddorReportPage.validator';

export default function RiddorReportPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();

  const { standards, jobType, jobID } = state;

  const title = jobType === 'Install' ? 'New Meter Details' : jobType;

  const backPressed = async () => {
    goToPreviousStep();
  };

  const handleInputChange = (key, value) => {
    setState((prev) => ({
      ...prev,
      standards: {
        ...prev.standards,
        [key]: value,
      },
    }));
  };

  const nextPressed = async () => {
    const { isValid, message } = validateRiddorReport(standards);

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    goToNextStep();
  };

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={styles.safeAreaView}>
        <Header
          hasLeftBtn={true}
          hasCenterText={true}
          hasRightBtn={true}
          centerText={title}
          leftBtnPressed={backPressed}
          rightBtnPressed={nextPressed}
        />
        <View style={styles.contentContainer}>
          <View style={styles.body}>
            <Text type={TextType.BODY_1}>RIDDOR Report</Text>
            {standards?.riddorImage && (
              <Image
                source={{ uri: standards?.riddorImage }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            <View style={styles.row}>
              <ImagePickerButton
                onImageSelected={(image) =>
                  handleInputChange('riddorImage', image)
                }
              />
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.spacer} />
            <Text>Notes</Text>
            <TextInput
              value={standards?.notes}
              onChangeText={(text) => {
                handleInputChange('notes', text);
              }}
              style={{ ...styles.input, minHeight: 100 }}
              multiline={true}
              numberOfLines={4}
            />
            <View style={styles.spacer} />
            <Text>RIDDOR Reference</Text>
            <TextInput
              value={standards?.riddorRef}
              onChangeText={(txt) => {
                const numericRegex = /^[0-9]+$/;
                const formattedText = txt.replace(/[^0-9]/g, ''); // Remove non-numeric characters
                if (numericRegex.test(formattedText) || formattedText === '') {
                  handleInputChange('riddorRef', formattedText);
                }
              }}
              style={styles.input}
            />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: '5%',
    flex: 1,
  },
  body: {},
  image: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  spacer: {
    height: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
  },
});
