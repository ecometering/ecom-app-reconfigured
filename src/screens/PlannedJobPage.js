import axios from 'axios';
import {
  View,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text as RNText,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import JobCard from '../components/JobCard';
import { PrimaryColors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { useFormStateContext } from '../context/AppContext';
import { useProgressNavigation } from '../context/ProgressiveFlowRouteProvider';
import { useSQLiteContext } from 'expo-sqlite/next';

const fieldsToParse = [
  'siteDetails',
  'siteQuestions',
  'photos',
  'streams',
  'meterDetails',
  'kioskDetails',
  'ecvDetails',
  'movDetails',
  'regulatorDetails',
  'standards',
  'meterDetailsTwo',
  'additionalMaterials',
  'dataloggerDetails',
  'dataLoggerDetailsTwo',
  'maintenanceDetails',
  'correctorDetails',
  'correctorDetailsTwo',
  'chatterBoxDetails',
  'navigation',
];

const safeParse = (jsonString, fallbackValue) => {
  try {
    return !!jsonString ? JSON.parse(jsonString) : fallbackValue;
  } catch (error) {
    console.error('Error parsing JSON string:', error, jsonString);
    return fallbackValue;
  }
};

function PlannedJobPage() {
  const db = useSQLiteContext();
  const navigation = useNavigation();
  const { authState } = useAuth();
  const [plannedJobs, setPlannedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { setState } = useFormStateContext();
  const { startFlow } = useProgressNavigation();

  const [takeOverId, setTakeOverId] = useState(null);
  const [openTakenWarningModal, setOpenTakenWarningModal] = useState(false);

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
          console.log({ data: data[0].mprn });
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

  const handleJobTakeOver = async (jobId) => {
    const job = plannedJobs.find((job) => job.id === jobId);
    // check if job id exists in the db
    const jobExists = await db.getAllAsync('SELECT * FROM Jobs WHERE id = ?', [
      jobId,
    ]);

    if (jobExists.length > 0) {
      setTakeOverId(null);
      setOpenTakenWarningModal(true);
      return;
    }

    if (!job) {
      setError('Job not found');
      return;
    }

    // Transform the data
    const jobData = {
      MPRN: job.mprn.mprn,
      additionalMaterials: JSON.stringify(
        job.job_details?.additionalMaterials || {}
      ),
      chatterboxDetails: JSON.stringify(
        job.job_details?.chatterboxDetails || {}
      ),
      correctorDetails: JSON.stringify(job.job_details?.CorrectorDetails || {}),
      correctorDetailsTwo: '{}', // Placeholder, update with actual data if needed
      dataLoggerDetailsTwo: '{}', // Placeholder, update with actual data if needed
      dataloggerDetails: '{}', // Placeholder, update with actual data if needed
      ecvDetails: JSON.stringify(job.job_details?.ecvDetails || {}),
      endDate: null,
      id: job.id,
      jobId: jobId,
      jobStatus: 'In Progress',
      jobType: job?.job_details?.job_type ?? 'Install',
      kioskDetails: JSON.stringify(job.job_details?.kioskDetails || {}),
      lastNavigationIndex: '1',
      maintenanceQuestions: '{}', // Placeholder, update with actual data if needed
      meterDetails: JSON.stringify(job.job_details?.MeterDetails || {}),
      meterDetailsTwo: '{}', // Placeholder, update with actual data if needed
      movDetails: JSON.stringify(job.job_details?.movDetails || {}),
      navigation: '[]', // Placeholder, update with actual data if needed
      photos: '{}', // Placeholder, update with actual data if needed
      postcode: job.mprn.postcode,
      progress: null,
      rebook: null,
      regulator: null,
      regulatorDetails: '{}', // Placeholder, update with actual data if needed
      siteDetails: JSON.stringify({
        mprn: job.mprn.mprn,
        companyName: job.mprn.site_name,
        buildingName: job.mprn.building,
        address1: job.mprn.address_1,
        address2: job.mprn.address_2,
        town: job.mprn.town,
        county: job.mprn.county,
        postCode: job.mprn.postcode,
        title: job.mprn.title,
        contact: job.mprn.first_name,
        email1: job.mprn.email,
        number1: job.mprn.telephone,
      }),
      siteQuestions: '{}', // Placeholder, update with actual data if needed
      standards: '{}', // Placeholder, update with actual data if needed
      startDate: job.created_at,
      streams: '{}', // Placeholder, update with actual data if needed
    };

    await insertShapedDataIntoJobsTable(jobData);

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

    await updateJobStatus(jobId);

    if (parsedJobData.jobType) {
      startFlow({ newFlowType: parsedJobData.jobType });
    }
  };

  const updateJobStatus = async (jobId) => {
    await axios
      .patch('https://test.ecomdata.co.uk/job-update/update_job/', {
        job_id: jobId,
      })
      .then((response) => {
        setPlannedJobs((prevJobs) =>
          prevJobs.filter((job) => job.id !== jobId)
        );
        console.log('Job status updated', response);
      })
      .catch((error) => {
        console.error('Error updating job status:', error);
      });
  };

  const insertShapedDataIntoJobsTable = async (shapedData) => {
    const column_data = await db.getAllAsync(`
      PRAGMA table_info(Jobs);
    `);
    const columns = column_data.map((col) => col.name).join(', ');
    const placeholders = column_data.map(() => '?').join(', ');
    const values = column_data.map((col) => shapedData[col.name] || null);
    const insertQuery = `INSERT INTO Jobs (${columns}) VALUES (${placeholders})`;
    await db.runAsync(insertQuery, values);
    setTakeOverId(null);
  };

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
      <Modal visible={!!takeOverId} transparent={true}>
        <View style={styles.center}>
          <View
            style={{
              backgroundColor: PrimaryColors.Sand,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              borderRadius: 10,
              gap: 10,
            }}
          >
            <RNText>Do you wish to take over this job?</RNText>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => handleJobTakeOver(takeOverId)}
                style={{
                  backgroundColor: PrimaryColors.Green,
                  padding: 10,
                  borderRadius: 5,
                  minWidth: 88,
                }}
              >
                <RNText
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Yes
                </RNText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTakeOverId(null)}
                style={{
                  backgroundColor: PrimaryColors.Red,
                  padding: 10,
                  borderRadius: 5,
                  minWidth: 88,
                }}
              >
                <RNText
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Not yet
                </RNText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={openTakenWarningModal} transparent={true}>
        <View style={styles.center}>
          <View
            style={{
              backgroundColor: PrimaryColors.Sand,
              padding: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              borderRadius: 10,
              gap: 10,
            }}
          >
            <RNText>This job already been taken</RNText>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                justifyContent: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => setOpenTakenWarningModal(false)}
                style={{
                  backgroundColor: PrimaryColors.Red,
                  padding: 10,
                  borderRadius: 5,
                  minWidth: 88,
                }}
              >
                <RNText
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Okay
                </RNText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
