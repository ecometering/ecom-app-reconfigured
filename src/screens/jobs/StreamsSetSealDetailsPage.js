import {
  View,
  Platform,
  StyleSheet,
  Dimensions,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useContext, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import { TextType } from '../../theme/typography';
import TextInput from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { AppContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';

const RepeatComponent = ({ title, onChangeText, value }) => {
  return (
    <View style={styles.repeatComponentContainer}>
      <View style={styles.titleContainer}>
        <Text type={TextType.BODY_1} style={styles.titleStyle}>
          {title}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          keyboardType="numeric"
        />
      </View>
      <Text type={TextType.BUTTON_1} style={styles.mbarText}>
        {'mbar'}
      </Text>
    </View>
  );
};

function StreamsSetSealDetailsPage() {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const appContext = useContext(AppContext);
  const [n, setN] = useState(appContext.streamNumber);

  const [streamValue, setStreamValue] = useState(appContext.streamValue);
  const route = useRoute();
  const { title, nextScreen } = route?.params ?? {};

  const saveToDatabase = async () => {
    const streamDetailsJson = JSON.stringify(streamValue);

    try {
      await db
        .runAsync('UPDATE Jobs SET streams = ? WHERE id = ?', [
          streamDetailsJson,
          appContext.jobID,
        ])
        .then((result) => {
          console.log('streams saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving streams to database:', error);
    }
  };

  const nextPressed = async () => {
    if (n === 0) {
      EcomHelper.showInfoMessage("Stream value can't be 0.");
      return;
    }
    for (let i = 0; i < n; i++) {
      let item = streamValue[i];
      if (
        item?.slamShut == null ||
        item?.slamShut === '' ||
        item?.creepRelief == null ||
        item?.creepRelief === '' ||
        item?.workingPressure == null ||
        item?.workingPressure === ''
      ) {
        EcomHelper.showInfoMessage('Please input the whole mbars');

        return;
      }
    }
    await saveToDatabase();
    appContext.setStreamValue(streamValue);
    appContext.setStreamNumber(n);

    goToNextStep();
  };

  const backPressed = () => {
    appContext.setStreamValue(streamValue);
    appContext.setStreamNumber(n);
    goToPreviousStep();
  };

  const handleFieldChange = (value, index, field) => {
    const updatedStreamValue = [...streamValue];
    updatedStreamValue[index] = {
      ...updatedStreamValue[index],
      [`${field}`]: value,
    };
    setStreamValue(updatedStreamValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={title}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <View style={styles.body}>
            <Text type={TextType.CAPTION_2}>Streams Set and Seal Details</Text>

            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <Text type={TextType.CAPTION_2} style={styles.streamNumberText}>
                {'Number of streams:'}
              </Text>
              <TouchableHighlight
                style={styles.incDecrButton}
                onPress={() => {
                  if (n > 0) {
                    setN((prev) => prev - 1);
                  }

                  // remove last stream value if n is decreased
                  if (streamValue.length >= n) {
                    const updatedStreamValue = [...streamValue];
                    updatedStreamValue.pop();
                    setStreamValue(updatedStreamValue);
                  }
                }}
              >
                <Text>-</Text>
              </TouchableHighlight>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{n}</Text>
              <TouchableHighlight
                style={styles.incDecrButton}
                onPress={() => {
                  setN((prev) => prev + 1);
                }}
              >
                <Text>+</Text>
              </TouchableHighlight>
            </View>

            {Array.from({ length: n }, (_, index) => (
              <View style={styles.streamContainer}>
                <Text type={TextType.CAPTION_2}>{`stream ${index + 1}`}</Text>
                <View style={styles.section}>
                  <RepeatComponent
                    title={'Slam Shut'}
                    value={streamValue[index]?.slamShut ?? 0}
                    onChangeText={(v) => {
                      if (v.length > 5) {
                        EcomHelper.showInfoMessage(
                          'Max length should be less than 5'
                        );
                        return;
                      }
                      handleFieldChange(v, index, 'slamShut');
                    }}
                  />
                  <RepeatComponent
                    title={'Creep Relief'}
                    value={streamValue[index]?.creepRelief ?? 0}
                    onChangeText={(v) => {
                      if (v.length > 5) {
                        EcomHelper.showInfoMessage(
                          'Max length should be less than 5'
                        );
                        return;
                      }
                      handleFieldChange(v, index, 'creepRelief');
                    }}
                  />
                  <RepeatComponent
                    title={'Working Pressure'}
                    value={streamValue[index]?.workingPressure ?? 0}
                    onChangeText={(v) => {
                      if (v.length > 5) {
                        EcomHelper.showInfoMessage(
                          'Max length should be less than 5'
                        );
                        return;
                      }
                      handleFieldChange(v, index, 'workingPressure');
                    }}
                  />
                </View>
              </View>
            ))}
            <View style={styles.spacer} />
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {},
  keyboardAvoidingView: {},
  body: {
    paddingHorizontal: 20,
    gap: 20,
  },
  streamNumberContainer: {},
  streamNumberText: {
    textAlign: 'left',
  },
  streamContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  repeatComponentContainer: {
    width: '30%',
    alignItems: 'center',
  },
  titleContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    textAlign: 'left',
    fontWeight: '800',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
  },
  mbarText: {
    marginTop: 5,
  },
  spacer: {
    height: 20,
  },
  incDecrButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    // elevate
    elevation: 2,
    // shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
});

export default StreamsSetSealDetailsPage;
