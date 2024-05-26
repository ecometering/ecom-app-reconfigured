import {
  ExchangeStandardPage,
  ExchangeStreamsSetSealDetailsPage,
  ExistingDataLoggerDetails,
  InstalledDataLoggerDetails,
} from '../nagivation-routes/exchange-navigations';
import {
  DataLoggerDetailsPage,
  StandardPage,
  StreamsSetSealDetailsPage,
} from '../nagivation-routes/install-navigations';
import {
  MaintenanceExistingCorrectorDetails,
  MaintenanceQuestionsPage,
  MaintenanceStreamsSetSealDetailsPage,
} from '../nagivation-routes/maintenance-navigations';
import {
  RemovedDataLoggerDetails,
  RemovedStandardPage,
} from '../nagivation-routes/removal-navigations';
import {
  SurveyExistingDataLoggerDetails,
  SurveyStandardPage,
  SurveyStreamsSetSealDetailsPage,
} from '../nagivation-routes/survey-navigations';
import {
  WarrantRemovedDataLoggerDetails,
  WarrantStandardPage,
} from '../nagivation-routes/warrant-navigations';
import { getAssetSelectRoute } from './assetSelectGateway';

export const getCorrectorRoute = ({ state }) => {
  // TODO: sort context switch
  // Redux might be a better option
  const { jobType, meterDetails } = state || {};
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
      // TODO: datalogger logic is missing
      if (datalogger) {
        return MaintenanceExistingCorrectorDetails; // Navigate to DataLogger if true
      } else if (isMeter) {
        return MaintenanceStreamsSetSealDetailsPage; // Use setAndSeal logic if meter is present
      } else {
        return MaintenanceQuestionsPage; // Fallback to maintenance questions
      }
      break;
    case 'Removal':
      if (datalogger) {
        return RemovedDataLoggerDetails; // Navigate to DataLogger if true
        // Use setAndSeal logic if meter is present
      } else {
        return RemovedStandardPage; // Fallback to StandardsNavigation
      }
      break;
    case 'Survey':
      if (isAmr) {
        return SurveyExistingDataLoggerDetails;
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
          return SurveyStreamsSetSealDetailsPage;
        }
      } else {
        return SurveyStandardPage;
      }

      break;
    case 'Warant':
      if (datalogger) {
        return WarrantRemovedDataLoggerDetails;
      } else {
        return WarrantStandardPage;
      }
    case 'Exchange':
      if (pageRoute === 1) {
        if (isAmr) {
          return ExistingDataLoggerDetails;
        } else {
          return getAssetSelectRoute({ state, pageFlow: 2 });
        }
      } else if (pageRoute === 2) {
        if (isAmr) {
          return InstalledDataLoggerDetails;
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
            return ExchangeStreamsSetSealDetailsPage;
          }
        } else {
          return ExchangeStandardPage;
        }
      }
      break;
    default:
      console.log(
        'Job type not recognized, staying on the current screen or navigating to a default screen.'
      );
      break;
  }
};
