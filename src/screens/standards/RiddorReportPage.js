import {
  View,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React , { useState, useEffect, createRef }from 'react';
import { useRoute } from '@react-navigation/native';
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
  const route = useRoute();

  const { standards, jobType, photos } = state;
  const existingPhoto = photos && photoKey ? photos[photoKey] : null;
  const {  photoKey,title } = route.params;
  const [selectedImage, setSelectedImage] = useState(existingPhoto || {});


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
  const handlePhotoSelected = (uri) => {
    setSelectedImage({ title, photoKey, uri });
    setState((prevState) => ({
      ...prevState,
      photos: {
        ...prevState.photos,
        [photoKey]: { title, photoKey, uri },
      },
    }));
  };
  const nextPressed = async () => {
    const { isValid, message } = validateRiddorReport(standards,selectedImage);

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
          centerText={"Riddor Report"}
          leftBtnPressed={backPressed}
          rightBtnPressed={nextPressed}
        />
        <View style={styles.contentContainer}>
          <View style={styles.formContainer}>
            <View style={styles.spacer} />
            
            <Text>RIDDOR Reference</Text>
            <TextInput
              value={standards?.riddorRef}
              onChangeText={(txt) => {
                const NoSpacesAllowed = txt.toUpperCase();
                const formattedText = NoSpacesAllowed.replace(
                  /[^A-Z0-9]+/g,
                  ''
                ); 
                handleInputChange('riddorRef', formattedText);
              }}
              style={styles.input}
            />
  
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
          </View>
          
          <View style={styles.body}>
          
            <View style={styles.imagePickerContainer}>
              <View style={styles.body}>
                <Text type="caption" style={styles.text}>
                  RIDDOR Issue
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
          
        </View>
      </SafeAreaView>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  image: {
    height: 400,
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
