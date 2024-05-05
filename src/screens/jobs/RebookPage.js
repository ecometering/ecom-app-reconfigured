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
import { openDatabase } from '../../utils/database';
import Header from '../../components/Header';
import { AppContext } from '../../context/AppContext';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const RebookPage = () => {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const [canRebookToday, setCanRebookToday] = useState(null);
  const [rebookReason, setRebookReason] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const jobID = appContext.jobID;

  const twoWeeksFromNow = moment().add(14, 'days').format('YYYY-MM-DD');
  // const minDate = moment().add(1, 'days').format('YYYY-MM-DD');

  const updateRebookDetails = async () => {
    const db = await openDatabase();

    // Create a JSON object with all details
    const rebookDetailsJSON = JSON.stringify({
      canRebookToday,
      selectedDate: canRebookToday ? selectedDate : null,
      rebookReason: canRebookToday ? null : rebookReason,
    });

    db.transaction((tx) => {
      // Update the database with the JSON object
      tx.executeSql(
        'UPDATE Jobs SET rebook = ? WHERE id = ?',
        [rebookDetailsJSON, jobID],
        (_, results) => {
          console.log('Rebook details updated successfully', results);
        },
        (tx, error) => {
          console.log('Failed to update rebook details', error);
        }
      );
    });
  };
  const handleConfirmRebook = () => {
    if (canRebookToday === false) {
      updateRebookDetails().then(() => {
        navigation.navigate('SubmitSuccessPage');
      });
      return;
    }
    Alert.alert(
      'Confirm Rebook Date',
      `Are you sure you want to rebook for ${selectedDate}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            console.log('Rebook Confirmed for:', selectedDate);
            updateRebookDetails().then(() => {
              navigation.navigate('SubmitSuccessPage');
            });
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    navigation.goBack();
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
          <Button title="Yes" onPress={() => setCanRebookToday(true)} />
          <Button title="No" onPress={() => setCanRebookToday(false)} />
        </View>

        {canRebookToday === true && (
          <Calendar
            minDate={twoWeeksFromNow}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedColor: 'blue',
                selectedTextColor: 'white',
              },
            }}
            disableAllTouchEventsForDisabledDays={true}
          />
        )}

        {canRebookToday === false && (
          <TextInput
            style={styles.input}
            onChangeText={setRebookReason}
            value={rebookReason}
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
