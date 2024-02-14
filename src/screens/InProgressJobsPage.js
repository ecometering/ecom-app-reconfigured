import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
const JobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch data from SQLite database (pseudo-code, replace with actual data fetching logic)
    const fetchData = async () => {
      const data = await fetchJobsFromDatabase(); // Implement this function to fetch jobs
      setJobs(data);
    };
    
    fetchData();
  }, []);

  const handleRowClick = (jobId) => {
    // Navigate to job details page or process flow, replace 'JobDetails' with actual screen name
    navigation.navigate('JobDetails', { jobId });
  };

  const TableHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>MPRN</Text>
      <Text style={styles.headerCell}>Job Type</Text>
      <Text style={styles.headerCell}>Postcode</Text>
      <Text style={styles.headerCell}>Start Date</Text>
      <Text style={styles.headerCell}>Start Time</Text>
      <Text style={styles.headerCell}>Status</Text>
    </View>
  );

  const TableRow = ({ item }) => (
    <TouchableOpacity style={styles.row} onPress={() => handleRowClick(item.id)}>
      <Text style={styles.cell}>{item.mprn}</Text>
      <Text style={styles.cell}>{item.jobType}</Text>
      <Text style={styles.cell}>{item.postcode}</Text>
      <Text style={styles.cell}>{item.startDate}</Text>
      <Text style={styles.cell}>{item.startTime}</Text>
      <Text style={styles.cell}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
            <Header hasLeftBtn={true} hasCenterText={true} hasRightBtn={false} centerText={'Planned Jobs'} leftBtnPressed={() => navigation.goBack()} />

      <TableHeader />
      {jobs.length > 0 ? (
        jobs.map((item) => <TableRow key={item.id.toString()} item={item} />)
      ) : (
        <Text style={styles.noJobsText}>No jobs available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  cell: {
    flex: 1,
    marginRight: 10,
  },
  noJobsText: {
    padding: 10,
    fontStyle: 'italic',
  },
});

export default JobsTable;
