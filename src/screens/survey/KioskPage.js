import {
  Text,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite/next';

// Components
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import { TextInputWithTitle } from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { TextType } from '../../theme/typography';
import { validateKioskDetails } from './KioskPage.validator';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const isIos = Platform.OS === 'ios';

export default function KioskPage() {
  const db = useSQLiteContext();
  const { state, setState } = useFormStateContext();
  const { kioskDetails, jobID } = state;
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const handleInputChange = (key, value) => {
    setState((prev) => ({
      ...prev,
      kioskDetails: {
        ...prev.kioskDetails,
        [key]: value,
      },
    }));
  };

  const saveToDatabase = async () => {
    const kioskJson = JSON.stringify(kioskDetails);
    try {
      await db
        .runAsync('UPDATE Jobs SET kioskDetails =? WHERE id = ?', [
          kioskJson,
          jobID,
        ])
        .then((result) => {
          console.log('Kiosk Details saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving Kiosk details to database:', error);
    }
  };

  const nextPressed = async () => {
    const { isValid, message } = validateKioskDetails(kioskDetails);

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
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'Kiosk Details'}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={isIos ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.body}>
            <TextInputWithTitle
              title="Kiosk Type"
              value={kioskDetails.type}
              onChangeText={(txt) => {
                const withSpecialChars = txt.toUpperCase();
                const formattedText = withSpecialChars.replace(
                  /[^A-Z0-9"/ ]+/g,
                  ''
                );
                handleInputChange('type', formattedText);
              }}
              style={styles.input}
            />

            <TextInputWithTitle
              title="Kiosk Condition"
              value={kioskDetails.condition}
              onChangeText={(txt) => {
                const formattedText = txt.replace(/[^A-Za-z]+/g, '');
                handleInputChange('condition', formattedText);
              }}
              style={styles.input}
            />

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is kiosk weather resistant? *'}
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange('isWeatherResistant', true);
                  },
                  () => {
                    handleInputChange('isWeatherResistant', false);
                  },
                ]}
                value={
                  kioskDetails.isWeatherResistant === undefined
                    ? null
                    : kioskDetails.isWeatherResistant
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is kiosk lockable? *'}
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange('isLockable', true);
                  },
                  () => {
                    handleInputChange('isLockable', false);
                  },
                ]}
                value={
                  kioskDetails.isLockable === undefined
                    ? null
                    : kioskDetails.isLockable
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is kiosk free of vegetation, trees, etc.? *'}
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange('isVegitationFree', true);
                  },
                  () => {
                    handleInputChange('isVegitationFree', false);
                  },
                ]}
                value={
                  kioskDetails.isVegitationFree === undefined
                    ? null
                    : kioskDetails.isVegitationFree
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is kiosk/housing stable? *'}
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange('isStable', true);
                  },
                  () => {
                    handleInputChange('isStable', false);
                  },
                ]}
                value={
                  kioskDetails.isStable === undefined
                    ? null
                    : kioskDetails.isStable
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is Kiosk Free of Flooding? *'}
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange('isFloodingFree', true);
                  },
                  () => {
                    handleInputChange('isFloodingFree', false);
                  },
                ]}
                value={
                  kioskDetails.isFloodingFree === undefined
                    ? null
                    : kioskDetails.isFloodingFree
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is kiosk roof an explosion relief roof? *'}
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange('isExplosionReliefRoof', true);
                  },
                  () => {
                    handleInputChange('isExplosionReliefRoof', false);
                  },
                ]}
                value={
                  kioskDetails.isExplosionReliefRoof === undefined
                    ? null
                    : kioskDetails.isExplosionReliefRoof
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is kiosk easily accessible? *'}
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange('isAccessible', true);
                  },
                  () => {
                    handleInputChange('isAccessible', false);
                  },
                ]}
                value={
                  kioskDetails.isAccessible === undefined
                    ? null
                    : kioskDetails.isAccessible
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Are there steps leading up to the kiosk? *'}
              </Text>
              <OptionalButton
                options={['Yes', 'No']}
                actions={[
                  () => {
                    handleInputChange('isSteps', true);
                  },
                  () => {
                    handleInputChange('isSteps', false);
                  },
                ]}
                value={
                  kioskDetails.isSteps === undefined
                    ? null
                    : kioskDetails.isSteps
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
          </View>
          <Text type={TextType.CAPTION_2} style={styles.sectionTitle}>
            Internal Kiosk Dimensions
          </Text>
          <View style={styles.row}>
            <TextInputWithTitle
              title="Height (mm)"
              value={kioskDetails.height}
              onChangeText={(txt) => {
                const numericValue = txt.replace(/[^0-9.]/g, '');
                handleInputChange('height', numericValue);
              }}
              keyboardType="numeric"
              containerStyle={styles.input}
            />

            <TextInputWithTitle
              title="Width (mm)"
              value={kioskDetails.width}
              onChangeText={(txt) => {
                const numericValue = txt.replace(/[^0-9.]/g, '');
                handleInputChange('width', numericValue);
              }}
              keyboardType="numeric"
              containerStyle={styles.input}
            />

            <TextInputWithTitle
              title="Length (mm)"
              value={kioskDetails.length}
              onChangeText={(txt) => {
                const numericValue = txt.replace(/[^0-9.]/g, '');
                handleInputChange('length', numericValue);
              }}
              keyboardType="numeric"
              containerStyle={styles.input}
            />
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
  content: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 10,
    gap: 10,
  },
  body: { gap: 10 },
  row: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  input: {
    flex: 1,
  },
  optionContainer: {
    flex: 1,
  },
  questionText: {
    marginBottom: 5,
  },
  sectionTitle: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
});
