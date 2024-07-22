import React from 'react';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import {
  View,
  Text,
  Alert,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

// Components
import Header from '../../components/Header';

// Context & Utils
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const RebookPage = () => {
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const { state, setState } = useFormStateContext();
  const { rebook } = state;

  const handleInputChange = (key, value) => {
    setState({
      ...state,
      rebook: {
        ...rebook,
        [key]: value,
      },
    });
  };

  const twoWeeksFromNow = moment().add(14, 'days').format('YYYY-MM-DD');

  const handleConfirmRebook = async () => {
    if (rebook?.rebookToday === null) {
      Alert.alert('Please state if the job can be rebooked today.');
      return;
    }

    if (rebook?.rebookToday === false) {
      goToNextStep();
      return;
    }

    Alert.alert(
      'Confirm Rebook Date',
      `Are you sure you want to rebook for ${rebook?.selectedDate}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            console.log('Rebook Confirmed for:', rebook?.selectedDate);
            goToNextStep();
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    goToPreviousStep();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'Rebooking'}
        leftBtnPressed={handleGoBack}
        rightBtnPressed={handleConfirmRebook}
      />
      <View style={styles.container}>
        <Text style={styles.question}>Can job be rebooked today?</Text>
        <View style={styles.optionsContainer}>
          <Button
            title="Yes"
            onPress={() => handleInputChange('rebookToday', true)}
          />
          <Button
            title="No"
            onPress={() => handleInputChange('rebookToday', false)}
          />
        </View>

        {rebook?.rebookToday === true && (
          <Calendar
            minDate={twoWeeksFromNow}
            onDayPress={(day) => {
              handleInputChange('selectedDate', day.dateString);
            }}
            markedDates={{
              [rebook?.selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'blue',
                selectedTextColor: 'white',
              },
            }}
            disableAllTouchEventsForDisabledDays={true}
          />
        )}

        {rebook?.rebookToday === false && (
          <TextInput
            style={styles.input}
            onChangeText={(txt) => {
              handleInputChange('rebookReason', txt);
            }}
            value={rebook?.rebookReason}
            placeholder="Why can't it be rebooked?"
            multiline={true}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    minHeight: 100,
  },
});

export default RebookPage;
