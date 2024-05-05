import React, { useContext, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextType } from '../../theme/typography';
import TextInput from '../../components/TextInput';
import NumberInput from '../../components/NumberInput';
import { AppContext } from '../../context/AppContext';
import EcomHelper from '../../utils/ecomHelper';

const { width, height } = Dimensions.get('window');

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
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const [n, setN] = useState(appContext.streamNumber);
  const [streamValue, setStreamValue] = useState(appContext.streamValue);
  const jobType = appContext.jobType;
  const route = useRoute();
  const { title, nextScreen, jobId } = route?.params ?? {};

  console.log('StreamsSetSealDetailsPage');

  const nextPressed = () => {
    console.log(streamValue);

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
    appContext.setStreamValue(streamValue);
    appContext.setStreamNumber(n);
    navigation.navigate(nextScreen);
  };

  const backPressed = () => {
    appContext.setStreamValue(streamValue);
    appContext.setStreamNumber(n);
    navigation.goBack();
  };

  const handleChangeValue = (newValue) => {
    console.log('New value:======', newValue);
    setN(newValue);
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
            <View style={styles.spacer} />
            <View style={styles.streamNumberContainer}>
              <Text type={TextType.CAPTION_2} style={styles.streamNumberText}>
                {'Number of streams:'}
              </Text>
              <NumberInput initial={n} handleChangeValue={handleChangeValue} />
            </View>
            <View style={styles.spacer} />
            {Array.from({ length: n }, (_, index) => (
              <View style={styles.streamContainer}>
                <View style={styles.spacer} />
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
  scrollViewContent: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
  },
  streamNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
  streamNumberText: {
    flex: 1,
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
});

export default StreamsSetSealDetailsPage;
