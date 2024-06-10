import React, { useContext, useRef, useState,createRef } from 'react';
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
import { useNavigation,useRoute } from '@react-navigation/native';
import TextInput from '../../components/TextInput';
import OptionalButton from '../../components/OptionButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import EcomHelper from '../../utils/ecomHelper';
import { AppContext } from '../../context/AppContext';
import BarcodeScanner from '../../components/BarcodeScanner';
import { openDatabase } from '../../utils/database';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';
import EcomDropDown from '../../components/DropDown';
import { SIZE_LIST } from '../../utils/constant';
import { TextType } from '../../theme/typography';
import { useSQLiteContext } from 'expo-sqlite/next';
const alphanumericRegex = /^[a-zA-Z0-9]+$/;

const { width, height } = Dimensions.get('window');

function RegulatorPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const db = useSQLiteContext();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const camera = createRef(null);

  const { title } = route.params;
  const {regulatorDetails, setRegulatorDetails,jobID}=useContext(AppContext);
 

  const readSerialNumber = (codes) => {
    setIsModal(false);
    if (codes && codes.data) {
      handleInputChange('serialNumber', codes.data.toString());
    }
  };
  const saveToDatabase = async () => {
    const regulatorDetailsJson = JSON.stringify(regulatorDetails);
    try {
      await db
        .runAsync('UPDATE Jobs SET regulatorDetails = ? WHERE id = ?', [
          regulatorDetailsJson,
          jobID,
        ])
        .then((result) => {
          console.log('regulatorDetails saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving regulatorDetails to database:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setRegulatorDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  const [isModal, setIsModal] = useState(false);
 
  const nextPressed = () => {
    // validate
    if (regulatorDetails.serialNoExist && (regulatorDetails.serialNumber == null || regulatorDetails.serialNumber === '')) {
      EcomHelper.showInfoMessage('Please enter or scan regulator Serial number');
      return;
    }
    if (regulatorDetails.serialNoExist === null) {
      EcomHelper.showInfoMessage('Please answer if serial no exist');
      return;
    }
    if (regulatorDetails.isSealedRegulator === null) {
      EcomHelper.showInfoMessage('Please answer if regulator was sealed');
      return;
    }
    if (regulatorDetails.isPurged === null) {
      EcomHelper.showInfoMessage(
        'Please answer if new meter, customer appliances and pipe work been purged and relit satisfactorily including a visual inspection'
      );
      return;
    }
    if (regulatorDetails.isLabelled === null) {
      EcomHelper.showInfoMessage(
        'Please answer if installation was correctly labelled'
      );
      return;
    }
    if (regulatorDetails.isVentilation === null) {
      EcomHelper.showInfoMessage(
        'Please answer if there is a purpose made ventilation'
      );
      return;
    }

    saveToDatabase();// Update the details in the database before navigating away
    goToNextStep();
  };

  const backPressed = () => {
    saveToDatabase();
    goToPreviousStep();
  };

  const scanBarcode = () => {
    setIsModal(true);
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
            {/* Optional Question for Serial Number */}
           
            <View style={{ gap: 10 }}>
                <Text type={TextType.CAPTION_2}>
                  {'Does the serial number exist? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => handleInputChange('serialNoExist', true),
                    () => handleInputChange('serialNoExist', false),
                  ]}
                  value={
                    regulatorDetails.serialNoExist === undefined
                      ? null
                      : regulatorDetails.serialNoExist
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            {/* Conditionally render Serial Number input if serialNoExist is true */}
            {regulatorDetails.serialNoExist && (
             <View
             style={{
               width: '100%', // Full width of the parent container
               alignSelf: 'flex-start',
             }}
           >
             <Text>Regulator Serial Number</Text>
             <View style={styles.spacer2} />
             <View style={{ ...styles.row, width: '100%' }}>
               <TextInput
                 onChangeText={(txt) => {
                   const withSpacesAllowed = txt.toUpperCase();
                   const formattedText = withSpacesAllowed.replace(/[^A-Z0-9 ]+/g, '');
                   handleInputChange('serialNumber', formattedText);
                 }}
                 style={{
                   ...styles.input,
                   flex: 1, // Allow the TextInput to take up the remaining space
                   alignSelf: 'flex-start',
                 }}
                 value={regulatorDetails.serialNumber}
               />
               <Button
                 title="📷"
                 onPress={scanBarcode}
                 style={{ width: '5%' }} // Fixed width for the button
               />
             </View>
           </View>
           
            )}

            {/* Manufacturer and Model */}
            <View style={styles.row}>
              <View style={{ width: width * 0.45 }}>
                <Text>Manufacturer</Text>
                <TextInput
                  style={styles.input}
                  value={regulatorDetails.manufacturer}
                  onChangeText={(txt) => {
                    const filteredText = txt.replace(/[^a-zA-Z ]/g, '');
                    handleInputChange('manufacturer', filteredText);
                  }}
                />
              </View>
              <View style={{ width: width * 0.45 }}>
                <Text>Model</Text>
                <TextInput
                  style={styles.input}
                  value={regulatorDetails.model}
                  onChangeText={(txt) => {
                    const filteredText = txt.replace(/[^a-zA-Z ]/g, '');
                    handleInputChange('model', filteredText);
                  }}
                />
              </View>
            </View>

            <View style={styles.spacer} />

            {/* Size Dropdown */}
            <View style={{ width: width * 0.45 }}>
              <Text>Size</Text>
              <EcomDropDown
                width={width * 0.35}
                value={regulatorDetails.size}
                valueList={SIZE_LIST}
                placeholder={'Select Size'}
                onChange={(item) => {
                  handleInputChange('size',item)
                }}
              />
            </View>

            <View style={styles.spacer} />

           

            <View style={styles.spacer} />

            
            <View style={{ gap: 10 }}>
                <Text type={TextType.CAPTION_2}>
                  {'Is the regulator sealed? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => handleInputChange('IsSealedRegulator', true),
                    () => handleInputChange('IsSealedRegulator', false),
                  ]}
                  value={
                    regulatorDetails.IsSealedRegulator === null
                      ? null
                      : regulatorDetails.IsSealedRegulator
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            <View style={styles.optionContainer}>
        
        <View style={styles.spacer2} />
        
   
      </View>
      <View style={{ gap: 10 }}>
                <Text type={TextType.CAPTION_2}>
                  {'Is the regulator Threaded or flanged? *'}
                </Text>
                <OptionalButton
                  options={['Threaded', 'Flanged']}
                  actions={[
                    () => handleInputChange('ConnectionType', true),
                    () => handleInputChange('ConnectionType', false),
                  ]}
                  value={
                    regulatorDetails.ConnectionType === null
                      ? null
                      : regulatorDetails.ConnectionType
                      ? 'Threaded'
                      : 'Flanged'
                  }
                />
              </View>
         
             <View style={{ gap: 10 }}>
                <Text type={TextType.CAPTION_2}>
                  {'Has the new meter, customer appliances and pipe work been purged and relit satisfactorily including a visual inspection? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => handleInputChange('isPurged', true),
                    () => handleInputChange('isPurged', false),
                  ]}
                  value={
                    regulatorDetails.isPurged === null
                      ? null
                      : regulatorDetails.isPurged
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
            
             <View style={{ gap: 10 }}>
                <Text type={TextType.CAPTION_2}>
                  {'Is the installation correctly labelled? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => handleInputChange('isLabelled', true),
                    () => handleInputChange('isLabelled', false),
                  ]}
                  value={
                    regulatorDetails.isLabelled === null
                      ? null
                      : regulatorDetails.isLabelled
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
           
             <View style={{ gap: 10 }}>
                <Text type={TextType.CAPTION_2}>
                  {'Is there a purpose made ventilation? *'}
                </Text>
                <OptionalButton
                  options={['Yes', 'No']}
                  actions={[
                    () => handleInputChange('isVentilation', true),
                    () => handleInputChange('isVentilation', false),
                  ]}
                  value={
                    regulatorDetails.isVentilation === null
                      ? null
                      : regulatorDetails.isVentilation
                      ? 'Yes'
                      : 'No'
                  }
                />
              </View>
           
            {isModal && (
            <BarcodeScanner
              setIsModal={setIsModal}
              cameraRef={camera}
              barcodeRecognized={readSerialNumber}
            />
          )}
          </View>
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
