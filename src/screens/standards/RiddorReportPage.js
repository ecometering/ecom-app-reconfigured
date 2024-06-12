import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, { useContext, useState } from 'react';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import TextInput from '../../components/TextInput';
import ImagePickerButton from '../../components/ImagePickerButton'; // Adjust this path as necessary

// Context
import { AppContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

// Utils
import { TextType } from '../../theme/typography';
import EcomHelper from '../../utils/ecomHelper';

const { width, height } = Dimensions.get('window'); // Use Dimensions to get width and height

export default function RiddorReportPage() {
  const appContext = useContext(AppContext);
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const standardDetails = appContext.standardDetails;
  const jobType = appContext.jobType;
  const jobID = appContext.jobID;
  const title = jobType === 'Install' ? 'New Meter Details' : jobType;

  const [riddorImage, setRiddorImage] = useState(standardDetails?.riddorImage); // Renamed state
  const [notes, setNotes] = useState(standardDetails?.notes);
  const [riddorRef, setRiddorRef] = useState(standardDetails?.riddorRef);

  const backPressed = async () => {
    const standards = {
      ...standardDetails,
      riddorImage: riddorImage, // Updated reference
      notes,
      riddorRef,
    };

    appContext.setStandardDetails(standards);
    await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
      JSON.stringify(standards),
      jobID,
    ]);

    goToPreviousStep();
  };

  const nextPressed = async () => {
    if (!riddorImage) {
      // Updated check
      EcomHelper.showInfoMessage('Please choose an image.');
      return;
    }

    if (!notes) {
      EcomHelper.showInfoMessage('Notes are compulsory!');
      return;
    }

    if (!riddorRef) {
      EcomHelper.showInfoMessage('RIDDOR reference is required!');
      return;
    }

    try {
      const response = await fetch(riddorImage); // Updated reference
      const blob = await response.blob();
      appContext.setBlobs((prev) => [...prev, blob]);
    } catch (err) {
      console.error(err);
    }

    const standards = {
      ...standardDetails,
      riddorImage: riddorImage, // Updated reference
      notes,
      riddorRef,
    };

    appContext.setStandardDetails(standards);
    await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
      JSON.stringify(standards),
      jobID,
    ]);

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
            {riddorImage && ( // Updated reference
              <Image
                source={{ uri: riddorImage }} // Updated reference
                style={styles.image}
                resizeMode="contain"
              />
            )}
            <View style={styles.row}>
              <ImagePickerButton onImageSelected={setRiddorImage} />
            </View>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.spacer} />
            <Text>Notes</Text>
            <TextInput
              value={notes}
              onChangeText={(text) => setNotes(text)}
              style={styles.input}
              multiline={true}
            />
            <View style={styles.spacer} />
            <Text>RIDDOR Reference</Text>
            <TextInput
              value={riddorRef}
              onChangeText={(txt) => {
                // Define the alphanumeric regular expression
                const alphanumericRegex = /^[a-z0-9]+$/i;

                // Capitalize the text
                const formattedText = txt.toUpperCase();

                // Check if the formatted text is alphanumeric
                if (alphanumericRegex.test(formattedText)) 
             setRiddorRef(formattedText)}}
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
    width: width * 0.8,
    height: height * 0.3,
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
