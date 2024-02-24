import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Button
} from "react-native";
import { width, height, unitH } from "../../utils/constant";
import { PrimaryColors } from "../../theme/colors";
import { useNavigation } from "@react-navigation/native";
import { Calendar, Agenda } from "react-native-calendars";
import moment from "moment";
import Text from "../../components/Text";
import Header from "../../components/Header";
import OptionalButton from "../../components/OptionButton";
import DailyView from "../../components/calendar/DailyView";
import WeeklyCalendarScreen from "../../components/calendar/WeeklyView";
import { MaterialCommunityIcons } from "@expo/vector-icons"



export const sampleEvents = {
  ["2024-02-20"]: [
    {
      title: "Team Meeting",
      startTime: "9:30 AM",
      endTime: "10:30 AM",
      location: "Conference Room",
      description: "Discuss project progress and assign tasks",
    },
    {
      title: "Training Session",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      location: "Training Room",
      description: "Learn new technologies and tools",
    },
  ],
  ["2024-02-21"]: [
    {
      title: "Meeting with Client",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
      location: "Office",
      description: "Discuss project requirements and deliverables",
    },
    {
      title: "Lunch Break",
      startTime: "12:00 PM",
      endTime: "1:00 PM",
      location: "Cafeteria",
      description: "Enjoy lunch with colleagues",
    },
  ],
  ["2024-02-22"]: [
    {
      title: "Team Meeting",
      startTime: "9:30 AM",
      endTime: "10:30 AM",
      location: "Conference Room",
      description: "Discuss project progress and assign tasks",
    },
    {
      title: "Training Session",
      startTime: "2:00 PM",
      endTime: "4:00 PM",
      location: "Training Room",
      description: "Learn new technologies and tools",
    },
  ],
};

const EventModal = ({ isVisible, onClose, onSubmit, event = {} }) => {
  const [title, setTitle] = useState(event.title || '');
  const [startTime, setStartTime] = useState(event.startTime || '');
  const [endTime, setEndTime] = useState(event.endTime || '');
  const [description, setDescription] = useState(event.description || '');

  const handleSubmit = () => {
    const eventData = { title, startTime, endTime, location, description };
    onSubmit(eventData);
    onClose();
  };
  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
        <TextInput placeholder="Start Time" value={startTime} onChangeText={setStartTime} style={styles.input} />
        <TextInput placeholder="End Time" value={endTime} onChangeText={setEndTime} style={styles.input} />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
        <Button title="Submit" onPress={handleSubmit} />
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const API_BASE_URL = 'https://test.ecomdata.com/api/calendar-events';
const fetchEvents = async (date) => {
  try {
    const response = await fetch(`${API_BASE_URL}?date=${date}`);
    const data = await response.json();
    return data.events; // Adjust according to your API response structure
  } catch (error) {
    console.error('Fetching events failed:', error);
    return [];
  }
};

const sendEvent = async (eventData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    return response.json(); // Adjust according to your API response structure
  } catch (error) {
    console.error('Sending event failed:', error);
  }
};

// EventModal Component



function CalendarPage() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [viewMode, setViewMode] = useState("Month"); //DAILY
  const today = moment().format("YYYY-MM-DD");

  const [schedules, setSchedules] = useState([]);
  const [agendaItem, setAgendaItem] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    const _schedules = {};

    Object.keys(sampleEvents).forEach((date) => {
      _schedules[date] = { marked: true };
    });
    console.log(_schedules);
    setSchedules(_schedules);
  }, []);

  const backPressed = () => {
    navigation.goBack();
  };

  const renderArrow = (direction) => {
    const iconName = direction === "left" ? "arrow-left" : "arrow-right";
    return (
      <MaterialCommunityIcons name={iconName} size={unitH * 30} color="black" />
    );
  };

  const goNextDay = () => {
    //'2023-10-18'
    const currentDate = moment(selectedDate);
    const nextDay = currentDate.add(1, "day").format("YYYY-MM-DD"); // Add 1 day and format as 'YYYY-MM-DD'
    console.log(nextDay); // Output: 2023-10-19
    setSelectedDate(nextDay);
  };

  const goPrevDay = () => {
    const currentDate = moment(selectedDate);
    const prevDay = currentDate.subtract(1, "day").format("YYYY-MM-DD"); // Add 1 day and format as 'YYYY-MM-DD'
    console.log(prevDay); // Output: 2023-10-19
    setSelectedDate(prevDay);
  };

  return (
    <SafeAreaView style={styles.body}>
      <Header
        hasLeftBtn={true}
        hasMenuButton={false}
        hasCenterText={true}
        hasRightBtn={false}
        centerText="Calendar"
        leftBtnPressed={() => navigation.goBack()}
      />
        <View style={{ flex: 1, width: "100%" }}>
          <View style={{ paddingVertical: unitH * 20, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <OptionalButton
              options={["Month", "Week", "Day"]}
              style={{ width: 55, height: 40 }}
              actions={[
                () => {
                  setViewMode("Month");
                },
                () => {
                  setViewMode("Week");
                },
                () => {
                  setViewMode("Day");
                },
              ]}
              value={viewMode}
            />
          </View>
          {viewMode === "Month" && (
            <Calendar
              style={{ paddingBottom: unitH * 15 }}
              headerStyle={{ marginBottom: unitH * 10 }}
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setViewMode("Day");
              }}
              markedDates={schedules}
              minDate={moment().format("YYYY-MM-DD")}
              hideExtraDays={true}
              enableSwipeMonths={true}
              allowSelectionOutOfRange={true}
              renderArrow={(direction) => (
                <MaterialCommunityIcons name={`arrow-${direction}`} size={unitH * 30} color="black" />
              )}
            />
          )}  
          {viewMode === "Week" && (
            <Agenda
            selected={selectedDate}
            items={agendaItem}
            onDayPress={(day) => {
              console.log("Selected day:", day);
              let dateString = day.dateString;
              setSelectedDate(dateString);
              setAgendaItem({
                [dateString]: sampleEvents[dateString],
              });
            }}
            renderItem={(item, firstItemInDay) => {
              return (
                <TouchableOpacity onPress={() => {}}>
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
              );
            }}
            hideKnob={true}
            renderEmptyData={() => (
              <View style={styles.noEventDataContainer}>
                <Text style={styles.noEventDataText}>
                  No events for this day
                </Text>
              </View>
            )}
           
          />)}

          {viewMode === "Day" && (
            <DailyView
              selectedDate={selectedDate}
              schedules={sampleEvents[selectedDate]}
              goNextDay={() => {
                const nextDay = moment(selectedDate).add(1, "day").format("YYYY-MM-DD");
                setSelectedDate(nextDay);
              }}
              goPrevDay={() => {
                const prevDay = moment(selectedDate).subtract(1, "day").format("YYYY-MM-DD");
                setSelectedDate(prevDay);
              }}
              openModal={() => setModalVisible(true)}
            />
          )}
        </View>
    
      <EventModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(eventData) => {
          handleEventSubmit(eventData);
          // After submitting, you might want to refresh the events or handle the state update accordingly
        }}
      />
    </SafeAreaView>
  );
      }
      
      
const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollView: {
    width: width,
    height: height,
  },
  body: {
    flex: 1,
    // width: width,
    // height: height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  spacer: {
    height: unitH * 30,
  },
  button: {
    width: "80%",
    height: unitH * 150,
    backgroundColor: PrimaryColors.White,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: PrimaryColors.Blue,
    //
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: {
      width: 2.5,
      height: 2.5,
    },
  },
  buttonTxt: {
    color: "black",
    fontSize: 20,
    fontWeight: "500",
  },
  calendarButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  calendarButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  calendarButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  eventContainer: {
    backgroundColor: "#F5F5F5",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
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
    justifyContent: "center",
    alignItems: "center",
  },
  noEventDataText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
});

export default CalendarPage;
