import { View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';

// Utils and Constants
import { PrimaryColors } from '../theme/colors';

// Components
import Text from './Text';

// Context
import { useFormStateContext } from '../context/AppContext';
import { useProgressNavigation } from '../context/ProgressiveFlowRouteProvider';

function JobTypeSection() {
  const { startFlow } = useProgressNavigation();
  const { state, setState, resetState } = useFormStateContext();
  const { startDate, jobID } = state;

  const handleJobTypeSelection = (jobType) => {
    startNewJob(jobType);
  };

  const startNewJob = async (jobType) => {
    try {
      if (startDate) {
        setState((prevState) => ({
          ...prevState,
          jobID: jobID,
          jobType,
          startDate: new Date().toISOString(),
          jobStatus: 'In Progress',
          progress: 0,
        }));
      }
      startFlow({ newFlowType: jobType });
    } catch (error) {
      console.error('Error starting new job:', error);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      {state?.jobStatus === 'In Progress' ? (
        <View style={styles.jobInProgressContainer}>
          <Text style={styles.jobInProgressTitle}>
            A {state?.jobType} job is in progress
          </Text>
          <View style={styles.jobInProgressInfo}>
            <Text>
              Last Screen:{' '}
              {state?.navigation?.[state?.lastNavigationIndex]?.screen}
            </Text>
            <View style={styles.progressBarBackground}>
              <View style={styles.progressBarForeground} />
            </View>
          </View>
          <View style={styles.jobInProgressActions}>
            <TouchableOpacity style={styles.cancelButton} onPress={resetState}>
              <Text>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={() =>
                startFlow({
                  newFlowType: state?.jobType,
                  lastNavigationIndex: state?.lastNavigationIndex,
                  stateNavigation: state?.navigation,
                })
              }
            >
              <Text>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.newJobContainer}>
          <Text style={styles.newJobTitle}>Start a new job</Text>
          <View style={styles.body}>
            {['Install', 'Removal', 'Exchange'].map((type, index) => (
              <View style={styles.buttonWrapper} key={index}>
                <TouchableOpacity
                  onPress={() => handleJobTypeSelection(type)}
                  style={styles.button}
                >
                  <Text style={styles.buttonTxt}>{type}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.body}>
            {['Survey', 'Warrant', 'Maintenance'].map((type, index) => (
              <View style={styles.buttonWrapper} key={index}>
                <TouchableOpacity
                  onPress={() => handleJobTypeSelection(type)}
                  style={styles.button}
                >
                  <Text style={styles.buttonTxt}>{type}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    flex: 1,
    backgroundColor: `${PrimaryColors.Sand}50`,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTxt: {
    textAlign: 'center',
    paddingVertical: 30,
  },
  jobInProgressContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    gap: 10,
  },
  jobInProgressTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  jobInProgressInfo: {
    gap: 5,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    borderRadius: 5,
    backgroundColor: `${PrimaryColors.Green}50`,
  },
  progressBarForeground: {
    width: `${20}%`,
    height: 8,
    borderRadius: 5,
    backgroundColor: PrimaryColors.Green,
  },
  jobInProgressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: `${PrimaryColors.Gray}50`,
  },
  continueButton: {
    backgroundColor: `${PrimaryColors.Green}50`,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  newJobContainer: {
    gap: 10,
  },
  newJobTitle: {
    fontSize: 16,
  },
});

export default JobTypeSection;
