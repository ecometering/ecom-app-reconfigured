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

const isIos = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
export default function EcvPage() {
  const route = useRoute();
  const { title, nextScreen } = route.params;
  const { ecvDetails, setEcvDetails } = useContext(AppContext);
  const navigation = useNavigation();

  const handleInputChange = (key, value) => {
    setEcvDetails((prev) => ({
      ...prev,
      [key]: value,
    }));
    console.log('ecvDetails', ecvDetails);
  };

  const nextPressed = async () => {
    const { type, height, size, dfkw, dfrkw } = ecvDetails;

    if (!type) {
      EcomHelper.showInfoMessage(
        'ECV Type is required.Please enter the ECV Type.'
      );
    } else if (!height) {
      EcomHelper.showInfoMessage(
        'ECV Height is required.Please enter the ECV Height.'
      );
    } else if (!size) {
      EcomHelper.showInfoMessage(
        'ECV Size is required.Please enter the ECV Size.'
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
      console.log({ nextScreen });
      navigation.navigate(nextScreen);
    }
  };

  const backPressed = async () => {
    navigation.goBack();
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
                  title="ECV Type"
                  value={ecvDetails.type}
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
                  title="ECV height (cm)"
                  value={ecvDetails.height}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('height', numericValue);
                  }}
                  keyboardType="numeric"
                  style={[styles.input, { width: '100%' }]}
                />
              </View>
              <View style={{ flex: 0.5, marginTop: 8, marginLeft: 8 }}>
                <TextInputWithTitle
                  title="Size"
                  value={ecvDetails.size}
                  onChangeText={(txt) => {
                    const withSpecialChars = txt.toUpperCase();
                    const formattedText = withSpecialChars.replace(
                      /[^A-Z0-9"/ ]+/g,
                      ''
                    );
                    handleInputChange('size', formattedText);
                  }}
                  style={[styles.input, { width: '100%' }]}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 0.5, marginTop: 8, marginLeft: 8 }}>
                <TextInputWithTitle
                  title="Distance from Kiosk wall (cm)"
                  value={ecvDetails.dfkw}
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
                  title="Distance from  Rear Kiosk wall (cm)"
                  value={ecvDetails.dfrkw}
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
