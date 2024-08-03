import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// Components
import Text from '../components/Text';

// Context
import { PrimaryColors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import CalendarComponent from '../components/calendar/CalendarSection';
import JobTypeSection from '../components/JobTypeSection';
import HomeJobsListing from '../components/home-lists/HomeJobsListing';
import { useSQLiteContext } from 'expo-sqlite/next';

const buttons = [
  {
    title: 'Jobs in progress',
    navigationName: 'InProgressJobsPage',
    state: 'inProgressJobs',
  },
  {
    title: 'Completed Job',
    navigationName: 'CompletedJobsPage',
    state: 'completedJobs',
  },
  {
    title: 'Planned Job',
    navigationName: 'PlannedJobPage',
    state: 'plannedJobs',
  },
];

function HomePage() {
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const { OnLogout } = useAuth();

  const navigationToPage = ({ navigationName }) => {
    navigation.navigate(navigationName);
  };

  const [jobsListing, setJobsListing] = useState({
    inProgressJobs: [],
    completedJobs: [],
    plannedJobs: [],
  });

  const [jobListLength, setJobListLength] = useState({
    inProgressJobs: 0,
    completedJobs: 0,
    plannedJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  console.log('HomePage');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch last 3 jobs for each job status
      const inProgressJobs = await db.getAllAsync(
        'SELECT * FROM jobs WHERE jobStatus = ? ORDER BY startDate DESC LIMIT 3',
        ['In Progress']
      );
      const completedJobs = await db.getAllAsync(
        'SELECT * FROM jobs WHERE jobStatus = ? ORDER BY endDate DESC LIMIT 3',
        ['Completed']
      );
      const plannedJobs = await db.getAllAsync(
        'SELECT * FROM jobs WHERE jobStatus = ? LIMIT 3',
        ['Planned']
      );
      setJobsListing({
        inProgressJobs,
        completedJobs,
        plannedJobs,
      });

      // Fetch job count for each job status
      const inProgressJobsLength = await db.getAllAsync(
        'SELECT COUNT(*) FROM jobs WHERE jobStatus = ?',
        ['In Progress']
      );
      const completedJobsLength = await db.getAllAsync(
        'SELECT COUNT(*) FROM jobs WHERE jobStatus = ?',
        ['Completed']
      );
      const plannedJobsLength = await db.getAllAsync(
        'SELECT COUNT(*) FROM jobs WHERE jobStatus = ?',
        ['Planned']
      );

      setJobListLength({
        inProgressJobs: inProgressJobsLength.find((item) => item['COUNT(*)'])?.[
          'COUNT(*)'
        ],
        completedJobs: completedJobsLength.find((item) => item['COUNT(*)'])?.[
          'COUNT(*)'
        ],
        plannedJobs: plannedJobsLength.find((item) => item['COUNT(*)'])?.[
          'COUNT(*)'
        ],
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.body}>
          <CalendarComponent />
          <JobTypeSection />
          {buttons.map((button) => (
            <HomeJobsListing
              key={button.title}
              title={button.title}
              onPress={() => {
                navigationToPage({ navigationName: button.navigationName });
              }}
              data={jobsListing[button.state]}
              length={jobListLength[button.state]}
              loading={loading}
            />
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
