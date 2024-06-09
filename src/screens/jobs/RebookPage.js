import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment'; // For handling dates
import Header from '../../components/Header';
import { AppContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';
import { useSQLiteContext } from 'expo-sqlite/next';
const { width } = Dimensions.get('window');

const RebookPage = () => {
  db = useSQLiteContext();  
  const appContext = useContext(AppContext);
  const { rebook, jobID,setRebook  } = appContext;
  const handleInputChange = (key, value) => {
    setRebook((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log('Rebook', rebook);
  };
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const twoWeeksFromNow = moment().add(14, 'days').format('YYYY-MM-DD');
  // const minDate = moment().add(1, 'days').format('YYYY-MM-DD');

  const saveToDatabase = async () => {
    const rebookDetailsJson = JSON.stringify(rebook);
    console.log("message:292 rebook values:", rebookDetailsJson);
    try {
      await db.runAsync('UPDATE Jobs SET rebook = ? WHERE id = ?', [
        rebookDetailsJson,
        jobID,
      ]);
    } catch (error) {
      console.error('Error saving streams to database:', error);
    }
  };
    // Create a JSON object with all details
   
  const handleConfirmRebook = () => {
    if (rebook.rebookToday === null) {
      Alert.alert('Please state if the job can be rebooked today.');
      return;
    }

    if (rebook.rebookToday === false) {
      saveToDatabase.then(() => {
        goToNextStep();
      });
      return;
    }

    Alert.alert(
      'Confirm Rebook Date',
      `Are you sure you want to rebook for ${rebook.selectedDate}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            console.log('Rebook Confirmed for:', rebook.selectedDate);
            saveToDatabase.then(() => {
              goToNextStep();
            });
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
          <Button title="Yes" onPress={() =>handleInputChange('rebookToday',true)} />
          <Button title="No" onPress={() => handleInputChange('rebookToday',false)} />
        </View>

        {rebook.rebookToday === true && (
          <Calendar
            minDate={twoWeeksFromNow}
            onDayPress={(day) => {
              handleInputChange("selectedDate",day.dateString)
            }}
            markedDates={{
              [rebook.selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'blue',
                selectedTextColor: 'white',
              },
            }}
            disableAllTouchEventsForDisabledDays={true}
          />
        )}

        {rebook.rebookToday === false && (
          <TextInput
            style={styles.input}
            onChangeText={(txt) => {handleInputChange("rebookReason",txt)}}
            value={rebook.rebookReason}
            placeholder="Why can't it be rebooked?"
          />
        )}

        {/* <Button title="Next" onPress={handleConfirmRebook} /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
  },
  question: {
    fontSize: width * 0.05,
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
  },
});

export default RebookPage;
