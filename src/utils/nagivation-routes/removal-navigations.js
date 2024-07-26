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
    diversions: ({ state }) => {
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
    diversions: ({ state }) => {
      const { standards } = state;
      if (standards.conformStandard === false) {
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

    params: {
      title: 'Assets being removed',
    },
    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      if (meterDetails?.isMeter) {
        return RemovedMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return RemovedCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return RemovedDataLoggerDetails;
      }
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
export const chatterBoxPage = [
  {
    screen: 'chatterBox',
    diversions: ({ state }) => {
      const { standards } = state;
      const { riddorReportable, conformStandard } = standards;

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

export const AdditionalMaterialsPage = [
  {
    screen: 'AdditionalMaterials',
    diversions: ({ state }) => {
      const { standards } = state;
      const { riddorReportable, conformStandard, chatterbox } = standards;
      if (chatterbox === true) {
        return chatterBoxPage;
      } else {
        if (riddorReportable === true) {
          return RiddorReportPage;
        } else {
          if (conformStandard === false) {
            return SnClientInfoPage;
          } else {
            return CompositeLabelPhoto;
          }
        }
      }
    },
  },
];
// Site Questions Alternative Flows
export const RemovedStandardPage = [
  {
    screen: 'StandardPage',
    diversions: ({ state }) => {
      const { standards } = state;
      const {
        riddorReportable,
        conformStandard,
        chatterbox,
        additionalMaterials,
      } = standards;
      if (additionalMaterials === true) {
        return AdditionalMaterialsPage;
      } else {
        if (chatterbox === true) {
          return chatterBoxPage;
        } else {
          if (riddorReportable === true) {
            return RiddorReportPage;
          } else {
            if (conformStandard === false) {
              return SnClientInfoPage;
            } else {
              return CompositeLabelPhoto;
            }
          }
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
    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      const Type = meterDetails?.meterType.value;

      if (!['1', '2', '4'].includes(Type)) {
        return RemovedMeterDataBadge;
      } else {
        return RemovedMeterIndex;
      }
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
    diversions: ({ state }) => {
      const { meterDetails } = state;

      if (meterDetails?.isAmr) {
        return RemovedDataLoggerDetails;
      }
      return RemovedStandardPage;
    },
  },
];

export const RemovedDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Removed AMR',
      photoKey: 'RemovedAMR',
    },
    ...RemovedStandardPage,
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
    diversions: ({ state }) => {
      const { meterDetails } = state || {};

      const isAmr = meterDetails?.isAmr;
      const isCorrector = meterDetails?.isCorrector;

      if (isCorrector) {
        return RemovedCorrectorDetails;
      }
      if (isAmr) {
        return RemovedDataLoggerDetails;
      }
      return RemovedStandardPage;
    },
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
