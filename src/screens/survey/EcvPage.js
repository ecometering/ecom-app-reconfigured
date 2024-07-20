import {
  View,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

// Components
import Header from '../../components/Header';
import EcomDropDown from '../../components/DropDown';
import { TextInputWithTitle } from '../../components/TextInput';

// Utils & Context
import EcomHelper from '../../utils/ecomHelper';
import { SIZE_LIST } from '../../utils/constant';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';
import { validateEcvDetails } from './EcvPage.validator';

const isIos = Platform.OS === 'ios';

export default function EcvPage() {
  const db = useSQLiteContext();

  const { state, setState } = useFormStateContext();
  const { ecvDetails, jobID } = state;

  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const handleInputChange = (key, value) => {
    setState((prev) => ({
      ...prev,
      ecvDetails: {
        ...prev.ecvDetails,
        [key]: value,
      },
    }));
  };

  const saveToDatabase = async () => {
    const ecvJson = JSON.stringify(ecvDetails);
    try {
      await db
        .runAsync('UPDATE Jobs SET ecvDetails =? WHERE id = ?', [
          ecvJson,
          jobID,
        ])
        .then((result) => {
          console.log('ecv Details saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving ecv details to database:', error);
    }
  };

  const nextPressed = async () => {
    const { isValid, message } = validateEcvDetails(ecvDetails);

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    await saveToDatabase();
    goToNextStep();
  };

  const backPressed = async () => {
    await saveToDatabase();
    goToPreviousStep();
  };

  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'ecv Details'}
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
              <View style={{ flex: 1 }}>
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
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <TextInputWithTitle
                  title="ECV height (mm)"
                  value={ecvDetails.height}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('height', numericValue);
                  }}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <EcomDropDown
                  value={ecvDetails.size}
                  valueList={SIZE_LIST}
                  placeholder="Select size"
                  onChange={(item) => handleInputChange('size', item.value)}
                />
              </View>
            </View>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <TextInputWithTitle
                  title="Distance from Kiosk wall (mm)"
                  value={ecvDetails.dfkw}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('dfkw', numericValue);
                  }}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInputWithTitle
                  title="Distance from  Rear Kiosk wall (mm)"
                  value={ecvDetails.dfrkw}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('dfrkw', numericValue);
                  }}
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
    padding: 10,
    gap: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
});
