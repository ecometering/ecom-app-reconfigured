import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, StyleSheet, Alert, FlatList } from 'react-native';

// Components
import Header from '../components/Header';
import JobCard from '../components/JobCard';

// Utils
import { loadJob } from '../utils/loadJob';
import { openDatabase, getDatabaseJob } from '../utils/database';

const JobsTable = ({ route }) => {
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, [route?.params]);

  const fetchData = async () => {
    await getDatabaseJob(setJobs, 'In Progress');
  };

  const handleRowClick = async (jobId) => {
    try {
      const jobData = await loadJob(jobId);
      navigation.navigate('SiteDetailsPage', { jobData });
    } catch (error) {
      console.error('Error loading job:', error);
      // Handle the error, e.g., show an error message
    }
  };

  const handleDeleteJob = async (jobId) => {
    const db = await openDatabase();
    Alert.alert('Delete Job', 'Are you sure you want to delete this job?', [
      { text: 'Cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          db.transaction((tx) => {
            tx.executeSql(
              'DELETE FROM Jobs WHERE id = ?',
              [jobId],
              () => {
                console.log('Record deleted successfully');
                fetchData();
              },
              (error) => {
                console.error('Error deleting record', error);
              }
            );
          });
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
