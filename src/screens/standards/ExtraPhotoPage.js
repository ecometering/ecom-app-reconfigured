import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';
import Header from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import TextInput from '../../components/TextInput';
import OptionalButton from '../../components/OptionButton';
import EcomHelper from '../../utils/ecomHelper';
import { AppContext } from '../../context/AppContext';
import ImagePickerButton from '../../components/ImagePickerButton';

const { width, height } = Dimensions.get('window');

export default function ExtraPhotoPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { photoNumber, title } = route.params;
  const appContext = useContext(AppContext);
  const standardDetails = appContext.standardDetails;

  const [selectedImage, setSelectedImage] = useState(null);
  const [extraComment, setExtraComment] = useState('');
  const [addMorePhotos, setAddMorePhotos] = useState(false);
  const [hasExtraPhoto, setHasExtraPhoto] = useState(false);

  useEffect(() => {
    const currentExtra = standardDetails?.extras?.find(
      (extra) => extra?.photoNumber === photoNumber
    );
    //  get the current extra photo and comment if it exists
    if (currentExtra && currentExtra?.extraPhoto) {
      setHasExtraPhoto(true);
      setSelectedImage(currentExtra?.extraPhoto);
      setExtraComment(currentExtra?.extraComment);
    } else {
      setSelectedImage(null);
      setExtraComment('');
    }
  }, [photoNumber, standardDetails?.extras]);

  const handleSubmit = async () => {
    if (hasExtraPhoto) {
      if (!selectedImage) {
        EcomHelper.showInfoMessage('Please add an extra photo');
        return;
      }
      if (!extraComment) {
        EcomHelper.showInfoMessage('Please provide comments on the photo');
        return;
      }
    }

    const newExtra = { extraPhoto: selectedImage, extraComment, photoNumber };
    // update the extras array with the new extra photo and comment
    const updatedExtras = [
      ...(standardDetails?.extras?.filter(
        (extra) => extra.photoNumber !== photoNumber
      ) || []),
      newExtra,
    ];

    const standards = {
      ...standardDetails,
      extras: updatedExtras,
    };

    appContext.setStandardDetails(standards);
    await db.runAsync('UPDATE Jobs SET standards = ? WHERE id = ?', [
      JSON.stringify(standards),
      appContext.jobID,
    ]);
    // reset the form
    setSelectedImage(null);
    setExtraComment('');

    if (addMorePhotos) {
      navigation.push('ExtraPhotoPage', {
        photoNumber: photoNumber + 1,
        title: `Extra Photos ${photoNumber + 1}`,
      });
    } else {
      navigation.navigate('SubmitSuccessPage');
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          hasLeftBtn={true}
          hasCenterText={true}
          hasRightBtn={true}
          centerText={title}
          leftBtnPressed={() => navigation.goBack()}
          rightBtnPressed={handleSubmit}
        />

        <View style={styles.body}>
          {photoNumber === 0 && (
            <View>
              <Text style={styles.text}>Are any extra photos required?</Text>
              <View style={styles.optionContainer}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => setHasExtraPhoto(true),
                    () => setHasExtraPhoto(false),
                  ]}
                  value={hasExtraPhoto ? 'Yes' : 'No'}
                />
              </View>
            </View>
          )}
          {(hasExtraPhoto || photoNumber > 0) && (
            <View>
              <ImagePickerButton onImageSelected={setSelectedImage} />
              {selectedImage && (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.image}
                  resizeMode="contain"
                />
              )}
              <TextInput
                value={extraComment}
                onChangeText={setExtraComment}
                multiline={true}
                placeholder="Comments on photo"
                style={styles.textInput}
              />
              <Text style={styles.text}>
                Do you wish to add more job photos?
              </Text>
              <View style={styles.optionContainer}>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => setAddMorePhotos(true),
                    () => setAddMorePhotos(false),
                  ]}
                  value={addMorePhotos ? 'Yes' : 'No'}
                />
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  body: {
    marginHorizontal: width * 0.05,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    alignSelf: 'center',
    marginTop: 20,
  },
  textInput: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    height: 100,
    textAlignVertical: 'top',
    width: '100%',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  text: {
    marginTop: 20,
  },
});
