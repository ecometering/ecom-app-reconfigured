import { omit } from 'lodash';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

// Components
import JobCard from '../JobCard';
import PlannedJobTakeOverModal from '../planned-job-take-over-modal/PlannedJobTakeOverModal';

// Context
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

// Utils
import { fieldsToParse } from '../../utils/constant';
import { safeParse } from '../../utils/nagivation-routes/helpers';

export default function HomeJobsListing({
  title,
  data,
  loading,
  onPress,
  length,
  stateType,
}) {
  const { setState } = useFormStateContext();
  const { startFlow } = useProgressNavigation();
  const [takeOverId, setTakeOverId] = useState(null);

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
      <PlannedJobTakeOverModal
        plannedJobs={data}
        setPlannedJobs={() => {}}
        takeOverId={takeOverId}
        setTakeOverId={setTakeOverId}
      />
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
