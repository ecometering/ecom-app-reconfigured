import {
  CorrectorDetailsPage,
  DataLoggerDetailsPage,
  MeterDetailsPage,
} from '../nagivation-routes/install-navigations';

export const getAssetSelectRoute = ({ state }) => {
  const { jobType, meterDetails } = state || {};
  const { pageFlow } = meterDetails || {};

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
        return 'RemovedMeterDetails';
      } else if (meterDetails?.isCorrector) {
        return 'RemovedCorrectorDetails';
      } else if (meterDetails?.isAmr) {
        return 'RemovedDataLoggerDetails';
      }
      break;
    case 'Maintenance':
      if (meterDetails?.isMeter) {
        return 'ExistingMeterDetails';
      } else if (meterDetails?.isCorrector) {
        return 'ExistingCorrectorDetails';
      } else if (meterDetails?.isAmr) {
        return 'ExistingDataLoggerDetails';
      }
      break;
    case 'Survey':
      if (meterDetails?.isMeter) {
        return 'ExistingMeterDetails';
      } else if (meterDetails?.isCorrector) {
        return 'ExistingCorrectorDetails';
      } else if (meterDetails?.isAmr) {
        return 'ExistingDataLoggerDetails';
      }
      break;
    case 'Exchange':
      if (pageFlow === 1) {
        if (meterDetails?.isMeter) {
          console.log('Navigating to ExistingMeterDetails');
          return 'ExistingMeterDetails';
        } else if (meterDetails?.isCorrector) {
          return 'ExistingCorrectorDetails';
        } else if (meterDetails?.isAmr) {
          return 'ExistingDataLoggerDetails';
        }
      } else if (pageFlow === 2) {
        if (meterDetails?.isMeter) {
          return 'InstalledMeterDetailsScreen';
        } else if (meterDetails?.isCorrector) {
          return 'InstalledCorrectorDetailsScreen';
        } else if (meterDetails?.isAmr) {
          return 'InstalledDataLoggerDetailsScreen';
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
