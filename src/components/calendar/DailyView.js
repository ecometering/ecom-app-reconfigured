import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Dimensions,
  FlatList,
} from 'react-native';
import Text from '../Text';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

export default function DailyView({
  selectedDate,
  schedules,
  goNextDay,
  goPrevDay,
  goBackToMonthView,
  sections
}) {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.dailyViewContainer}>
        <View style={styles.dateContainer}>
          <Text style={styles.selectedDate}>{moment(selectedDate).date()}</Text>
          <Text style={styles.selectedDay}>{moment(selectedDate).format("ddd")}</Text>
        </View>
        <FlatList 
          data={sections}
          renderItem={({item})=>{
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
            )
          }}
          ListEmptyComponent={()=>(
            <View style={styles.noEventDataContainer}>
            <Text style={styles.noEventDataText}>
              No events for this day
            </Text>
          </View>
          )}
        />
      </View>
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
    marginBottom: height * 0.02,
    borderRadius: 5,
    marginLeft: 8,
    paddingVertical: 8,
    paddingHorizontal: 6
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
  selectedDate: {
    fontSize: 28,
    fontWeight: "100"
  },
  selectedDay: {
    fontSize: 14,
    fontWeight: "100"
  },
  dailyViewContainer : {
    display: "flex",
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#F5F5F5',
  },
  dateContainer: {
    marginTop:12
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
