import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  StandardPage,
  StreamsSetSealDetailsPage,
} from '../nagivation-routes/install-navigations';

export const getDataloggerRoute = () => {
  // TODO: sort context switch
  // Redux might be a better option
  const { jobType, meterDetails } = {};

  const Type = meterDetails?.meterType.value;
  const pressureTier = meterDetails?.pressureTier.label;
  const meterType = meterDetails?.meterType;
  const isMeter = meterDetails?.isMeter;

  switch (jobType) {
    case 'Install':
      if (isMeter) {
        if (
          ((Type === '1' || Type === '2' || Type === '4') &&
            pressureTier === 'MP') ||
          (Type !== '1' && Type !== '2' && Type !== '4')
        ) {
          return StreamsSetSealDetailsPage;
        } else {
          return StandardPage;
        }
      } else {
        return StandardPage;
      }

      break;
    case 'Maintenance':
      if (isMeter) {
        if (
          ((Type === '1' || Type === '2' || Type === '4') &&
            pressureTier === 'MP') ||
          (Type !== '1' && Type !== '2' && Type !== '4')
        ) {
          return 'StreamsSetSealDetails';
        }
      } else {
        return 'MaintenanceQuestions';
      }
      // Add specific logic for Maintenance job type
      break;
    case 'Removal':
      return 'StandardPage'; // Fallback to StandardsNavigation
      break;
    case 'Survey':
      console.log('Survey job type detected, navigating to the next screen.');
      if (isMeter) {
        if (
          (meterType.value === '1' ||
            meterType.value === '2' ||
            meterType.value === '4') &&
          pressureTier === 'MP'
        ) {
          return 'StreamsSetSealDetails';
        } else {
          return 'StandardPage';
        }
      } else {
        return 'StandardPage';
      }
      break;
    case 'Warant':
      return 'StandardPage'; // Fallback to StandardsNavigation

      break;
    case 'exchange':
      if (isMeter) {
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
