import {
  View,
  Modal,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

// Utils and Constants
import { PrimaryColors } from '../theme/colors';

// Components
import Text from '../components/Text';
import Header from '../components/Header';
import { EcomPressable as Button } from '../components/ImageButton';

// Context
import { useFormStateContext } from '../context/AppContext';
import { useProgressNavigation } from '../context/ProgressiveFlowRouteProvider';

function JobTypePage() {
  const navigation = useNavigation();
  const { startFlow } = useProgressNavigation();
  const { state, setState, resetState } = useFormStateContext();
  const { startDate, jobID } = state;

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState('');

  const handleJobTypeSelection = async (jobType) => {
    if (jobID) {
      setSelectedJobType(jobType);
      setModalVisible(true);
    } else {
      await startNewJob(jobType);
    }
  };

  const startNewJob = async (jobType) => {
    try {
      if (startDate) {
        setState((prevState) => ({
          ...prevState,
          jobID: jobID || `JOB-${Date.now()}`,
          jobType,
          startDate: new Date().toISOString(),
          jobStatus: 'In Progress',
          progress: 0,
        }));
      }
      startFlow(jobType);
    } catch (error) {
      console.error('Error starting new job:', error);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={() => navigation.goBack()}
        centerText="Job Type Selection"
      />
      <ScrollView>
        <View style={styles.body}>
          {[
            'Install',
            'Removal',
            'Exchange',
            'Survey',
            'Warrant',
            'Maintenance',
          ].map((type, index) => (
            <View key={index}>
              <Button
                onPress={() => handleJobTypeSelection(type)}
                style={styles.button}
              >
                <Text style={styles.buttonTxt}>{`Asset ${type}`}</Text>
              </Button>
            </View>
          ))}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              A job is currently active. Would you like to discard it?
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  resetState();
                  setModalVisible(false);
                  startNewJob(selectedJobType);
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  startNewJob(selectedJobType);
                }}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: {
    gap: 20,
    padding: 10,
  },
  button: {
    backgroundColor: PrimaryColors.Blue,
    borderRadius: 5,
    borderColor: 'black',
    elevation: 5,
    shadowColor: '#000',

    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: {
      width: 2.5,
      height: 2.5,
    },
  },
  buttonTxt: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '800',
    padding: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  modalButton: {
    backgroundColor: PrimaryColors.Blue,
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default JobTypePage;
