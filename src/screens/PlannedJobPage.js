import axios from 'axios';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text as RNText,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { PrimaryColors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

import PlannedJobTakeOverModal from '../components/planned-job-take-over-modal/PlannedJobTakeOverModal';

function PlannedJobPage() {
  const navigation = useNavigation();
  const { authState } = useAuth();
  const [plannedJobs, setPlannedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [takeOverId, setTakeOverId] = useState(null);

  useEffect(() => {
    const fetchPlannedJobs = async () => {
      setIsLoading(true);
      setError(null);

      if (!authState.token) {
        setError('Authentication token is not available.');
        setIsLoading(false);
        return;
      }

      axios
        .get('https://test.ecomdata.co.uk/api/jobs/')
        .then((response) => {
          const { data } = response;
          if (data && data.length > 0) {
            setPlannedJobs(data);
          } else {
            setError('No planned jobs found');
          }
        })
        .catch((error) => {
          setError(
            `Error loading data: ${
              error.response ? error.response.data : error.message
            }`
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchPlannedJobs();
  }, [authState.token]);

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <RNText>Loading...</RNText>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.center}>
          <RNText>{error}</RNText>
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <RNText>No planned jobs</RNText>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.body}>
      <Header
        hasMenuButton={false}
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={false}
        centerText={'Planned Jobs'}
        leftBtnPressed={() => navigation.goBack()}
      />
      <FlatList
        data={plannedJobs}
        renderItem={({ item, index }) => {
          return (
            <JobCard
              item={item}
              index={index}
              handleOnCardClick={() => setTakeOverId(item.id)}
              buttonConfig={[
                {
                  text: 'Take over the job',
                  backgroundColor: PrimaryColors.Blue,
                  textColor: PrimaryColors.White,
                  onPress: () => setTakeOverId(item.id),
                },
              ]}
            />
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={renderEmptyComponent}
        style={{
          padding: 10,
          gap: 10,
        }}
      />
      <PlannedJobTakeOverModal
        takeOverId={takeOverId}
        setTakeOverId={setTakeOverId}
        plannedJobs={plannedJobs}
        setPlannedJobs={setPlannedJobs}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 20,
  },
});

export default PlannedJobPage;
