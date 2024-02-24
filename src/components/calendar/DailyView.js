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

  const handleBackToMonthView = () => {
    // Assuming goBackToMonthView is a function that navigates to the month view
    // and accepts a date string (e.g., "2023-02-20") to determine which month to display
    goBackToMonthView(selectedDate);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.dateHeader}>
        <TouchableOpacity onPress={goPrevDay}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.dateText}>{selectedDate}</Text>
        <TouchableOpacity onPress={goNextDay}>
          <MaterialCommunityIcons name="arrow-right" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.navigationRow}>
        <TouchableOpacity onPress={handleBackToMonthView}>
          <Text style={styles.navigationButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsModalVisible(true)}>
          <Text style={styles.navigationButtonText}>Holiday</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {schedules?.length === 0 || !schedules ? (
          <Text style={styles.noDataText}>There is no data to show</Text>
        ) : (
          schedules.map((item, index) => (
            <TouchableOpacity key={index} style={styles.eventContainer} onPress={() => console.log('Pressed schedule:', item)}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventTime}>{`${item.startTime} - ${item.endTime}`}</Text>
              <Text style={styles.eventLocation}>{item.location}</Text>
              <Text style={styles.eventDescription}>{item.description}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Holiday Settings</Text>
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
