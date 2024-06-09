import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, Text, StyleSheet, FlatList } from 'react-native';

// Components
import Header from '../components/Header';
import JobCard from '../components/JobCard';

// Utils
import { loadJob } from '../utils/loadJob';
import { getDatabaseJob } from '../utils/database'; // Importing required functions
import { useProgressNavigation } from '../context/ExampleFlowRouteProvider';

const CompletedJobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();
  const { startFlow } = useProgressNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await getDatabaseJob(setJobs, 'Completed'); // Fetch completed jobs
  };

  const handleRowClick = async (jobId) => {
    try {
      const jobData = await loadJob(jobId);
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
