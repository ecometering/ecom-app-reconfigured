import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  DataLoggerDetailsPage,
  StandardPage,
  StreamsSetSealDetailsPage,
} from '../nagivation-routes/install-navigations';

export const getCorrectorRoute = () => {
  // TODO: sort context switch
  // Redux might be a better option
  const { jobType, meterDetails } = {};
  const { meterType, pressureTier } = meterDetails || {};
  const Type = meterDetails?.meterType.value;
  const isAmr = meterDetails?.isAmr;
  const isMeter = meterDetails?.isMeter;
  const isCorrector = meterDetails?.isCorrector;

  switch (jobType) {
    case 'Install':
      if (isAmr) {
        return DataLoggerDetailsPage;
      } else if (isMeter) {
        if (
          ((Type === '1' || Type === '2' || Type === '4') &&
            pressureTier === 'MP') ||
          (Type !== '1' && Type !== '2' && Type !== '4')
        ) {
          return StreamsSetSealDetailsPage;
        }
      } else {
        return StandardPage;
      }
      break;
    case 'Maintenance':
      break;
    case 'Removal':
      if (datalogger) {
        return 'RemovedDataLoggerDetails'; // Navigate to DataLogger if true
        // Use setAndSeal logic if meter is present
      } else {
        return 'StandardPage'; // Fallback to StandardsNavigation
      }
      break;
    case 'Survey':
      if (isAmr) {
        return 'ExistingDataLoggerDetails';
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
          return 'StreamsSetSealDetails';
        }
      } else {
        return 'StandardPage';
      }

      // Add specific logic for Survey job type
      break;
    case 'Warant':
      if (datalogger) {
        return 'RemovedDataLoggerDetails'; // Navigate to DataLogger if true
        // Use setAndSeal logic if meter is present
      } else {
        return 'StandardPage'; // Fallback to StandardsNavigation
      }

      break;
    case 'exchange':
      if (pageRoute === 1) {
        if (isAmr) {
          return 'DataLoggerDetails';
        } else {
          return 'AssetSelectGatewayScreenFinal';
        }
      } else if (pageRoute === 2) {
        if (isAmr) {
          return 'DataLoggerDetails';
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
            return 'StreamsSetSealDetails';
          }
        } else {
          return 'StandardPage';
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
};
