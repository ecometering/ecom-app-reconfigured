import React, {useState} from 'react';
import {
  FlatList,
  ImageBackground,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Text from '../Text';
import { unitH, unitW} from '../../utils/constant';
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function DailyView({
  selectedDate,
  schedules,
  goNextDay,
  goPrevDay,
}) {
  return (
    <SafeAreaView>
      <View style={styles.spacer} />
      <View style={styles.spacer} />
      <View style={styles.row}>
        <TouchableOpacity onPress={goPrevDay}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={unitH * 30}
            color="black"
          />
        </TouchableOpacity>
        <Text style={styles.buttonTxt}>{selectedDate}</Text>
        <TouchableOpacity onPress={goNextDay}>
          <MaterialCommunityIcons
            name="arrow-right"
            size={unitH * 30}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.spacer} />
        {schedules?.length === 0 || schedules == null ? (
          <Text>{'There is no data to show'}</Text>
        ) : (
          schedules?.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  // Perform your desired action when a specific day is pressed
                  console.log('Pressed schedule:', item);
                  // You can display the content of the specific day here
                }}>
                <View style={styles.eventContainer}>
                  <Text style={styles.eventTitle}>{item.title}</Text>
                  <Text style={styles.eventTime}>{`${item.startTime} - ${item.endTime}`}</Text>
                  <Text style={styles.eventLocation}>{item.location}</Text>
                  <Text style={styles.eventDescription}>
                    {item.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: unitW * 50,
  },
  buttonTxt: {
    alignSelf: 'center',
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
  },
  spacer: {
    height: unitH * 30,
  },
  container: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
});
