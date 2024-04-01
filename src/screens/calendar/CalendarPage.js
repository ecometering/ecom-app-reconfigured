import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
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
import { Calendar, Agenda, WeekCalendar } from "react-native-calendars";
import moment from "moment";
import Text from "../../components/Text";
import Header from "../../components/Header";
import OptionalButton from "../../components/OptionButton";
import DailyView from "../../components/calendar/DailyView";
import { MaterialCommunityIcons } from "@expo/vector-icons"

export const sampleEvents = {
  ["2024-03-31"]: [
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
  ["2024-03-21"]: [
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
  ["2024-03-22"]: [
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
  const [location, setLocation] = useState(event.title || '');
  const [startTime, setStartTime] = useState(event.startTime || '');
  const [endTime, setEndTime] = useState(event.endTime || '');
  const [description, setDescription] = useState(event.description || '');

  const handleSubmit = () => {
    const eventData = { title, startTime, endTime, location, description };
    onSubmit(eventData);
    onClose();
  };


  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
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
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
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
          <Button title="Submit" onPress={handleSubmit} />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </View>
  </Modal>
  );
};

const fetchEvents = async () => {
  try {
    const response = await fetch('https://test.ecomdata.co.uk/api/events');
    const data = await response.json();
    console.log("data-------->", data)

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventSubmit = async (eventData) => {
    try {
      const response = await fetch('https://test.ecomdata.co.uk/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_name: eventData.title,
          description: eventData.description,
          start_date: eventData.startDate,
          end_date: eventData.endDate,
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
        hasRightBtn={viewMode === "Day"}
        rightBtnText={"Book holiday"}
        rightBtnPressed={() => setModalVisible(true)}
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

              let dateString = day.dateString;
              setSelectedDate(dateString);
              setAgendaItem({
                [dateString]: sampleEvents[dateString],
              });

              setViewMode("Day");
            }}
            markedDates={schedules}
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
            markedDates={schedules}
            selected={selectedDate}
            items={agendaItem}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);

              let dateString = day.dateString;
              setSelectedDate(dateString);
              setAgendaItem({
                [dateString]: sampleEvents[dateString],
              });

              setViewMode("Day");
            }}
            renderItem={(item, firstItemInDay) => {
              return (
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
              );
            }}
            // hideKnob={true}
            showClosingKnob
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
            sections={!!agendaItem ? agendaItem[selectedDate] : []}
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
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: width * 0.05,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
  }
});

export default CalendarPage;
