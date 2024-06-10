import React, { useEffect, useState,useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text, StyleSheet, FlatList } from 'react-native';

// Components
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { useSQLiteContext } from 'expo-sqlite/next';
import LoadJob from '../utils/loadJob';
import { AppContext } from '../context/AppContext';

// Utils
import { useProgressNavigation } from '../context/ExampleFlowRouteProvider';

const CompletedJobsTable = () => {
  const db = useSQLiteContext();
  const appContext = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();
  const { startFlow } = useProgressNavigation();

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM jobs WHERE jobStatus = ?',
        ['Completed']
      );
      setJobs(result);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };
  const handleRowClick = async (jobId) => {
    try {
      const jobData = await LoadJob(db, appContext, jobId);
      startFlow(jobData.jobType);
      navigation.navigate('SiteDetailsPage', { jobData });
    } catch (error) {
      console.error('Error loading job:', error);
      // Handle the error, e.g., show an error message
    }
  };


  return (
    <SafeAreaView style={styles.body}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={false}
        centerText={'Completed Jobs'}
        leftBtnPressed={() => navigation.goBack()}
      />
      <FlatList
        style={styles.listContainer}
        data={jobs}
        renderItem={({ item }) => (
          <JobCard item={item} handleOnCardClick={handleRowClick} />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <Text style={styles.noJobsText}>No jobs available</Text>
        )}
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

export default CompletedJobsTable;
