import React, { useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Text from '../../components/Text';
import { TextInputWithTitle } from '../../components/TextInput';
import Header from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import OptionalButton from '../../components/OptionButton';
import { useAppContext } from '../../context/AppContext';
import EcomHelper from '../../utils/ecomHelper';
import ImagePickerButton from '../../components/ImagePickerButton';
import { useProgressNavigation } from '../../../ExampleFlowRouteProvider';

const { width, height } = Dimensions.get('window');

function SiteQuestionsPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { jobType, jobID, setSiteQuestions, siteQuestions, photos, savePhoto } =
    useAppContext();
  const { pushNavigation } = useProgressNavigation();
  const { params } = useRoute();
  const { title, photoKey } = params;
  const existingPhoto = photos[photoKey];
  const [selectedImage, setSelectedImage] = useState(
    existingPhoto?.uri || null
  );

  const saveToDatabase = async () => {
    const photosJson = JSON.stringify(photos);
    const questionJson = JSON.stringify(siteQuestions);
    try {
      await db
        .runAsync(
          'UPDATE Jobs SET photos = ?, siteQuestions = ? WHERE id = ?',
          [photosJson, questionJson, jobID]
        )
        .then((result) => {
          console.log('photos saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving photos to database:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setSiteQuestions((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    console.log('SiteQuestionsPage handleInputChange invoked.', siteQuestions);
  };
  const handlePhotoSelected = (uri) => {
    setSelectedImage(uri);
    savePhoto(photoKey, { title, photoKey, uri });
    console.log('Photo saved:', { title, photoKey, uri });
    console.log('photos:', photos);
  };
  const backPressed = () => {
    saveToDatabase();
    navigation.goBack();
  };

  const nextPressed = () => {
    console.log('nextPressed invoked.');

    // Individual validation checks with specific messages
    if (siteQuestions?.isSafe === null) {
      EcomHelper.showInfoMessage(
        'Please indicate if the meter location is safe.'
      );
      return;
    }
    if (siteQuestions?.isGeneric === null) {
      EcomHelper.showInfoMessage(
        'Please indicate if the job is covered by the generic risk assessment.'
      );
      return;
    }
    if (siteQuestions?.isCarryOut === null) {
      EcomHelper.showInfoMessage(
        'Please indicate if the job can be carried out.'
      );
      return;
    }
    if (
      siteQuestions?.isCarryOut === false &&
      (!siteQuestions?.carryOutReason ||
        siteQuestions?.carryOutReason?.trim()?.length === 0)
    ) {
      EcomHelper.showInfoMessage(
        "Please indicate why the job can't be carried out."
      );
      return;
    }
    if (siteQuestions?.isFitted === null) {
      EcomHelper.showInfoMessage('Please indicate if a bypass is fitted.');
      return;
    }
    if (siteQuestions?.isFitted && !photos?.bypassPhoto) {
      EcomHelper.showInfoMessage('Please provide a photo of the bypass.');
      return;
    }
    if (siteQuestions?.isStandard === null) {
      EcomHelper.showInfoMessage(
        'Please indicate if the customer installation conforms to current standards.'
      );
      return;
    }
    saveToDatabase();
    // Continue with conditional navigation based on jobType and conditions
    handleNavigationBasedOnConditions();
  };

  const handleNavigationBasedOnConditions = () => {
    if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
      pushNavigation('StandardPage');
    } else if (!siteQuestions?.isCarryOut) {
      pushNavigation('RebookPage');
    } else {
      // Continue with conditional navigation based on jobType
      navigation.navigate('JobTypeNavigator');
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
      <ScrollView style={styles.content}>
        <View style={styles.body}>
          <View style={styles.spacer} />
          <Text>
            Is meter location safe and approved for a meter installation to take
            place
          </Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={['Yes', 'No']}
              actions={[
                () => {
                  handleInputChange('isSafe', true);
                },
                () => {
                  handleInputChange('isSafe', false);
                },
              ]}
              value={
                siteQuestions?.isSafe === null
                  ? null
                  : siteQuestions?.isSafe
                  ? 'Yes'
                  : 'No'
              }
            />
          </View>
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Text>Is the job covered by the generic risk assessment</Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={['Yes', 'No']}
              actions={[
                () => {
                  handleInputChange('isGeneric', true);
                },
                () => {
                  handleInputChange('isGeneric', false);
                },
              ]}
              value={
                siteQuestions?.isGeneric === null
                  ? null
                  : siteQuestions?.isGeneric
                  ? 'Yes'
                  : 'No'
              }
            />
          </View>
          {!siteQuestions?.isGeneric && (
            <TextInputWithTitle
              title={
                'Why is this job not covered by the generic risk assesment'
              }
              placeholder={''}
              value={siteQuestions?.genericReason}
              onChangeText={(txt) => {
                handleInputChange('genericReason', txt);
              }}
            />
          )}
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Text>Can the Job be carried out</Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={['Yes', 'No']}
              actions={[
                () => {
                  handleInputChange('isCarryOut', true);
                },
                () => {
                  handleInputChange('isCarryOut', false);
                },
              ]}
              value={
                siteQuestions?.isCarryOut === null
                  ? null
                  : siteQuestions?.isCarryOut
                  ? 'Yes'
                  : 'No'
              }
            />
          </View>
          {!siteQuestions?.isCarryOut && (
            <TextInputWithTitle
              title={'Why it cant be carried out'}
              placeholder={''}
              value={siteQuestions?.carryOutReason}
              onChangeText={(txt) => {
                handleInputChange('carryOutReason', txt);
              }}
              containerStyle={styles.inputContainer}
            />
          )}
          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Text>Is a bypass fitted</Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={['Yes', 'No']}
              actions={[
                () => {
                  handleInputChange('isFitted', true);
                },
                () => {
                  handleInputChange('isFitted', false);
                },
              ]}
              value={
                siteQuestions?.isFitted === null
                  ? null
                  : siteQuestions?.isFitted
                  ? 'Yes'
                  : 'No'
              }
            />
          </View>

          {siteQuestions?.isFitted && (
            <View style={styles.imagePickerContainer}>
              <View style={styles.body}>
                <Text type="caption" style={styles.text}>
                  Bypass
                </Text>
                <ImagePickerButton
                  onImageSelected={handlePhotoSelected}
                  currentImage={selectedImage}
                />
                {selectedImage && (
                  <Image source={{ uri: selectedImage }} style={styles.image} />
                )}
              </View>
            </View>
          )}

          <View style={styles.spacer} />
          <View style={styles.spacer} />
          <Text>
            Does the Customer installation Pipework and appliances conform to
            current standards
          </Text>
          <View style={styles.optionContainer}>
            <OptionalButton
              options={['Yes', 'No']}
              actions={[
                () => {
                  handleInputChange('isStandard', true);
                },
                () => {
                  handleInputChange('isStandard', false);
                },
              ]}
              value={
                siteQuestions?.isStandard === null
                  ? null
                  : siteQuestions?.isStandard
                  ? 'Yes'
                  : 'No'
              }
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  body: {
    padding: 20,
  },
  optionContainer: {
    width: width * 0.25,
    marginVertical: height * 0.01,
    alignSelf: 'flex-start',
  },
  spacer: {
    height: height * 0.01,
  },
  inputContainer: {
    flex: 1,
  },
  image: {
    width: width * 0.5,
    height: height * 0.25,
    alignSelf: 'center',
  },
});

export default SiteQuestionsPage;
