import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import {
  CorrectorDetailsPage,
  DataLoggerDetailsPage,
  MeterDataBadgePage,
  MeterIndexPage,
  StandardPage,
  StreamsSetSealDetailsPage,
} from '../nagivation-routes/install-navigations';

export const getMeterRoute = ({ pageflow, pageRoute }) => {
  // TODO: sort context switch
  // Redux might be a better option
  const { jobType, meterDetails } = {};

  const isAmr = meterDetails?.isAmr;
  const Type = meterDetails?.meterType.value;
  const isCorrector = meterDetails?.isCorrector;
  const pressureTier = meterDetails?.pressureTier.label;

  switch (jobType) {
    case 'Install':
      if (pageflow === 1) {
        if (!['1', '2', '4'].includes(Type)) {
          return MeterDataBadgePage;
        } else {
          return MeterIndexPage;
        }
      }
      if (pageflow === 2) {
        if (isCorrector === true) {
          return CorrectorDetailsPage;
        } else if (isAmr) {
          return DataLoggerDetailsPage;
        } else if (
          ((Type === '1' || Type === '2' || Type === '4') &&
            pressureTier === 'MP') ||
          (Type !== '1' && Type !== '2' && Type !== '4')
        ) {
          return StreamsSetSealDetailsPage;
        } else {
          return StandardPage;
        }
      }
      break;
    case 'Removal':
      if (pageflow === 1) {
        if (!['1', '2', '4'].includes(Type)) {
          navigation.replace('RemovedMeterDataBadge');
        } else {
          navigation.replace('RemovedMeterIndex');
        }
      }
      if (pageflow === 2) {
        if (isCorrector === true) {
          navigation.replace('RemovedCorrectorDetails');
        } else if (isAmr) {
          navigation.replace('RemovedDataLoggerDetails');
        } else {
          navigation.replace('StandardPage');
        }
      }
      break;
    case 'Survey':
      if (pageflow === 1) {
        if (!['1', '2', '4'].includes(Type)) {
          navigation.replace('ExistingMeterDataBadge');
        } else {
          console.log('Navigating to MeterIndex');
          navigation.replace('ExistingMeterIndex');
        }
      }
      if (pageflow === 2) {
        if (isCorrector === true) {
          navigation.replace('ExistingCorrectorDetails');
        } else if (isAmr) {
          navigation.replace('ExistingDataLoggerDetails');
        } else if (
          ((Type === '1' || Type === '2' || Type === '4') &&
            pressureTier === 'MP') ||
          (Type !== '1' && Type !== '2' && Type !== '4')
        ) {
          navigation.replace('StreamsSetSealDetails');
        } else {
          navigation.replace('StandardPage');
        }
      }
      // Add specific logic for Survey job type
      break;
    case 'Warant':
      if (pageRoute === 1) {
        if (Type === '1' || Type === '2' || Type === '4') {
          navigation.replace('RemovedMeterDataBadge');
        } else {
          navigation.replace('RemovedMeterIndex');
        }
      }

      break;
    case 'Exchange':
      if (pageRoute === 1) {
        if (pageflow === 1) {
          console.log('Navigating to Screen 1 of Flow 1');
          if (Type === '1' || Type === '2' || Type === '4') {
            navigation.replace('ExistingMeterDataBadge');
          } else {
            navigation.replace('ExistingMeterIndex');
          }
        } else if (pageflow === '2') {
          // Navigate to the first screen of the second flow
          if (isCorrector) {
            navigation.navigate('ExistingCorrectorDetails');
          } else if (datalogger) {
            navigation.navigate('ExistingDataLoggerDetails');
          } else {
            navigation.navigate('NewScreen'); // Replace 'NewScreen' with the actual screen name you want to navigate to
          }
          // Example: navigateToScreen1Flow2();
        } else {
          console.log('Invalid page flow for route 1, navigating to default.');
          // Example: navigateToDefaultScreen();
        }
      } else if (pageRoute === '2') {
        if (pageflow === '1') {
          if (Type === '1' || Type === '2' || Type === '4') {
            navigation.replace('InstalledMeterDataBadge');
          } else {
            navigation.replace('InstalledMeterIndex');
          }
        } else if (pageflow === '2') {
          // Navigate to the first screen of the second flow in the second route
          if (isCorrector) {
            navigation.replace('InstalledCorrectorDetails');
          } else if (isAmr) {
            navigation.replace('InstalledDataLoggerDetails');
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
        } else {
          console.log('Invalid page flow for route 2, navigating to default.');
        }
      } else {
        console.log(
          'Invalid page route, navigating to a general default screen.'
        );
      }
      break;
    default:
      console.log(
        'Job type not recognized, staying on the current screen or navigating to a default screen.'
      );
      break;
  }
};