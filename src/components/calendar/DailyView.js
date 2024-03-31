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
import { AgendaList, CalendarProvider } from 'react-native-calendars';

const { width, height } = Dimensions.get('window');

export default function DailyView({
  selectedDate,
  schedules,
  goNextDay,
  goPrevDay,
  goBackToMonthView,
  sections
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleBackToMonthView = () => {
    goBackToMonthView(selectedDate);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Existing component code remains unchanged */}
      <Text style={styles.selectedDate}>{selectedDate}</Text>
     {
      sections.map((item)=>{
        return(
          <TouchableOpacity onPress={() => { }}>
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
        )
      })
     }
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
});
