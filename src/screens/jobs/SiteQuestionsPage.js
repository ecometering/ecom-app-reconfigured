import {
  Image,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import { TextInputWithTitle } from '../../components/TextInput';
import ImagePickerButton from '../../components/ImagePickerButton';

// Utils and Context
import EcomHelper from '../../utils/ecomHelper';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

function SiteQuestionsPage() {
  const { params } = useRoute();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();

  const { jobID, siteQuestions, photos } = state;
  const { title, photoKey } = params;
  const existingPhoto = photos[photoKey];

  const [selectedImage, setSelectedImage] = useState(
    existingPhoto?.uri || null
  );

  const handleInputChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      siteQuestions: {
        ...prevState.siteQuestions,
        [name]: value,
      },
    }));
  };

  const handlePhotoSelected = (uri) => {
    setSelectedImage(uri);
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
    const validationChecks = [
      {
        condition:
          siteQuestions?.isSafe !== true && siteQuestions?.isSafe !== false,
        message: 'Please indicate if the meter location is safe.',
      },
      {
        condition:
          siteQuestions?.isGeneric !== true &&
          siteQuestions?.isGeneric !== false,
        message:
          'Please indicate if the job is covered by the generic risk assessment.',
      },
      {
        condition:
          siteQuestions?.isCarryOut !== true &&
          siteQuestions?.isCarryOut !== false,
        message: 'Please indicate if the job can be carried out.',
      },

      {
        condition:
          siteQuestions?.isFitted !== true && siteQuestions?.isFitted !== false,
        message: 'Please indicate if a bypass is fitted.',
      },
      {
        condition: siteQuestions?.isFitted === true && !photos?.bypassPhoto,
        message: 'Please provide a photo of the bypass.',
      },
      {
        condition:
          siteQuestions?.isStandard !== true &&
          siteQuestions?.isStandard !== false,
        message:
          'Please indicate if the customer installation conforms to current standards.',
      },
    ];

    for (const check of validationChecks) {
      if (check.condition) {
        EcomHelper.showInfoMessage(check.message);
        return;
      }
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
      <ScrollView style={styles.content}>
        <View style={styles.body}>
          {[
            {
              key: 'isSafe',
              question: 'Is the meter location safe',
              options: ['Yes', 'No'],
            },

            {
              key: 'isGeneric',
              question: 'Is the job covered by the generic risk assessment',
              options: ['Yes', 'No'],
              extra: () => {
                if (siteQuestions?.isGeneric === false) {
                  return (
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
                  );
                }
              },
            },
            {
              key: 'isCarryOut',
              question: 'Can the Job be carried out',
              options: ['Yes', 'No'],
            },
            {
              key: 'isFitted',
              question: 'Is a bypass fitted',
              options: ['Yes', 'No'],
              extra: () => {
                if (siteQuestions?.isFitted) {
                  return (
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
                          <Image
                            source={{ uri: selectedImage }}
                            style={styles.image}
                          />
                        )}
                      </View>
                    </View>
                  );
                }
              },
            },
            {
              key: 'isStandard',
              question:
                'Does the Customer installation Pipework and appliances conform to current standards',
              options: ['Yes', 'No'],
            },
          ].map((item) => {
            return (
              <View
                key={item?.key}
                style={{
                  gap: 10,
                }}
              >
                <Text>{item?.question}</Text>
                <View style={styles.optionContainer}>
                  <OptionalButton
                    options={item?.options}
                    actions={[
                      () => {
                        handleInputChange(item?.key, true);
                      },
                      () => {
                        handleInputChange(item?.key, false);
                      },
                    ]}
                    value={
                      siteQuestions?.[item?.key] === undefined
                        ? null
                        : siteQuestions?.[item?.key]
                        ? item?.options[0]
                        : item?.options[1]
                    }
                  />
                </View>
                {item?.extra && item?.extra()}
              </View>
            );
          })}
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
    gap: 20,
  },
  optionContainer: {},
  inputContainer: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
  },
});

export default SiteQuestionsPage;
