export const WarrantNavigation = [
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
    diversions: (state) => {
      const { siteDetails } = state;
      if (siteDetails?.confirmWarrant) {
        return SiteQuestionsPage;
      } else {
        return SubmitSuccessPage;
      }
    },
  },
];

export const SiteQuestionsPage = [
  {
    screen: 'SiteQuestionsPage',
    params: {
      title: 'Site Questions',
      photoKey: 'bypassPhoto',
    },
    diversions: (state) => {
      const { siteQuestions } = state;
      if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
        return WarrantStandardPage;
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

// Site Questions Alternative Flows
export const WarrantStandardPage = [
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

export const RebookPage = [
  {
    screen: 'RebookPage',
  },
  ...SubmitSuccessPage,
];

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

export const WarrantRemovedMeterDetails = [
  {
    screen: 'MeterDetails',
    params: {
      title: 'Removed Meter Details',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};

      const Type = meterDetails?.meterType.value;

      if (Type === '1' || Type === '2' || Type === '4') {
        return WarrantRemovedMeterDataBadge;
      } else {
        return WarrantRemovedMeterIndex;
      }
    },
  },
];

export const WarrantRemovedCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Removed Corrector Details',
      photoKey: 'removedCorrector',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};
      const isAmr = meterDetails?.isAmr;

      if (isAmr) {
        return WarrantRemovedDataLoggerDetails;
      } else {
        return WarrantStandardPage;
      }
    },
  },
];

export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    diversions: (state) => {
      const { meterDetails } = state || {};

      if (meterDetails?.isMeter) {
        return WarrantRemovedMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return WarrantRemovedCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return WarrantRemovedDataLoggerDetails;
      }
    },
  },
];

export const WarrantRemovedMeterIndex = [
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
    diversions: (state) => {
      const { meterDetails } = state || {};

      const Type = meterDetails?.meterType.value;

      // TODO: this is an infinite loop of screens logic needs to be looked at
      if (Type === '1' || Type === '2' || Type === '4') {
        return WarrantRemovedMeterDataBadge;
      } else {
        return WarrantRemovedMeterIndex;
      }
    },
  },
];

export const WarrantRemovedMeterDataBadge = [
  {
    screen: 'MeterDataBadge',
    params: {
      title: 'Removed Meter data badge',
      photoKey: 'RemovedMeterDataBadge',
    },
  },
  ...WarrantRemovedMeterIndex,
];

export const WarrantRemovedDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Removed AMR',
      photoKey: 'RemovedAMR',
    },
    diversions: (state) => {
      // TODO: this logic is not found in the original code but no diversion is found
      // if not diversion needed then add this to the array as next page
      return WarrantStandardPage;
    },
  },
];
