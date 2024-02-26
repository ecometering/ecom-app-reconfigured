import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { fetchJobsFromDatabase, deleteJobById, getDatabaseTables, openDatabase, getDatabaseJob } from '../utils/database'; // Importing required functions

const { width } = Dimensions.get('window'); // Get the screen width

const dynamicFontSize = width < 360 ? 10 : width < 600 ? 12 : 14; // Adjust font size based on screen width
const dynamicPadding = width < 360 ? 8 : 10; // Adjust padding based on screen width

const JobsTable = () => {
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();
  

  useEffect(() => {
  
    fetchData();
  }, [filteredData]);

  const fetchData = async () => {
    const data = await getDatabaseJob(setJobs);
  };
  

  const filteredData = jobs.filter(item => item.jobStatus !== 'InProgress');

  const handleRowClick = (jobId) => {
    navigation.navigate('JobDetails', { jobId });
  };

  const TableHeader = () => (
    <View style={[styles.headerRow, { padding: dynamicPadding }]}>
      <Text style={[styles.headerCell, { fontSize: dynamicFontSize }]}>id</Text>
      <Text style={[styles.headerCell, { fontSize: dynamicFontSize }]}>MPRN</Text>
      <Text style={[styles.headerCell, { fontSize: dynamicFontSize }]}>Job Type</Text>
      <Text style={[styles.headerCell, { fontSize: dynamicFontSize }]}>Postcode</Text>
      <Text style={[styles.headerCell, { fontSize: dynamicFontSize }]}>Start Date</Text>
      <Text style={[styles.headerCell, { fontSize: dynamicFontSize }]}>Start Time</Text>
      <Text style={[styles.headerCell, { fontSize: dynamicFontSize }]}>Status</Text>
    </View>
  );

  const TableRow = ({ item }) => (
    <TouchableOpacity style={[styles.row, { padding: dynamicPadding }]} onPress={() => handleRowClick(item.id)}>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.id}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.MPRN}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.jobType}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.postcode}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.startDate}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.startDate}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.jobStatus}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Header hasLeftBtn={true} hasCenterText={true} hasRightBtn={false} centerText={'Completed Jobs'} leftBtnPressed={() => navigation.goBack()} />
      <TableHeader />
      {filteredData.length > 0 ? (
        filteredData.map((item) => <TableRow key={item.id.toString()} item={item} />)
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
    backgroundColor: '#f0f0f0',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
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
