
import React, {useContext, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import {useNavigation} from '@react-navigation/native';
import { width, height, unitH} from '../../utils/constant';
import {TextType} from '../../theme/typography';
import TextInput from '../../components/TextInput';
import NumberInput from '../../components/NumberInput';
import {AppContext} from '../../context/AppContext';
import EcomHelper from '../../utils/ecomHelper';

const RepeatComponent = ({title, onChangeText, value}) => {
  const containerStyle = {width: width * 0.25};
  const titleContainerStyle = {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  };
  const titleStyle = {textAlign: 'left', fontWeight: '800'};
  return (
    <View style={containerStyle}>
      <View style={titleContainerStyle}>
        <Text type={TextType.BODY_1} style={titleStyle}>
          {title}
        </Text>
      </View>
      <View style={{...styles.row, width: width * 0.1}}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.input}
          keyboardType="numeric"
        />
        <View style={styles.spacer2} />
        <Text type={TextType.BUTTON_1}>{'mbar'}</Text>
      </View>
    </View>
  );
};

function StreamsSetSealDetailsPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const [n, setN] = useState(appContext.streamNumber);
  const [streamValue, setStreamValue] = useState(appContext.streamValue);
  const jobType = appContext.jobType;
  const pageTitle = jobType === 'Install' ? 'New Meter Details' : jobType;

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
    navigation.navigate('SealedSlamShutPhotoPage');
  };
  const backPressed = () => {
    appContext.setStreamValue(streamValue);
    appContext.setStreamNumber(n);
    navigation.goBack();
  };

  const handleChangeValue = newValue => {
    console.log('New value:======', newValue);
    setN(newValue);
  };

  const handleFieldChange = (value, index, field) => {
    // Create a copy of the streamValue array
    const updatedStreamValue = [...streamValue];
    // Update the specific field for the corresponding index
    updatedStreamValue[index] = {
      ...updatedStreamValue[index],
      // [`${field}_${index}`]: value,
      [`${field}`]: value,
    };
    // Update the state with the new streamValue array
    setStreamValue(updatedStreamValue);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <SafeAreaView style={styles.content}>
          <Header
            hasLeftBtn={true}
            hasCenterText={true}
            hasRightBtn={true}
            centerText={pageTitle}
            leftBtnPressed={backPressed}
            rightBtnPressed={nextPressed}
          />
          <View style={styles.body}>
            <Text type={TextType.CAPTION_2}>Streams Set and Seal Details</Text>
            <View style={styles.spacer} />
            <View style={{...styles.row, width: width * 0.6}}>
              <Text
                type={TextType.CAPTION_2}
                style={{...styles.text, width: width * 0.5}}>
                {'Number of streams:'}
              </Text>
              <NumberInput initial={n} handleChangeValue={handleChangeValue} />
            </View>
            <View style={styles.spacer} />
            {Array.from({length: n}, (_, index) => (
              <View style={styles.column}>
                <View style={styles.spacer} />
                <Text type={TextType.CAPTION_2}>{`stream ${index + 1}`}</Text>
                <View style={styles.section}>
                  <RepeatComponent
                    title={'Slam Shut'}
                    value={streamValue[index]?.slamShut ?? 0}
                    onChangeText={v => {
                      if (v.length > 5) {
                        EcomHelper.showInfoMessage(
                          'Max length should be less than 5',
                        );
                        return;
                      }
                      handleFieldChange(v, index, 'slamShut');
                    }}
                  />
                  <RepeatComponent
                    title={'Creep Relief'}
                    value={streamValue[index]?.creepRelief ?? 0}
                    onChangeText={v => {
                      if (v.length > 5) {
                        EcomHelper.showInfoMessage(
                          'Max length should be less than 5',
                        );
                        return;
                      }
                      handleFieldChange(v, index, 'creepRelief');
                    }}
                  />
                  <RepeatComponent
                    title={'Working Pressure'}
                    value={streamValue[index]?.workingPressure ?? 0}
                    onChangeText={v => {
                      if (v.length > 5) {
                        EcomHelper.showInfoMessage(
                          'Max length should be less than 5',
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
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: width,
    height: height,
  },
  keyboard: {
    // width: width,
    // height: height,
  },
  content: {
    flex: 1,
  },
  body: {
    alignItems: 'center',
    marginVerticalHorizontal: width * 0.1,
  },
  row: {
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  column: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  text: {
    width: width * 0.5,
    textAlign: 'left',
    lineHeight: unitH * 20,
  },
  section: {
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
  },
  noteContainer: {
    width: width * 0.9,
    alignSelf: 'center',
  },
  input: {
    height: unitH * 40,
    alignSelf: 'center',
  },

  spacer: {
    height: unitH * 20,
  },
  spacer2: {width: 5},
});

export default StreamsSetSealDetailsPage;
