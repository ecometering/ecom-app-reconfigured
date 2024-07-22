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
