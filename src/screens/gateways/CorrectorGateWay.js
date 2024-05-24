import { useEffect, useState, useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppContext } from '../../context/AppContext';

// TODO: This page should be removed and the logic should be moved to a utility function
// on navigation to the next screen
const CorrectorGatewayScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { pageRoute } = route.params || {};

  const { jobType, meterDetails } = useContext(AppContext);
  const { meterType, pressureTier } = meterDetails || {};

  const isAmr = meterDetails?.isAmr;
  const isMeter = meterDetails?.isMeter;
  const isCorrector = meterDetails?.isCorrector;

  useEffect(() => {
    console.log('CorrectorGatewayScreen Mounted');

    // This is a temporary solution to navigate to the next screen based on the jobType
    // for some reason the previous screens are not being unmounted, so the network request
    // is being called and navigation is being blocked on mount here
    setTimeout(() => {
      navigateBasedOnJobType();
    }, 500);
  }, [pageRoute]);

  function navigateBasedOnJobType() {
    switch (jobType) {
      case 'Install':
        if (isAmr) {
          navigation.replace('DataLoggerDetails');
        } else if (isMeter) {
          if (
            ((Type === '1' || Type === '2' || Type === '4') &&
              pressureTier === 'MP') ||
            (Type !== '1' && Type !== '2' && Type !== '4')
          ) {
            navigation.replace('StreamsSetSealDetails');
          }
        } else {
          navigation.replace('StandardPage');
        }
        break;
      case 'Maintenance':
        break;
      case 'Removal':
        if (datalogger) {
          navigation.replace('RemovedDataLoggerDetails'); // Navigate to DataLogger if true
          // Use setAndSeal logic if meter is present
        } else {
          navigation.replace('StandardPage'); // Fallback to StandardsNavigation
        }
        break;
      case 'Survey':
        if (isAmr) {
          navigation.replace('ExistingDataLoggerDetails');
        } else if (isMeter) {
          if (
            ((meterType.value === '1' ||
              meterType.value === '2' ||
              meterType.value === '4') &&
              pressureTier === 'MP') ||
            (meterType.value !== '1' &&
              meterType.value !== '2' &&
              meterType.value !== '4')
          ) {
            navigation.replace('StreamsSetSealDetails');
          }
        } else {
          navigation.replace('StandardPage');
        }

        // Add specific logic for Survey job type
        break;
      case 'Warant':
        if (datalogger) {
          navigation.replace('RemovedDataLoggerDetails'); // Navigate to DataLogger if true
          // Use setAndSeal logic if meter is present
        } else {
          navigation.replace('StandardPage'); // Fallback to StandardsNavigation
        }

        break;
      case 'exchange':
        if (pageRoute === 1) {
          if (isAmr) {
            navigation.replace('DataLoggerDetails');
          } else {
            navigation.replace('AssetSelectGatewayScreenFinal');
          }
        } else if (pageRoute === 2) {
          if (isAmr) {
            navigation.replace('DataLoggerDetails');
          } else if (isMeter) {
            if (
              ((meterType.value === '1' ||
                meterType.value === '2' ||
                meterType.value === '4') &&
                pressureTier === 'MP') ||
              (meterType.value !== '1' &&
                meterType.value !== '2' &&
                meterType.value !== '4')
            ) {
              navigation.replace('StreamsSetSealDetails');
            }
          } else {
            navigation.replace('StandardPage');
          }
        }
        break;
      // Add more cases for different jobTypes if needed
      default:
        // Default case if jobType is not recognized
        console.log(
          'Job type not recognized, staying on the current screen or navigating to a default screen.'
        );
        break;
    }
  }
};
export default CorrectorGatewayScreen;
