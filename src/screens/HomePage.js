import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Components
import Text from '../components/Text';
import { EcomPressable as Button } from '../components/ImageButton';

// Context
import { PrimaryColors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import CalendarComponent from './calendar/CalendarPage';
import JobTypeSection from './JobTypePage';

const buttons = [
  {
    title: 'Planned Job',
    navigationName: 'PlannedJobPage',
  },
  {
    title: 'Jobs in progress',
    navigationName: 'InProgressJobsPage',
  },
  {
    title: 'Completed Job',
    navigationName: 'CompletedJobsPage',
  },
];

function HomePage() {
  const navigation = useNavigation();

  const { OnLogout } = useAuth();

  const navigationToPage = ({ navigationName }) => {
    navigation.navigate(navigationName);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.body}>
          <CalendarComponent />
          <JobTypeSection />
          {buttons.map((button) => (
            <Button
              onPress={() => {
                navigationToPage({ navigationName: button.navigationName });
              }}
              style={styles.button}
              key={button.navigationName}
            >
              <Text style={styles.buttonTxt}>{button.title}</Text>
            </Button>
          ))}
          <TouchableOpacity
            onPress={OnLogout}
            style={{
              backgroundColor: PrimaryColors.Red,
              padding: 20,
              borderRadius: 5,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: PrimaryColors.White }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: 20,
    gap: 20,
  },
  button: {
    height: 100,
    backgroundColor: PrimaryColors.White,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: PrimaryColors.Black,
    elevation: 5,
    borderRadius: 5,
    shadowColor: PrimaryColors.Black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  buttonTxt: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default HomePage;
