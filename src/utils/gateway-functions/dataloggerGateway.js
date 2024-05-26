import {
  ExchangeStandardPage,
  ExchangeStreamsSetSealDetailsPage,
} from '../nagivation-routes/exchange-navigations';
import {
  StandardPage,
  StreamsSetSealDetailsPage,
} from '../nagivation-routes/install-navigations';
import {
  MaintenanceQuestionsPage,
  MaintenanceStreamsSetSealDetailsPage,
} from '../nagivation-routes/maintenance-navigations';
import { RemovedStandardPage } from '../nagivation-routes/removal-navigations';
import {
  SurveyStandardPage,
  SurveyStreamsSetSealDetailsPage,
} from '../nagivation-routes/survey-navigations';
import { WarrantStandardPage } from '../nagivation-routes/warrant-navigations';

export const getDataloggerRoute = ({ state }) => {
  // TODO: sort context switch
  // Redux might be a better option
  const { jobType, meterDetails } = state || {};

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
          return MaintenanceStreamsSetSealDetailsPage;
        }
      } else {
        return MaintenanceQuestionsPage;
      }
      // Add specific logic for Maintenance job type
      break;
    case 'Removal':
      return RemovedStandardPage; // Fallback to StandardsNavigation
      break;
    case 'Survey':
      if (isMeter) {
        if (
          (meterType.value === '1' ||
            meterType.value === '2' ||
            meterType.value === '4') &&
          pressureTier === 'MP'
        ) {
          return SurveyStreamsSetSealDetailsPage;
        } else {
          return SurveyStandardPage;
        }
      } else {
        return SurveyStandardPage;
      }
      break;
    case 'Warant':
      return WarrantStandardPage; // Fallback to StandardsNavigation

      break;
    case 'Exchange':
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
          return ExchangeStreamsSetSealDetailsPage;
        }
      } else {
        return ExchangeStandardPage;
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
