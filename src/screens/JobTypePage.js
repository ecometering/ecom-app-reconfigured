import React, { useContext, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { height, unitH } from '../utils/constant';
import { PrimaryColors } from '../theme/colors';
import { EcomPressable as Button } from '../components/ImageButton';
import Text from '../components/Text';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import Header from '../components/Header';
import { addOrUpdateJobData } from '../utils/database';
import { useProgressNavigation } from '../../ExampleFlowRouteProvider';

function JobTypePage() {
  const navigation = useNavigation();
  const { startFlow } = useProgressNavigation();
  const { jobStarted, resetContext, setJobID, setJobType } =
    useContext(AppContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState('');

  const setJobTypeAndNavigate = async (jobType) => {
    if (jobStarted) {
      // Show modal if a job is already started
      setSelectedJobType(jobType);
      setModalVisible(true);
    } else {
      await proceedWithJobType(jobType);
    }
  };

  const proceedWithJobType = async (jobType) => {
    try {
      // TODO: set app context here instead of in SiteDetailsPage
      const jobId = `JOB-${Date.now()}`;
      const jobData = {
        jobType: jobType,
        startDate: new Date().toISOString(),
        jobStatus: 'in progress',
        progress: 0,
      };
      console.log(`Job type ${jobType} saved successfully.`);
      // this is where we set the navigation flow and get the first screen details
      const navigationDetails = startFlow(jobType);
      console.log('Navigation details:', navigationDetails);
      // here we pass the screen information for the flow
      navigation.navigate(navigationDetails.screen, {
        ...navigationDetails.params,
        jobId: jobId,
        jobType: jobType,
      });
    } catch (error) {
      console.error('Error setting job type and navigating:', error);
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
            <View key={index} style={{ alignItems: 'center' }}>
              <Button
                onPress={() => setJobTypeAndNavigate(type)}
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
                  resetContext(); // Clear the context using the method defined in AppContext
                  setModalVisible(false);
                  proceedWithJobType(selectedJobType);
                }}
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setModalVisible(false);
                  proceedWithJobType(selectedJobType);
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
    justifyContent: 'center',
    height: height * 0.7,
    gap: 20,
  },
  spacer: { height: unitH * 20 },
  button: {
    width: '70%',
    height: unitH * 50,
    backgroundColor: PrimaryColors.Blue,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: '800',
  },
  // Additional styles for modal
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
    justifyContent: 'space-between',
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
