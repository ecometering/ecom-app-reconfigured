import { useContext, useRef, useState, useEffect } from 'react';
import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import Text from '../../components/Text';
import OptionalButton from '../../components/OptionButton';
import EcomDropDown from '../../components/DropDown';
import TextInput, { TextInputWithTitle } from '../../components/TextInput';
import { AppContext } from '../../context/AppContext';
import EcomHelper from '../../utils/ecomHelper';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';
import { useSQLiteContext } from 'expo-sqlite/next';
import { SIZE_LIST } from '../../utils/constant';

const isIos = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
export default function MovPage() {
  const db = useSQLiteContext();
  const route = useRoute();
  const { title} = route.params;
  const { movDetails, setMovDetails,jobID } = useContext(AppContext);
  const navigation = useNavigation();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const handleInputChange = (key, value) => {
    setMovDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log('MovDetails', movDetails);
  };

  const saveToDatabase = async () => {
    const movJson = JSON.stringify(movDetails)
    try {
      await db 
      .runAsync ( 
        'UPDATE Jobs SET movDetails =? WHERE id = ?',
        [movJson, jobID]
      )
      .then((result) => {
        console.log('mov Details saved to database:', result);
      });
  } catch (error) {
    console.log('Error saving mov details to database:', error);
  }
    };
  
  const nextPressed = async () => {
    const { type, height, size, dfkw, dfrkw } = movDetails;

    if (!type) {
      EcomHelper.showInfoMessage(
        'Mov Type is required.Please enter the Mov Type.'
      );
    } else if (!height) {
      EcomHelper.showInfoMessage(
        'Mov Height is required.Please enter the Mov Height.'
      );
    } else if (!size) {
      EcomHelper.showInfoMessage(
        'Mov Size is required.Please enter the Mov Size.'
      );
    } else if (!dfkw) {
      EcomHelper.showInfoMessage(
        'Distance from Kiosk Wall is required.Please enter the Distance from Kiosk Wall.'
      );
    } else if (!dfrkw) {
      EcomHelper.showInfoMessage(
        'Distance from Rear Kiosk Wall is required.Please enter the Distance from Rear Kiosk Wall.'
      );
    } else {
      saveToDatabase();
      goToNextStep();
    }
  };

  const backPressed = async () => {
    saveToDatabase();
    goToPreviousStep();
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
        behavior={isIos ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView style={styles.content}>
          <View style={styles.spacer} />
          <View style={styles.body}>
            <View style={styles.row}>
              <View style={{ flex: 1, marginTop: 8, marginLeft: 8 }}>
                <TextInputWithTitle
                  title="Mov Type"
                  value={movDetails.type}
                  onChangeText={(txt) => {
                    const withSpecialChars = txt.toUpperCase();
                    const formattedText = withSpecialChars.replace(
                      /[^A-Z0-9"/ ]+/g,
                      ''
                    );
                    handleInputChange('type', formattedText);
                  }}
                  style={[styles.input, { width: '100%' }]}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 0.5, marginTop: 8, marginLeft: 8 }}>
                <TextInputWithTitle
                  title="Mov height (mm)"
                  value={movDetails.height}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('height', numericValue);
                  }}
                  keyboardType="numeric"
                  style={[styles.input, { width: '100%' }]}
                />
              </View>
              <View style={{ flex: 0.5, marginTop: 8, marginLeft: 8 }}>
                
                    
                      <EcomDropDown
                        width={width * 0.35}
                        value={movDetails.size}
                        valueList={SIZE_LIST}
                        placeholder="Select size"
                        onChange={(item) =>
                          handleInputChange('size', item.value)
                        }
                      />
                   
                  
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 0.5, marginTop: 8, marginLeft: 8 }}>
                <TextInputWithTitle
                  title="Distance from Kiosk wall (mm)"
                  value={movDetails.dfkw}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('dfkw', numericValue);
                  }}
                  style={[styles.input, { width: '100%' }]}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 0.5, marginTop: 8, marginLeft: 8 }}>
                <TextInputWithTitle
                  title="Distance from  Rear Kiosk wall (mm)"
                  value={movDetails.dfrkw}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('dfrkw', numericValue);
                  }}
                  style={[styles.input, { width: '100%' }]}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  body: {
    marginHorizontal: width * 0.05,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Ensure vertical alignment is centered for row items
  },
  input: {
    width: '100%', // Adjust to use full width of its container for better visibility
    height: 40, // Ensure this is a number, not a string
    borderColor: 'gray', // Optional: for border
    borderWidth: 1, // Optional: for border
    padding: 10,
  },
});
