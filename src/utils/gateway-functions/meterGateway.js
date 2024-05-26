import {
  ExchangeStandardPage,
  ExchangeStreamsSetSealDetailsPage,
  ExistingCorrectorDetails,
  ExistingDataLoggerDetails,
  ExistingMeterDataBadge,
  ExistingMeterIndex,
  InstalledCorrectorDetails,
  InstalledDataLoggerDetails,
  InstalledMeterDataBadge,
  InstalledMeterIndex,
} from '../nagivation-routes/exchange-navigations';
import {
  StandardPage,
  MeterIndexPage,
  MeterDataBadgePage,
  CorrectorDetailsPage,
  DataLoggerDetailsPage,
  StreamsSetSealDetailsPage,
} from '../nagivation-routes/install-navigations';
import {
  RemovedMeterIndex,
  RemovedStandardPage,
  RemovedMeterDataBadge,
  RemovedCorrectorDetails,
  RemovedDataLoggerDetails,
} from '../nagivation-routes/removal-navigations';
import {
  SurveyExistingCorrectorDetails,
  SurveyExistingDataLoggerDetails,
  SurveyExistingMeterDataBadge,
  SurveyExistingMeterIndex,
  SurveyStandardPage,
  SurveyStreamsSetSealDetailsPage,
} from '../nagivation-routes/survey-navigations';
import {
  WarrantRemovedMeterDataBadge,
  WarrantRemovedMeterIndex,
} from '../nagivation-routes/warrant-navigations';

export const getMeterRoute = ({ state, pageflow, pageRoute }) => {
  // TODO: sort context switch
  // Redux might be a better option
  const { jobType, meterDetails } = state || {};

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
          return RemovedMeterDataBadge;
        } else {
          return RemovedMeterIndex;
        }
      }
      if (pageflow === 2) {
        if (isCorrector === true) {
          return RemovedCorrectorDetails;
        } else if (isAmr) {
          return RemovedDataLoggerDetails;
        } else {
          return RemovedStandardPage;
        }
      }
      break;
    case 'Survey':
      if (pageflow === 1) {
        if (!['1', '2', '4'].includes(Type)) {
          return SurveyExistingMeterDataBadge;
        } else {
          return SurveyExistingMeterIndex;
        }
      }
      if (pageflow === 2) {
        if (isCorrector === true) {
          return SurveyExistingCorrectorDetails;
        } else if (isAmr) {
          return SurveyExistingDataLoggerDetails;
        } else if (
          ((Type === '1' || Type === '2' || Type === '4') &&
            pressureTier === 'MP') ||
          (Type !== '1' && Type !== '2' && Type !== '4')
        ) {
          return SurveyStreamsSetSealDetailsPage;
        } else {
          return SurveyStandardPage;
        }
      }
      break;
    case 'Warant':
      if (pageRoute === 1) {
        if (Type === '1' || Type === '2' || Type === '4') {
          return WarrantRemovedMeterDataBadge;
        } else {
          return WarrantRemovedMeterIndex;
        }
      }
      break;
    case 'Exchange':
      if (pageRoute === 1) {
        if (pageflow === 1) {
          if (Type === '1' || Type === '2' || Type === '4') {
            return ExistingMeterDataBadge;
          } else {
            return ExistingMeterIndex;
          }
        } else if (pageflow === '2') {
          if (isCorrector) {
            return ExistingCorrectorDetails;
          } else if (datalogger) {
            return ExistingDataLoggerDetails;
          } else {
            // TODO check this logic if its correct
            return 'NewScreen'; // Replace 'NewScreen' with the actual screen name you want to navigate to
          }
        } else {
          console.log('Invalid page flow for route 1, navigating to default.');
        }
      } else if (pageRoute === 2) {
        if (pageflow === 1) {
          if (Type === '1' || Type === '2' || Type === '4') {
            return InstalledMeterDataBadge;
          } else {
            return InstalledMeterIndex;
          }
        } else if (pageflow === 2) {
          if (isCorrector) {
            return InstalledCorrectorDetails;
          } else if (isAmr) {
            return InstalledDataLoggerDetails;
            // TODO: isMeter is not defined
          } else if (isMeter) {
            if (
              ((Type === '1' || Type === '2' || Type === '4') &&
                pressureTier === 'MP') ||
              (Type !== '1' && Type !== '2' && Type !== '4')
            ) {
              return ExchangeStreamsSetSealDetailsPage;
            }
          } else {
            return ExchangeStandardPage;
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
