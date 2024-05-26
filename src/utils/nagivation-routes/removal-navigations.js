import { getAssetSelectRoute } from '../gateway-functions/assetSelectGateway';
import { getCorrectorRoute } from '../gateway-functions/correctorGateway';
import { getDataloggerRoute } from '../gateway-functions/dataloggerGateway';
import { getMeterRoute } from '../gateway-functions/meterGateway';
import { StandardPage } from './install-navigations';

export const RemovalNavigation = [
  {
    screen: 'SiteDetailsPage',
    params: {
      totalPages: 9,
      currentPage: 1,
    },
  },
  {
    screen: 'SitePhotoPage',
    params: {
      title: 'Site Photo',
      photoKey: 'sitePhoto',
    },
  },
  {
    screen: 'SiteQuestionsPage',
    params: {
      title: 'Site Questions',
      photoKey: 'bypassPhoto',
    },
    diversions: (state) => {
      const { siteQuestions } = state;
      if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
        return RemovedStandardPage;
      } else if (!siteQuestions?.isCarryOut) {
        return RebookPage;
      } else {
        return AssetTypeSelectionPage;
      }
    },
  },
];

export const SubmitSuccessPage = [
  {
    screen: 'SubmitSuccessPage',
  },
];

export const ExtraPhotoPageRoute = (
  params = {
    photoNumber: 0,
    photoKey: 'extraPhotos_0,',
    title: 'Extra Photos ',
  }
) => [
  {
    screen: 'ExtraPhotoPage',
    params,
  },
];

export const CompositeLabelPhoto = [
  {
    screen: 'CompositeLabelPhoto',
    params: {
      title: 'Composite label',
      photoKey: 'compositeLabel',
    },
  },
  {
    screen: 'DSEARLabelPhoto',
    params: {
      title: 'DSEAR label',
      photoKey: 'dsearLabel',
    },
  },
  ...ExtraPhotoPageRoute(),
  ...SubmitSuccessPage,
];

export const SnClientInfoPage = [
  {
    screen: 'SnClientInfoPage',
  },
  {
    screen: 'GasSafeWarningPage',
  },
  ...CompositeLabelPhoto,
];

// Standard Page Alternative Flows
export const RiddorReportPage = [
  {
    screen: 'RiddorReportPage',
    diversions: (state) => {
      const { standardDetails } = state;
      if (standardDetails.conformStandard === false) {
        return SnClientInfoPage;
      } else {
        return CompositeLabelPhoto;
      }
    },
  },
];

// AssetTypeSelectionPage
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    diversions: (state) => {
      getAssetSelectRoute({ state, pageFlow: 1 });
    },
  },
];

export const RebookPage = [
  {
    screen: 'RebookPage',
  },
  ...SubmitSuccessPage,
];

// Site Questions Alternative Flows
export const RemovedStandardPage = [
  {
    screen: 'StandardPage',
    diversions: (state) => {
      const { standardDetails } = state;
      const { riddorReportable, conformStandard } = standardDetails;
      if (riddorReportable === true) {
        return RiddorReportPage;
      } else {
        if (conformStandard === false) {
          return SnClientInfoPage;
        } else {
          return CompositeLabelPhoto;
        }
      }
    },
  },
];

export const RemovedMeterDetails = [
  {
    screen: 'MeterDetails',
    params: {
      title: 'Removed Meter Details',
    },
    diversions: (state) => {
      getMeterRoute({ state, pageFlow: 1 });
    },
  },
];

export const RemovedCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Removed Corrector Details',
      photoKey: 'removedCorrector',
    },
    diversions: (state) => getCorrectorRoute({ state }),
  },
];

export const RemovedDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Removed AMR',
      photoKey: 'RemovedAMR',
    },
    diversions: (state) => getDataloggerRoute({ state }),
  },
];

export const RemovedMeterIndex = [
  {
    screen: 'MeterIndex',
    params: {
      title: 'Removed Meter index',
      photoKey: 'RemovedMeterIndex',
    },
  },
  {
    screen: 'MeterPhoto',
    params: {
      title: 'Removed Meter photo',
      photoKey: 'RemovedMeterPhoto',
    },
  },
  {
    screen: 'EcvPhoto',
    params: {
      title: 'Ecv Photo',
      photoKey: 'EcvPhoto',
    },
    diversions: (state) =>
      getMeterRoute({ state, jobType: 'Removal', pageflow: 2 }),
  },
];

export const RemovedMeterDataBadge = [
  {
    screen: 'MeterDataBadge',
    params: {
      title: 'Removed Meter data badge',
      photoKey: 'RemovedMeterDataBadge',
    },
  },
  ...RemovedMeterIndex,
];

// TODO: Nothing navigates to this page
export const AdditionalMaterial = [
  {
    name: 'AdditionalMaterial',
    params: {
      title: 'Additional Material',
    },
    diversions: (state) => {
      // TODO: define dataLogger
      const datalogger = true;
      if (datalogger) {
        return RemovedDataLoggerDetails; // Navigate to DataLogger if true
        // Use setAndSeal logic if meter is present
      } else {
        return StandardPage; // Fallback to StandardsNavigation
      }
    },
  },
];
