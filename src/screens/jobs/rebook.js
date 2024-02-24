import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Button, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment'; // For handling dates

const { width } = Dimensions.get('window');

const RebookPage = () => {
  const [canRebookToday, setCanRebookToday] = useState(null);
  const [rebookReason, setRebookReason] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const twoWeeksFromNow = moment().add(14, 'days').format('YYYY-MM-DD');
  const minDate = moment().add(1, 'days').format('YYYY-MM-DD');

  const handleConfirmRebook = () => {
    Alert.alert(
      "Confirm Rebook Date",
      `Are you sure you want to rebook for ${selectedDate}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("Rebook Confirmed for:", selectedDate) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>Can job be rebooked today?</Text>
      <View style={styles.optionsContainer}>
        <Button title="Yes" onPress={() => setCanRebookToday(true)} />
        <Button title="No" onPress={() => setCanRebookToday(false)} />
      </View>

      {canRebookToday === true && (
        <Calendar
          minDate={minDate}
          maxDate={twoWeeksFromNow}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
          }}
          markedDates={{
            [selectedDate]: {selected: true, disableTouchEvent: true, selectedColor: 'blue', selectedTextColor: 'white'}
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

      <Button title="Next" onPress={handleConfirmRebook} />
    </View>
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
