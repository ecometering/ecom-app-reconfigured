import {
  View,
  Modal,
  Button,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, Agenda } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Components
import Text from '../Text';
import Tabs from '../Tabs';

// Utils
import { PrimaryColors } from '../../theme/colors';

const API_BASE_URL = 'https://test.ecomdata.co.uk/api/events';

const EventModal = ({ isVisible, onClose, onSubmit, event = {} }) => {
  const [title, setTitle] = useState(event.title || '');
  const [location, setLocation] = useState(event.location || '');
  const [startTime, setStartTime] = useState(event.startTime || '');
  const [endTime, setEndTime] = useState(event.endTime || '');
  const [description, setDescription] = useState(event.description || '');

  const handleSubmit = () => {
    const eventData = { title, location, startTime, endTime, description };
    onSubmit(eventData);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Holiday Settings</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            value={startTime}
            onChangeText={setStartTime}
          />
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD)"
            value={endTime}
            onChangeText={setEndTime}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const fetchEvents = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    const data = response.data || [];
    const formattedEvents = data.reduce((acc, curr) => {
      const { start_date, title, ...rest } = curr;
      const date = moment(start_date).format('YYYY-MM-DD');
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push({ title, ...rest });
      return acc;
    }, {});
    return formattedEvents;
  } catch (error) {
    console.error('Fetching events failed:', error);
    return {};
  }
};

const AddEventButton = ({ onPress }) => (
  <TouchableOpacity
    style={{
      backgroundColor: PrimaryColors.Green,
      padding: 10,
      borderRadius: 5,
    }}
    onPress={onPress}
  >
    <Text style={{ color: 'white' }}>Add Event</Text>
  </TouchableOpacity>
);

const handleEventSubmit = async (eventData) => {
  try {
    const response = await axios.post(API_BASE_URL, {
      event_name: eventData.title,
      description: eventData.description,
      start_date: eventData.startTime,
      end_date: eventData.endTime,
      event_type: 4, // Holiday
      is_all_day: true,
      is_public: true,
      is_organisation: true,
      repeat_type: 'None',
      reminder_time: null,
    });

    if (response.status === 200) {
      alert('Event created successfully');
    } else {
      alert('Failed to create event');
    }
  } catch (error) {
    alert('Error submitting form: ' + error.message);
  }
};

// TODO Redesign this component its causing infinite re-renders and memory leaks
const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [viewMode, setViewMode] = useState('Month');
  const [schedules, setSchedules] = useState({});
  const [agendaItem, setAgendaItem] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  // // Warning - this function is recreated on every render cycle causing unnecessary re-renders
  // // keep it in useCallback to memoize the function
  // const loadEvents = useCallback(async () => {
  //   const events = await fetchEvents();
  //   setSchedules(events);
  // }, []);

  // useEffect(() => {
  //   loadEvents();
  // }, [loadEvents]);

  return (
    <SafeAreaView style={styles.body}>
      <View style={{ flex: 1, width: '100%' }}>
        <Tabs
          options={['Month', 'Week', 'Day']}
          style={styles.optionButton}
          actions={[
            () => setViewMode('Month'),
            () => setViewMode('Week'),
            () => setViewMode('Day'),
          ]}
          value={viewMode}
        />
        {viewMode === 'Month' && (
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setViewMode('Day');
            }}
            markedDates={schedules}
            hideExtraDays
            enableSwipeMonths
            renderArrow={(direction) => (
              <MaterialCommunityIcons
                name={`arrow-${direction}`}
                color="black"
                size={20}
              />
            )}
          />
        )}
        {(viewMode === 'Week' || viewMode === 'Day') && (
          <Agenda
            markedDates={schedules}
            selected={selectedDate}
            items={agendaItem}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setViewMode('Day');
            }}
            style={{
              minHeight: 310,
            }}
            renderItem={(item) => (
              <TouchableOpacity>
                <View style={styles.eventContainer}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text
                    style={styles.eventTime}
                  >{`${item.startTime} - ${item.endTime}`}</Text>
                  <Text style={styles.eventLocation}>{item.location}</Text>
                  <Text style={styles.eventDescription}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            renderEmptyData={() => (
              <View style={styles.noEventDataContainer}>
                <Text style={styles.noEventDataText}>
                  No events for this day
                </Text>
                <AddEventButton onPress={() => setModalVisible(true)} />
              </View>
            )}
          />
        )}
      </View>
      <EventModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleEventSubmit}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  viewModeContainer: {},
  optionButton: {
    width: 55,
    height: 40,
  },
  eventContainer: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 16,
    marginBottom: 5,
  },
  eventLocation: {
    fontSize: 16,
    marginBottom: 5,
  },
  eventDescription: {
    fontSize: 14,
  },
  noEventDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noEventDataText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
  },
});

export default CalendarComponent;
