import React, { useContext } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { height, unitH } from '../utils/constant';
import { PrimaryColors } from '../theme/colors';
import { EcomPressable as Button } from '../components/ImageButton';
import Text from '../components/Text';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getDatabaseJob } from '../utils/database';

function HomePage() {
  const navigation = useNavigation();

  const { OnLogout } = useAuth();
  const appContext = useContext(AppContext);
  const navigationToPage = ({ navigationName }) => {
    navigation.navigate(navigationName);
  };
  const checkJobsAndNavigate = async () => {
    try {
      const jobs = (await getDatabaseJob()) || []; // Ensure an array is always returned
      const inProgressJobs = jobs.filter((job) => job.status === 'In Progress');

      if (inProgressJobs.length >= 6) {
        Alert.alert(
          'Limit Reached',
          'Please finish or delete existing jobs to continue.'
        );
      } else {
        navigationToPage({ navigationName: 'NewJobPage' });
      }
    } catch (error) {
      console.error('Failed to check job status', error);
      Alert.alert('Error', 'Failed to fetch job data.'); // Now Alert should work
    }
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.body}>
          <Button
            onPress={() => {
              navigationToPage({ navigationName: 'CalendarPage' });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Engineers Calendar</Text>
          </Button>
          <Button
            onPress={() => {
              navigationToPage({ navigationName: 'NewJobPage' });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>New Job</Text>
          </Button>
          <Button
            onPress={() => {
              navigationToPage({ navigationName: 'PlannedJobPage' });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Planned Job</Text>
          </Button>

          <Button
            onPress={() => {
              navigationToPage({ navigationName: 'InProgressJobsPage' });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Jobs in progress</Text>
          </Button>
          <Button
            onPress={() => {
              navigationToPage({ navigationName: 'CompletedJobsPage' });
            }}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Completed Job</Text>
          </Button>
        
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
  spacer: {
    height: unitH * 30,
  },
  button: {
    height: unitH * 150,
    backgroundColor: PrimaryColors.White,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PrimaryColors.Black,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  buttonTxt: {
    color: 'black',
    fontSize: 20,
    fontWeight: '500',
  },
});

export default HomePage;
