import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Button,
  TextInput,
} from 'react-native';
import Text from '../Text';
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('window');

export default function DailyView({
  selectedDate,
  schedules,
  goNextDay,
  goPrevDay,
  goBackToMonthView,
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleBackToMonthView = () => {
    goBackToMonthView(selectedDate);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://test.ecomdata.co.uk/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventName,
          description: description,
          start_date: startDate,
          end_date: endDate,
          event_type: 4, // Holiday
          is_all_day: true,
          is_public: true,
          is_organisation: true,
          repeat_type: 'None',
          reminder_time: null,
        }),
      });
      
      if (response.ok) {
        // Handle success response
        setIsModalVisible(false);
        // Reset form fields if necessary
        setEventName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
        // Optionally refresh or update the parent component state
      } else {
        // Handle error response
        alert('Failed to create event');
      }
    } catch (error) {
      alert('Error submitting form: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Existing component code remains unchanged */}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Holiday Settings</Text>
            <TextInput
              style={styles.input}
              placeholder="Event Name"
              value={eventName}
              onChangeText={setEventName}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Date (YYYY-MM-DD)"
              value={startDate}
              onChangeText={setStartDate}
            />
            <TextInput
              style={styles.input}
              placeholder="End Date (YYYY-MM-DD)"
              value={endDate}
              onChangeText={setEndDate}
            />
            <Button title="Submit" onPress={handleSubmit} />
            <Button title="Close" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * 0.02,
  },
  navigationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
  },
  dateText: {
    fontSize: width * 0.05,
    marginHorizontal: width * 0.05,
    color: 'black',
  },
  navigationButtonText: {
    fontSize: width * 0.04,
    color: 'blue',
  },
  container: {
    flexGrow: 1,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.05,
  },
  eventContainer: {
    backgroundColor: '#F5F5F5',
    padding: width * 0.04,
    marginBottom: height * 0.02,
    borderRadius: 5,
  },
  eventTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: width * 0.04,
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: width * 0.04,
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: width * 0.04,
  },
  noDataText: {
    fontSize: width * 0.05,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: width * 0.05,
  },
});
