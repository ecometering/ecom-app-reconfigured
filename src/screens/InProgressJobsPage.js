import React, { useEffect, useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Alert, FlatList, Text } from 'react-native';
// Components
import Header from '../components/Header';
import JobCard from '../components/JobCard';
// Utils
import LoadJob from '../utils/loadJob';
import { useProgressNavigation } from '../context/ExampleFlowRouteProvider';
import { useSQLiteContext } from 'expo-sqlite/next';
import { AppContext } from '../context/AppContext';

const JobsTable = ({ route }) => {
  const db = useSQLiteContext();
  const appContext = useContext(AppContext);
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();
  const { startFlow } = useProgressNavigation();

  useEffect(() => {
    fetchData();
  }, [route?.params]);

  const fetchData = async () => {
    try {
      const result = await db.getAllAsync(
        'SELECT * FROM jobs WHERE jobStatus = ?',
        ['In Progress']
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

  const handleDeleteJob = async (jobId) => {
    Alert.alert('Delete Job', 'Are you sure you want to delete this job?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await db.transaction(async (tx) => {
              await tx.executeSql('DELETE FROM Jobs WHERE id = ?', [jobId]);
            });
            console.log('Record deleted successfully');
            fetchData();
          } catch (error) {
            console.error('Error deleting record', error);
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