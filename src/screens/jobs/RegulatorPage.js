import React, { useContext, useRef, useState } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import TextInput from '../../components/TextInput';
import OptionalButton from '../../components/OptionButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import EcomHelper from '../../utils/ecomHelper';
import { AppContext } from '../../context/AppContext';
import BarcodeScanner from '../../components/BarcodeScanner';
import { openDatabase } from '../../utils/database';
const alphanumericRegex = /^[a-zA-Z0-9]+$/;
const { width, height } = Dimensions.get('window');
function RegulatorPage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;
  const title = jobType === 'Install' ? 'New Meter Details' : jobType;
  const regulatorDetails = appContext.regulatorDetails;

  const camera = useRef(null);
  const [serialNumber, setSerialNumber] = useState(
    regulatorDetails?.serialNumber
  );
  const [manufacturer, setManufacturer] = useState(''); // State for Manufacturer
  const [model, setModel] = useState(''); // State for Model
  const [size, setSize] = useState(null); // State for Size
  const [isModal, setIsModal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isSealedRegulator, setIsSealedRegulator] = useState(
    regulatorDetails?.isSealedRegulator
  );
  const [isPurged, setIsPurged] = useState(regulatorDetails?.isPurged);
  const [isLabelled, setIsLabelled] = useState(regulatorDetails?.isLabelled);
  const [isVentilation, setIsVentilation] = useState(
    regulatorDetails?.isVentilation
  );
  const [isChatBox, setIsChatBox] = useState(regulatorDetails?.isChatBox);
  const [serialNoExist, setSerialNoExist] = useState(
    regulatorDetails?.serialNoExist
  );
  const [isAdditionalMaterial, setIsAdditionalMaterial] = useState(
    regulatorDetails?.isAdditionalMaterial
  );
  const [isNewLogger, setIsNewLogger] = useState(regulatorDetails?.isNewLogger);
  console.log('RegulatorPage');

  const updateRegulatorDetails = async () => {
    const { jobId } = appContext; // Assuming appContext provides the jobId

    // JSONify regulator details
    const regulatorDetailsJSON = JSON.stringify({
      serialNumber,
      manufacturer,
      model,
      size,
      date: moment(date).format('YYYY-MM-DD'), // Formatting date to string
      isSealedRegulator,
      isPurged,
      isLabelled,
      isVentilation,
      isChatBox,
      serialNoExist,
      isAdditionalMaterial,
      isNewLogger,
    });

    const db = await openDatabase();

    // Update the database with the new details
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE JobDetails SET regulatorDetails = ? WHERE jobId = ?',
        [regulatorDetailsJSON, jobId],
        () => {
          console.log('Regulator details updated successfully');
          // Optionally navigate away or update state
        },
        (txObj, error) =>
          console.error('Error updating regulator details:', error)
      );
    });
  };
  const nextPressed = () => {
    // validate
    if (serialNoExist && (serialNumber == null || serialNumber === '')) {
      EcomHelper.showInfoMessage('Please scan regulator SN');
      return;
    }
    if (serialNoExist === null) {
      EcomHelper.showInfoMessage('Please answer if serial no exist');
      return;
    }
    if (isSealedRegulator == null) {
      EcomHelper.showInfoMessage('Please answer if regulator was sealed');
      return;
    }
    if (isPurged == null) {
      EcomHelper.showInfoMessage(
        'Please answer if new meter, customer appliances and pipe work been purged and relit satisfactory including a visual inspection'
      );
      return;
    }
    if (isLabelled == null) {
      EcomHelper.showInfoMessage(
        'Please answer if installation was correctly labelled'
      );
      return;
    }
    if (isVentilation == null) {
      EcomHelper.showInfoMessage(
        'Please answer if there is a purpose made ventilation'
      );
      return;
    }
    if (isChatBox == null) {
      EcomHelper.showInfoMessage(
        'Please answer if new chatter box has been installed'
      );
      return;
    }
    if (isAdditionalMaterial == null) {
      EcomHelper.showInfoMessage(
        'Please answer if there is any additional materials'
      );
      return;
    }

    appContext.setRegulatorDetails({
      ...regulatorDetails,
      serialNumber: serialNumber,
      date: date,
      isSealedRegulator: isSealedRegulator,
      isPurged: isPurged,
      isLabelled: isLabelled,
      isVentilation: isVentilation,
      isChatBox: isChatBox,
      isAdditionalMaterial: isAdditionalMaterial,
      isNewLogger: isNewLogger,
      serialNoExist: serialNoExist,
    });
    navigation.navigate('RegulatorPhotoPage');
  };

  const backPressed = () => {
    appContext.setRegulatorDetails({
      ...regulatorDetails,
      serialNumber: serialNumber,
      date: date,
      isSealedRegulator: isSealedRegulator,
      isPurged: isPurged,
      isLabelled: isLabelled,
      isVentilation: isVentilation,
      isChatBox: isChatBox,
      isAdditionalMaterial: isAdditionalMaterial,
      isNewLogger: isNewLogger,
      serialNoExist: serialNoExist,
    });
    navigation.goBack();
  };

  const scanBarcode = () => {
    setIsModal(true);
  };

  const barcodeRecognized = (codes) => {
    EcomHelper.showInfoMessage(codes.data);
    console.log(codes);
    setIsModal(false);
    setSerialNumber(codes.data);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    const convertedDateTime = moment(selectedDate).format('MM/DD/YYYY');
    setDate(convertedDateTime);
    console.log(convertedDateTime);
  };

  const RepeatedComponent = ({ title, action1, action2, value }) => {
    return (
      <View style={styles.optionContainer}>
        <Text>{title}</Text>
        <View style={styles.spacer2} />
        <OptionalButton
          options={['Yes', 'No']}
          actions={[action1, action2]}
          value={value}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={title}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView style={styles.content}>
          <View style={styles.body}>
            {/* ... other UI components */}

            <View style={styles.row}>
              {/* Manufacturer Text Input */}
              <View style={{ width: width * 0.45 }}>
                <Text>Manufacturer</Text>
                <TextInput
                  style={styles.input}
                  value={manufacturer}
                  onChangeText={setManufacturer}
                />
              </View>

              {/* Model Text Input */}
              <View style={{ width: width * 0.45 }}>
                <Text>Model</Text>
                <TextInput
                  style={styles.input}
                  value={model}
                  onChangeText={setModel}
                />
              </View>
            </View>

            <View style={styles.spacer} />

            {/* Size Dropdown */}
            <View style={{ width: width * 0.45 }}>
              <Text>Size</Text>
              <EcomDropDown
                width={width * 0.35}
                value={size}
                valueList={[
                  { label: '1/4"', value: '1/4' },
                  { label: '1/2"', value: '1/2' },
                  { label: '3/4"', value: '3/4' },
                  { label: '1"', value: '1' },
                  { label: '1 1/4"', value: '1 1/4' },
                  { label: '1 1/2"', value: '1 1/2' },
                  { label: '2"', value: '2' },
                  { label: '3"', value: '3' },
                  { label: '4"', value: '4' },
                  { label: '6"', value: '6' },
                  { label: '8"', value: '8' },
                  { label: '10"', value: '10' },
                  { label: '12"', value: '12' },
                  { label: '16"', value: '16' },
                  { label: '20"', value: '20' },
                  // ... Add other sizes here
                ]}
                placeholder={'Select Size'}
                onChange={(item) => {
                  console.log(item);
                  setSize(item.value);
                }}
              />
            </View>

            {/* ... other UI components */}
          </View>
          {/* ... other UI components */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: width * 0.05,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  input: {
    width: width * 0.35,
    alignSelf: 'center',
  },
  optionContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  spacer: {
    height: height * 0.02,
  },
  spacer2: {
    height: 10,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
    // Other styles for the close icon
  },
});

export default RegulatorPage;
