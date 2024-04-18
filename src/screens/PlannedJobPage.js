import React, { useState, useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, View, Text as RNText } from 'react-native';
import { PrimaryColors, Transparents } from '../theme/colors';
import { EcomPressable as Button } from '../components/ImageButton';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function PlannedJobPage() {
  const navigation = useNavigation();
  const { authState } = useAuth();
  const [plannedJobs, setPlannedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlannedJobs = async () => {
      setIsLoading(true);
      setError(null);
  
      console.log("Using token for API request:", authState.token); // Debug: Check what token is being used
  
      if (!authState.token) {
        setError("Authentication token is not available.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://test.ecomdata.co.uk/api/jobs', {
          headers: {
            Authorization: `Bearer ${authState.token}` // Ensure token is applied correctly
          }
        });
        const { data } = response;
        if (data && data.length > 0) {
          setPlannedJobs(data);
        } else {
          setError('No planned jobs found');
        }
      } catch (error) {
        console.log("Error fetching jobs:", error.response ? error.response.data : error.message);
        setError(`Error loading data: ${error.response ? error.response.data : error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlannedJobs();
  }, [authState.token]);

  const renderItem = ({ item, index }) => {
    const handleItemClick = () => {
      navigation.navigate('SiteDetailsPage', { jobType: item.JobType });
    };
    const rowColor = index % 2 === 0 ? Transparents.SandColor2 : Transparents.Clear;

    return (
      <Button key={item.id.toString()} onPress={handleItemClick}>
        <View style={{ ...styles.row, backgroundColor: rowColor }}>
          {/* Job Item Render Logic */}
        </View>
      </Button>
    );
  };

  const renderEmptyComponent = () => {
    if (isLoading) {
      return <View style={styles.center}><RNText>Loading...</RNText></View>;
    }
    if (error) {
      return <View style={styles.center}><RNText>{error}</RNText></View>;
    }
    return <View style={styles.center}><RNText>No planned jobs</RNText></View>;
  };

  return (
    <SafeAreaView style={styles.body}>
      <Header hasMenuButton={false} hasLeftBtn={true} hasCenterText={true} hasRightBtn={false} centerText={'Planned Jobs'} leftBtnPressed={() => navigation.goBack()} />
      <FlatList
        data={plannedJobs}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyComponent}
        ListHeaderComponent={<View style={styles.spacer} />}
        ListFooterComponent={<View style={styles.spacer} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 20,
  }
});

export default PlannedJobPage;
