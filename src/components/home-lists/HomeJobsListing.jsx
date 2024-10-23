import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, Modal } from 'react-native';
import JobCard from '../JobCard';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';
import { omit } from 'lodash';
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

export default function HomeJobsListing({
  title,
  data,
  loading,
  onPress,
  length,
  stateType,
}) {
  const db = useSQLiteContext();
  const { setState } = useFormStateContext();
  const { startFlow } = useProgressNavigation();
  const [takeOverId, setTakeOverId] = useState(null);
  const [openTakenWarningModal, setOpenTakenWarningModal] = useState(false);

  const handleRowClick = async (jobId) => {
    try {
      const jobData = data.find(({ id }) => id === jobId);
      if (jobData) {
        const parsedJobData = { ...jobData };

        fieldsToParse.forEach((field) => {
          if (jobData[field] !== undefined) {
            parsedJobData[field] = safeParse(
              jobData[field],
              Array.isArray(parsedJobData[field]) ? [] : {}
            );
          }
        });

        setState((prevState) => ({
          ...prevState,
          ...omit(parsedJobData, ['navigation', 'lastNavigationIndex']),
          jobID: jobId,
        }));

        startFlow({
          newFlowType: parsedJobData.jobType,
          lastNavigationIndex: parsedJobData?.lastNavigationIndex,
          stateNavigation: parsedJobData?.navigation,
        });
      } else {
        console.error('Job not found:', jobId);
      }
    } catch (error) {
      console.error('Error loading job:', error);
    }
  };

  const handleJobTakeOver = async (jobId) => {
    try {
      const job = data.find((job) => job.id === jobId);
      const jobExists = await db.getAllAsync(
        'SELECT * FROM Jobs WHERE id = ?',
        [jobId]
      );

      console.log({ jobExists });

      if (jobExists.length > 0) {
        setTakeOverId(null);
        setOpenTakenWarningModal(true);
        return;
      }

      if (!job) {
        console.error('Job not found');
        return;
      }

      const jobData = {
        MPRN: job.mprn.mprn,
        additionalMaterials: JSON.stringify(
          job.job_details?.additionalMaterials || {}
        ),
        chatterboxDetails: JSON.stringify(
          job.job_details?.chatterboxDetails || {}
        ),
        correctorDetails: JSON.stringify(
          job.job_details?.CorrectorDetails || {}
        ),
        correctorDetailsTwo: '{}',
        dataLoggerDetailsTwo: '{}',
        dataloggerDetails: '{}',
        ecvDetails: JSON.stringify(job.job_details?.ecvDetails || {}),
        endDate: null,
        id: job.id,
        jobId: jobId,
        jobStatus: 'In Progress',
        jobType: job?.job_details?.job_type ?? 'Install',
        kioskDetails: JSON.stringify(job.job_details?.kioskDetails || {}),
        lastNavigationIndex: '1',
        maintenanceQuestions: '{}',
        meterDetails: JSON.stringify(job.job_details?.MeterDetails || {}),
        meterDetailsTwo: '{}',
        movDetails: JSON.stringify(job.job_details?.movDetails || {}),
        navigation: '[]',
        photos: '{}',
        postcode: job.mprn.postcode,
        progress: null,
        rebook: null,
        regulator: null,
        regulatorDetails: '{}',
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
        siteQuestions: '{}',
        standards: '{}',
        startDate: job.created_at,
        streams: '{}',
      };

      await insertShapedDataIntoJobsTable(jobData);

      const parsedJobData = { ...jobData };
      fieldsToParse.forEach((field) => {
        if (jobData[field] !== undefined) {
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

      if (parsedJobData.jobType) {
        startFlow({ newFlowType: parsedJobData.jobType });
      }
    } catch (error) {
      console.error('Error during job takeover:', error);
    }
  };

  const insertShapedDataIntoJobsTable = async (shapedData) => {
    try {
      const column_data = await db.getAllAsync(`PRAGMA table_info(Jobs);`);
      const columns = column_data.map((col) => col.name).join(', ');
      const placeholders = column_data.map(() => '?').join(', ');
      const values = column_data.map((col) => shapedData[col.name] || null);
      const insertQuery = `INSERT INTO Jobs (${columns}) VALUES (${placeholders})`;
      await db.runAsync(insertQuery, values);
      setTakeOverId(null);
    } catch (error) {
      console.error('Error inserting data into Jobs table:', error);
    }
  };

  if (!data) {
    console.error('Data is undefined in HomeJobsListing');
    return null;
  }

  return (
    <View style={loading ? { opacity: 0.5 } : {}}>
      <TouchableOpacity style={styles.header} onPress={onPress}>
        <Text style={styles.headerText}>
          {title} {!!length && `(${length})`} →
        </Text>
      </TouchableOpacity>
      <View style={styles.jobList}>
        {data.map((item) => {
          if (!item) {
            console.error('Item is undefined in data array');
            return null;
          }
          return (
            <JobCard
              key={item.id}
              loading={loading}
              item={item}
              handleOnCardClick={() => {
                if (stateType === 'plannedJobs') {
                  setTakeOverId(item.id);
                } else {
                  handleRowClick(item.id);
                }
              }}
            />
          );
        })}
      </View>
      <Modal visible={!!takeOverId} transparent={true}>
        <View style={styles.center}>
          <View style={styles.modalContent}>
            <Text>Do you wish to take over this job?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => handleJobTakeOver(takeOverId)}
                style={styles.yesButton}
              >
                <Text style={styles.textCenter}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setTakeOverId(null)}
                style={styles.noButton}
              >
                <Text style={styles.textCenter}>Not yet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={openTakenWarningModal} transparent={true}>
        <View style={styles.center}>
          <View style={styles.modalContent}>
            <Text>This job already been taken</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => setOpenTakenWarningModal(false)}
                style={styles.noButton}
              >
                <Text style={styles.textCenter}>Okay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  headerText: {
    fontSize: 20,
  },
  jobList: {
    marginTop: 20,
    gap: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'lightgrey',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 10,
    gap: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  yesButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    minWidth: 88,
  },
  noButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    minWidth: 88,
  },
  textCenter: {
    textAlign: 'center',
  },
});
