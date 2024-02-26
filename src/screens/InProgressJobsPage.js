import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import { fetchJobsFromDatabase, deleteJobById, getDatabaseTables, openDatabase, getDatabaseJob } from '../utils/database'; // Importing required functions

const { width } = Dimensions.get('window'); // Get the screen width

const dynamicFontSize = width < 360 ? 9 : width < 600 ? 11 : 13; // Adjust font size based on screen width
const dynamicPadding = width < 360 ? 6 : 8; // Adjust padding based on screen width

const JobsTable = ({route}) => {
  const [jobs, setJobs] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    fetchData(); // Call fetchData on component mount
  }, [route?.params]);
  

  const fetchData = async () => {
  
    await getDatabaseJob(setJobs);

    
  };

  const filteredData = jobs.filter(item => item.jobStatus === 'InProgress');


  const handleRowClick = (jobId) => {
    navigation.navigate('JobDetails', { jobId });
  };

  const handleDeleteJob = async (jobId) => {
    const db = await openDatabase(); 
    Alert.alert("Delete Job", "Are you sure you want to delete this job?", [
      { text: "Cancel" },
      { text: "Yes", onPress: async () => {
    
          db.transaction(tx => {
            tx.executeSql(
              'DELETE FROM Jobs WHERE id = ?',
              [jobId],
              () => {
                console.log('Record deleted successfully');
                fetchData(); 
              },
              error => {
                console.error('Error deleting record', error);
              }
            );
          });
        
        
      }}
    ]);
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
      <Text style={[styles.headerCell, { fontSize: dynamicFontSize }]}>Actions</Text>
    </View>
  );

  const TableRow = ({ item }) => (
    <TouchableOpacity onPress={()=>navigation.navigate('SiteDetailsPage', {
      jobData : item
    })} style={[styles.row, { padding: dynamicPadding }]}>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.id}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.MPRN}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.jobType}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.postcode}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.startDate}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.endDate}</Text>
      <Text style={[styles.cell, { fontSize: dynamicFontSize - 2 }]}>{item.jobStatus}</Text>
      <TouchableOpacity onPress={() => handleDeleteJob(item.id)}>
        <Text style={{ color: 'red', padding: 10 }}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Header hasLeftBtn={true} hasCenterText={true} hasRightBtn={false} centerText={'Jobs in progress'} leftBtnPressed={() => navigation.goBack()} />
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
    padding: dynamicPadding, // Apply dynamic padding to header row as well
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    marginRight: 5, // Reduced right margin
    textAlign: 'center', // Center-align header text
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    padding: dynamicPadding, // Apply dynamic padding to each row for consistency
  },
  cell: {
    flex: 1,
    marginRight: 5, // Consistent with headerCell marginRight
    fontSize: dynamicFontSize - 2, // Apply dynamic font size reduction to cells
    textAlign: 'center', // Center-align cell text for a more uniform look
  },
  noJobsText: {
    padding: 10,
    fontStyle: 'italic',
  },
});

export default JobsTable;
