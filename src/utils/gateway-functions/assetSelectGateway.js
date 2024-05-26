import {
  ExistingCorrectorDetails,
  ExistingDataLoggerDetails,
  ExistingMeterDetails,
  InstalledCorrectorDetails,
  InstalledDataLoggerDetails,
  InstalledMeterDetails,
} from '../nagivation-routes/exchange-navigations';
import {
  CorrectorDetailsPage,
  DataLoggerDetailsPage,
  MeterDetailsPage,
} from '../nagivation-routes/install-navigations';
import {
  MaintenanceExistingCorrectorDetails,
  MaintenanceExistingDataLoggerDetails,
  MaintenanceExistingMeterDetails,
} from '../nagivation-routes/maintenance-navigations';
import {
  RemovedCorrectorDetails,
  RemovedDataLoggerDetails,
  RemovedMeterDetails,
} from '../nagivation-routes/removal-navigations';
import {
  SurveyExistingCorrectorDetails,
  SurveyExistingDataLoggerDetails,
  SurveyExistingMeterDetails,
} from '../nagivation-routes/survey-navigations';
import {
  WarrantRemovedCorrectorDetails,
  WarrantRemovedDataLoggerDetails,
  WarrantRemovedMeterDetails,
} from '../nagivation-routes/warrant-navigations';

export const getAssetSelectRoute = ({ state, pageFlow = 1 }) => {
  const { jobType, meterDetails } = state || {};

  console.log({ jobType, meterDetails })

  switch (jobType) {
    case 'Install':
      if (meterDetails?.isMeter) {
        return MeterDetailsPage;
      } else if (meterDetails?.isCorrector) {
        return CorrectorDetailsPage;
      } else if (meterDetails?.isAmr) {
        return DataLoggerDetailsPage;
      }
      break;
    case 'Removal':
      if (meterDetails?.isMeter) {
        return RemovedMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return RemovedCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return RemovedDataLoggerDetails;
      }
      break;
    case 'Warrant':
      if (meterDetails?.isMeter) {
        return WarrantRemovedMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return WarrantRemovedCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return WarrantRemovedDataLoggerDetails;
      }
      break;
    case 'Maintenance':
      if (meterDetails?.isMeter) {
        return MaintenanceExistingMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return MaintenanceExistingCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return MaintenanceExistingDataLoggerDetails;
      }
      break;
    case 'Survey':
      if (meterDetails?.isMeter) {
        return SurveyExistingMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return SurveyExistingCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return SurveyExistingDataLoggerDetails;
      }
      break;
    case 'Exchange':
      if (pageFlow === 1) {
        if (meterDetails?.isMeter) {
          return ExistingMeterDetails;
        } else if (meterDetails?.isCorrector) {
          return ExistingCorrectorDetails;
        } else if (meterDetails?.isAmr) {
          return ExistingDataLoggerDetails;
        }
      } else if (pageFlow === 2) {
        if (meterDetails?.isMeter) {
          return InstalledMeterDetails;
        } else if (meterDetails?.isCorrector) {
          return InstalledCorrectorDetails;
        } else if (meterDetails?.isAmr) {
          return InstalledDataLoggerDetails;
        }
      }
      break;
    default:
      console.error(
        'No conditions met, staying on the current screen or navigating to a default screen.'
      );
      break;
  }
};
