import {
  View,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import { TextType } from '../../theme/typography';
import TextInput from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const StreamInputComponent = ({ title, value, onChangeText }) => {
  console.log({ value });
  return (
    <View style={styles.repeatComponentContainer}>
      <View style={styles.titleContainer}>
        <Text type={TextType.BODY_1} style={styles.titleStyle}>
          {title}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={String(value)}
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
  const { state, setState } = useFormStateContext();
  const { streams, jobID } = state;

  const db = useSQLiteContext();
  const route = useRoute();
  const { title } = route?.params ?? {};

  const handleInputChange = (key, value) => {
    setState((prev) => ({
      ...prev,
      streams: {
        ...prev.streams,
        [key]: value,
      },
    }));
  };

  const saveToDatabase = async () => {
    const streamDetailsJson = JSON.stringify(streams);
    try {
      await db.runAsync('UPDATE Jobs SET streams = ? WHERE id = ?', [
        streamDetailsJson,
        jobID,
      ]);
    } catch (error) {
      console.error('Error saving streams to database:', error);
    }
  };

  const validateFields = () => {
    if (streams.Number === 0) {
      EcomHelper.showInfoMessage("Stream value can't be 0.");
      return false;
    }
    for (let i = 1; i <= streams.Number; i++) {
      if (
        !streams[`slamShut${i}`] ||
        !streams[`creepRelief${i}`] ||
        !streams[`workingPressure${i}`]
      ) {
        EcomHelper.showInfoMessage('Please input the whole mbars');
        return false;
      }
    }
    return true;
  };

  const nextPressed = async () => {
    if (!validateFields()) return;
    await saveToDatabase();
    goToNextStep();
  };

  const backPressed = () => {
    goToPreviousStep();
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
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
        >
          <View style={styles.body}>
            <Text type={TextType.CAPTION_2}>Streams Set and Seal Details</Text>
            <View style={styles.streamNumberContainer}>
              <Text type={TextType.CAPTION_2} style={styles.streamNumberText}>
                {'Number of streams:'}
              </Text>
              <TouchableHighlight
                style={styles.incDecrButton}
                onPress={() => {
                  if (streams.Number > 0) {
                    // remvode the last stream details
                    const newStreams = { ...streams };
                    delete newStreams[`slamShut${streams.Number}`];
                    delete newStreams[`creepRelief${streams.Number}`];
                    delete newStreams[`workingPressure${streams.Number}`];
                    setState((prev) => ({
                      ...prev,
                      streams: {
                        ...newStreams,
                        Number: streams.Number - 1,
                      },
                    }));
                  }
                }}
              >
                <Text>-</Text>
              </TouchableHighlight>
              <Text style={styles.streamNumber}>{streams?.Number || 0}</Text>
              <TouchableHighlight
                style={styles.incDecrButton}
                onPress={() => {
                  handleInputChange('Number', (streams.Number ?? 0) + 1);
                }}
              >
                <Text>+</Text>
              </TouchableHighlight>
            </View>

            {Array.from({ length: streams.Number }, (_, index) => (
              <View key={index} style={styles.streamContainer}>
                <Text type={TextType.CAPTION_2}>{`Stream ${index + 1}`}</Text>
                <View style={styles.section}>
                  {[
                    { key: `slamShut${index + 1}`, title: 'Slam Shut' },
                    { key: `creepRelief${index + 1}`, title: 'Creep Relief' },
                    {
                      key: `workingPressure${index + 1}`,
                      title: 'Working Pressure',
                    },
                  ].map((strem) => {
                    console.log(strem.key);
                    return (
                      <StreamInputComponent
                        key={strem.key}
                        title={strem.title}
                        value={streams[strem.key] ?? ''}
                        onChangeText={(value) =>
                          handleInputChange(
                            strem.key,
                            value.replace(/[^0-9]/g, '')
                          )
                        }
                      />
                    );
                  })}
                </View>
              </View>
            ))}
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
  body: {
    paddingHorizontal: 20,
    gap: 20,
  },
  streamNumberContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  streamNumberText: {
    textAlign: 'left',
  },
  streamNumber: {
    fontSize: 16,
    fontWeight: 'bold',
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
  incDecrButton: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    elevation: 2,
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
