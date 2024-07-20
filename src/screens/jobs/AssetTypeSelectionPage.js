import {
  View,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

// Components
import Text from '../../components/Text';
import Header from '../../components/Header';
import SwitchWithTitle from '../../components/Switch';

// Utils
import EcomHelper from '../../utils/ecomHelper';
import { TextType } from '../../theme/typography';

// Context
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

function AssetTypeSelectionPage() {
  const { goToPreviousStep, goToNextStep } = useProgressNavigation();
  const route = useRoute();
  const { title } = route.params;

  const { state, setState } = useFormStateContext();
  const { jobType, meterDetails, jobID } = state;

  // Destructuring parameters directly to ensure they're accessed consistently
  const saveToDatabase = async () => {
    const meterDetailsJson = JSON.stringify(meterDetails);
    try {
      await db
        .runAsync('UPDATE Jobs SET meterDetails = ? WHERE id = ?', [
          meterDetailsJson,
          jobID,
        ])
        .then((result) => {
          console.log('meterDetails saved to database:', result);
        });
    } catch (error) {
      console.log('Error saving meterDetails to database:', error);
    }
  };

  const handleInputChange = (name, value) => {
    setState({
      ...state,
      meterDetails: {
        ...meterDetails,
        [name]: value,
      },
    });
  };

  const backPressed = async () => {
    await saveToDatabase();
    goToPreviousStep();
  };

  const nextPressed = async () => {
    const { isMeter, isAmr, isCorrector } = meterDetails || {};

    if (!isMeter && !isAmr && !isCorrector) {
      EcomHelper.showInfoMessage(
        'You must select at least one asset type to proceed.'
      );
      return;
    }

    await saveToDatabase();
    goToNextStep();
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
            <Text type={TextType.CAPTION_3}>{jobType}</Text>
            <SwitchWithTitle
              title={'Meter'}
              value={meterDetails?.isMeter}
              onValueChange={(e) => {
                handleInputChange('isMeter', e);
              }}
            />

            <SwitchWithTitle
              title={'AMR'}
              value={meterDetails?.isAmr}
              onValueChange={(e) => {
                handleInputChange('isAmr', e);
              }}
            />

            <SwitchWithTitle
              title={'Corrector'}
              value={meterDetails?.isCorrector}
              onValueChange={(e) => {
                handleInputChange('isCorrector', e);
              }}
            />
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
    flex: 1,
    gap: 20,
    padding: 20,
  },
});

export default AssetTypeSelectionPage;
