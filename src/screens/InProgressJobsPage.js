import React, { useCallback, useState } from 'react';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Alert, FlatList, Text } from 'react-native';
// Components
import Header from '../components/Header';
import JobCard from '../components/JobCard';
// Utils
import { useProgressNavigation } from '../context/ProgressiveFlowRouteProvider';
import { useSQLiteContext } from 'expo-sqlite/next';
import { useFormStateContext } from '../context/AppContext';

import { fieldsToParse } from '../utils/constant';
import { safeParse } from '../utils/nagivation-routes/helpers';


const JobsTable = () => {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const { setState, resetState } = useFormStateContext();
  const { startFlow } = useProgressNavigation();
  const route = useRoute();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [route?.params])
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM jobs WHERE jobStatus = ?',
        ['In Progress']
      );
      if (result.length <= 0) {
        resetState();
      }
      setJobs(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleRowClick = async (jobId) => {
    try {
      const jobData = jobs.find(({ id }) => id === jobId);

      if (jobData) {
        const parsedJobData = { ...jobData };

        fieldsToParse.forEach((field) => {
          // Add checks to ensure that jobData[field] is defined before parsing
          if (jobData.hasOwnProperty(field) && jobData[field] !== undefined) {
            parsedJobData[field] = safeParse(
              jobData[field],
              Array.isArray(parsedJobData[field]) ? [] : {}
            );
          }
        });

        setState((prevState) => ({
          ...prevState,
          ...parsedJobData,
          jobID: jobId,
        }));

        if (parsedJobData.jobType) {
          startFlow({ newFlowType: parsedJobData.jobType });
        }
      }
    } catch (error) {
      console.error('Error loading job:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    Alert.alert('Delete Job', 'Are you sure you want to delete this job?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await db.runAsync('DELETE FROM Jobs WHERE id = ?', [jobId]);
            fetchData();
          } catch (error) {
            console.error('Error deleting record:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.body}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={false}
        centerText={'Jobs in progress'}
        leftBtnPressed={() => navigation.goBack()}
      />
      <FlatList
        data={jobs}
        style={styles.listContainer}
        renderItem={({ item }) => (
          <JobCard
            loading={loading}
            item={item}
            handleOnCardClick={handleRowClick}
            buttonConfig={[
              {
                text: 'Delete',
                backgroundColor: 'red',
                textColor: 'white',
                onPress: () => handleDeleteJob(item.id),
              },
            ]}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.noJobsText}>No jobs available</Text>
        )}
        refreshing={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
    gap: 10,
  },
  noJobsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});

export default JobsTable;
