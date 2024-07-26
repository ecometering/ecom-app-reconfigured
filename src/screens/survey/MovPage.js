import {
  View,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

// Components
import Header from '../../components/Header';
import EcomDropDown from '../../components/DropDown';
import { TextInputWithTitle } from '../../components/TextInput';

// Utils & Context
import EcomHelper from '../../utils/ecomHelper';
import { SIZE_LIST } from '../../utils/constant';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';
import { validateMovDetails } from './MovPage.validator';

const isIos = Platform.OS === 'ios';

export default function MovPage() {
  const { state, setState } = useFormStateContext();
  const { movDetails } = state;
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const handleInputChange = (key, value) => {
    setState((prev) => ({
      ...prev,
      movDetails: {
        ...prev.movDetails,
        [key]: value,
      },
    }));
  };

  const nextPressed = async () => {
    const { isValid, message } = validateMovDetails(movDetails);

    if (!isValid) {
      EcomHelper.showInfoMessage(message);
      return;
    }

    goToNextStep();
  };

  const backPressed = async () => {
    goToPreviousStep();
  };

  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'MOV details'}
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
            <TextInputWithTitle
              title="Mov Type"
              value={movDetails?.type}
              onChangeText={(txt) => {
                const withSpecialChars = txt.toUpperCase();
                const formattedText = withSpecialChars.replace(
                  /[^A-Z0-9"/ ]+/g,
                  ''
                );
                handleInputChange('type', formattedText);
              }}
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <TextInputWithTitle
                  title="Mov height (mm)"
                  value={movDetails?.height}
                  onChangeText={(txt) => {
                    const numericValue = txt.replace(/[^0-9.]/g, '');
                    handleInputChange('height', numericValue);
                  }}
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <EcomDropDown
                  value={movDetails?.size}
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
                  value={movDetails?.dfkw}
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
                  value={movDetails?.dfrkw}
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
    flex: 1,
    gap: 10,
  },
});
