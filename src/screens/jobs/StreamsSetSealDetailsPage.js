import {
  View,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useContext, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import { TextType } from '../../theme/typography';
import TextInput from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { AppContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';
import { useSQLiteContext } from 'expo-sqlite/next';

const RepeatComponent = ({ title, value, onChangeText }) => {
  return (
    <View style={styles.repeatComponentContainer}>
      <View style={styles.titleContainer}>
        <Text type={TextType.BODY_1} style={styles.titleStyle}>
          {title}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={String(value)} // Ensure the value is a string
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
  const { streams, jobID, setStreams } = appContext;
  
  const db = useSQLiteContext();
  const route = useRoute();
  const { title } = route?.params ?? {};

  const handleInputChange = (key, value) => {
    setStreams((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log('Streams', streams);
  };

  useEffect(() => {
    if (isNaN(streams.Number)) {
      handleInputChange('Number', 0);
    }
  }, [streams.Number]);

  const saveToDatabase = async () => {
    const streamDetailsJson = JSON.stringify(streams);
    console.log("message:292 Stream values:", streams);
    console.log("message:293 number of streams:", streams.Number);
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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
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
                    handleInputChange('Number', Math.max(Number(streams.Number) - 1, 0));
                  }
                }}
              >
                <Text>-</Text>
              </TouchableHighlight>
              <Text style={styles.streamNumber}>{streams.Number}</Text>
              <TouchableHighlight
                style={styles.incDecrButton}
                onPress={() => {
                  handleInputChange('Number', Number(streams.Number) + 1);
                }}
              >
                <Text>+</Text>
              </TouchableHighlight>
            </View>

            {Array.from({ length: streams.Number }, (_, index) => (
              <View key={index} style={styles.streamContainer}>
                <Text type={TextType.CAPTION_2}>{`Stream ${index + 1}`}</Text>
                <View style={styles.section}>
                  <RepeatComponent
                    title={'Slam Shut'}
                    value={streams[`slamShut${index + 1}`] ?? ''}
                    onChangeText={(value) =>
                      handleInputChange(`slamShut${index + 1}`, value.replace(/[^0-9]/g, ''))
                    }
                  />
                  <RepeatComponent
                    title={'Creep Relief'}
                    value={streams[`creepRelief${index + 1}`] ?? ''}
                    onChangeText={(value) =>
                      handleInputChange(`creepRelief${index + 1}`, value.replace(/[^0-9]/g, ''))
                    }
                  />
                  <RepeatComponent
                    title={'Working Pressure'}
                    value={streams[`workingPressure${index + 1}`] ?? ''}
                    onChangeText={(value) =>
                      handleInputChange(`workingPressure${index + 1}`, value.replace(/[^0-9]/g, ''))
                    }
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
