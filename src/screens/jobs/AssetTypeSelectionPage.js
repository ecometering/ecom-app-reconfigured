import React, { useEffect } from 'react';
import {
  View,
  Platform,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
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
  console.log("route info: ", route);
  const title = route.params?.title;
  const { state, setState } = useFormStateContext();
  const { jobType, siteQuestions, jobID } = state;

  useEffect(() => {
    console.log("Updated siteQuestions:", siteQuestions);
  }, [siteQuestions]);

  
  
  const handleInputChange = (section, name, value) => {
    console.log(`Changing ${section}.${name} to ${value}`);
    setState((prevState) => {
      let newState;
      if (jobType === 'Exchange') {
        newState = {
          ...prevState,
          siteQuestions: {
            ...prevState.siteQuestions,
            [section]: {
              ...prevState.siteQuestions[section],
              [name]: value,
            },
          },
        };
      } else {
        newState = {
          ...prevState,
          siteQuestions: {
            ...prevState.siteQuestions,
            [name]: value,
          },
        };
      }
      console.log("New state after change:", newState);
      return newState;
    });
  };

  const backPressed = async () => {
    console.log("Back button pressed");
    goToPreviousStep();
  };

  const nextPressed = async () => {
    console.log("Next button pressed");
    if (jobType === 'Exchange') {
      const { assetsRemoved, assetsInstalled } = siteQuestions || {};
      const hasRemovedAsset = assetsRemoved?.isMeter || assetsRemoved?.isAmr || assetsRemoved?.isCorrector;
      const hasInstalledAsset = assetsInstalled?.isMeter || assetsInstalled?.isAmr || assetsInstalled?.isCorrector;

      console.log("Exchange job - Assets being removed:", hasRemovedAsset);
      console.log("Exchange job - Assets being installed:", hasInstalledAsset);

      if (!hasRemovedAsset || !hasInstalledAsset) {
        console.log("Validation failed: Not enough assets selected for Exchange");
        EcomHelper.showInfoMessage(
          'For an exchange, you must select at least one asset type to remove and one to install.'
        );
        return;
      }
    } else {
      if (!siteQuestions?.isMeter && !siteQuestions?.isAmr && !siteQuestions?.isCorrector) {
        console.log("Validation failed: No assets selected");
        EcomHelper.showInfoMessage(
          'You must select at least one asset type to proceed.'
        );
        return;
      }
    }

    console.log("Validation passed, proceeding to next step");
    goToNextStep();
  };

  const renderAssetSwitches = (section = '') => {
    console.log(`Rendering asset switches for section: ${section}`);
    return (
      <>
        <SwitchWithTitle
          title={'Meter'}
          value={jobType === 'Exchange' ? siteQuestions?.[section]?.isMeter ?? false : siteQuestions?.isMeter ?? false}
          onValueChange={(e) => handleInputChange(section, 'isMeter', e)}
        />
        <SwitchWithTitle
          title={'AMR'}
          value={jobType === 'Exchange' ? siteQuestions?.[section]?.isAmr ?? false : siteQuestions?.isAmr ?? false}
          onValueChange={(e) => handleInputChange(section, 'isAmr', e)}
        />
        <SwitchWithTitle
          title={'Corrector'}
          value={jobType === 'Exchange' ? siteQuestions?.[section]?.isCorrector ?? false : siteQuestions?.isCorrector ?? false}
          onValueChange={(e) => handleInputChange(section, 'isCorrector', e)}
        />
      </>
    );
  };

  console.log("Rendering AssetTypeSelectionPage");
  console.log("Current jobType:", jobType);
  console.log("Current siteQuestions:", siteQuestions);

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
            {jobType === 'Exchange' ? (
              <>
                <View style={styles.section}>
                  <Text type={TextType.CAPTION_1}>Assets Being Removed</Text>
                  {renderAssetSwitches('assetsRemoved')}
                </View>
                <View style={styles.section}>
                  <Text type={TextType.CAPTION_1}>Assets Being Installed</Text>
                  {renderAssetSwitches('assetsInstalled')}
                </View>
              </>
            ) : (
              renderAssetSwitches()
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
    flex: 1,
    gap: 20,
    padding: 20,
  },
  section: {
    marginTop: 20,
    gap: 10,
  },
});

export default AssetTypeSelectionPage;