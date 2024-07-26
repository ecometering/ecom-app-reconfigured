import {
  Text,
  View,
  Platform,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';

// Components
import Header from '../../components/Header';
import OptionalButton from '../../components/OptionButton';
import { TextInputWithTitle } from '../../components/TextInput';

// Context & Utils
import EcomHelper from '../../utils/ecomHelper';
import { TextType } from '../../theme/typography';
import { validateVentsDetails } from './VentsPage.validator';
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const isIos = Platform.OS === 'ios';

export default function VentsDetailsPage() {
  const { state, setState } = useFormStateContext();
  const { ventsDetails } = state;
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();

  const handleInputChange = (key, value) => {
    setState((prev) => ({
      ...prev,
      ventsDetails: {
        ...prev.ventsDetails,
        [key]: value,
      },
    }));
  };

  const nextPressed = async () => {
    const { isValid, message } = validateVentsDetails(ventsDetails);

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
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'Vents Details'}
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
              title="Vents Type"
              value={ventsDetails.type}
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
              title="Vents Condition"
              value={ventsDetails.condition}
              onChangeText={(txt) => {
                const formattedText = txt.replace(/[^A-Za-z]+/g, '');
                handleInputChange('condition', formattedText);
              }}
              style={styles.input}
            />

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is vents weather resistant? *'}
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
                  ventsDetails.isWeatherResistant === undefined
                    ? null
                    : ventsDetails.isWeatherResistant
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is vents lockable? *'}
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
                  ventsDetails.isLockable === undefined
                    ? null
                    : ventsDetails.isLockable
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is vents free of vegetation, trees, etc.? *'}
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
                  ventsDetails.isVegitationFree === undefined
                    ? null
                    : ventsDetails.isVegitationFree
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is vents/housing stable? *'}
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
                  ventsDetails.isStable === undefined
                    ? null
                    : ventsDetails.isStable
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is Vents Free of Flooding? *'}
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
                  ventsDetails.isFloodingFree === undefined
                    ? null
                    : ventsDetails.isFloodingFree
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is vents roof an explosion relief roof? *'}
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
                  ventsDetails.isExplosionReliefRoof === undefined
                    ? null
                    : ventsDetails.isExplosionReliefRoof
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Is vents easily accessible? *'}
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
                  ventsDetails.isAccessible === undefined
                    ? null
                    : ventsDetails.isAccessible
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>

            <View style={styles.optionContainer}>
              <Text type={TextType.CAPTION_2} style={styles.questionText}>
                {'Are there steps leading up to the vents? *'}
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
                  ventsDetails.isSteps === undefined
                    ? null
                    : ventsDetails.isSteps
                    ? 'Yes'
                    : 'No'
                }
              />
            </View>
          </View>
          <Text type={TextType.CAPTION_2} style={styles.sectionTitle}>
            Internal Vents Dimensions
          </Text>
          <View style={styles.row}>
            <TextInputWithTitle
              title="Height (mm)"
              value={ventsDetails.height}
              onChangeText={(txt) => {
                const numericValue = txt.replace(/[^0-9.]/g, '');
                handleInputChange('height', numericValue);
              }}
              keyboardType="numeric"
              containerStyle={styles.input}
            />

            <TextInputWithTitle
              title="Width (mm)"
              value={ventsDetails.width}
              onChangeText={(txt) => {
                const numericValue = txt.replace(/[^0-9.]/g, '');
                handleInputChange('width', numericValue);
              }}
              keyboardType="numeric"
              containerStyle={styles.input}
            />

            <TextInputWithTitle
              title="Length (mm)"
              value={ventsDetails.length}
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
