export const SurveyNavigation = [
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
        return SurveyStandardPage;
      } else if (!siteQuestions?.isCarryOut) {
        return RebookPage;
      } else {
        return SurveyQuestions;
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
  {
    screen: 'SiteDrawingPhoto',
    params: {
      title: 'Site Survey Drawing ',
      photoKey: 'siteDrawing',
    },
  },
  ...ExtraPhotoPageRoute(),
  ...SubmitSuccessPage,
];

export const RiddorReportPage = [
  {
    screen: 'RiddorReportPage',
    diversions: ({ state }) => {
      const { standardDetails } = state;
      if (standardDetails.conformStandard === false) {
        return SnClientInfoPage;
      } else {
        return CompositeLabelPhoto;
      }
    },
  },
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

// Site Questions Alternative Flows
export const SurveyStandardPage = [
  {
    screen: 'StandardPage',
    diversions: ({ state }) => {
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

export const RebookPage = [
  {
    screen: 'RebookPage',
  },
  ...SubmitSuccessPage,
];

// AssetTypeSelectionPage
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      if (meterDetails?.isMeter) {
        return SurveyExistingMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return SurveyExistingCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return SurveyExistingDataLoggerDetails;
      }
    },
  },
];

export const SurveyExistingMeterDetails = [
  {
    screen: 'MeterDetails',
    params: {
      title: 'Existing Meter Details',
    },
  },
  {
    screen: 'ExistingEcvPhoto',
    params: {
      title: 'Existing ECV to MOV',
      photoKey: 'ExistingEcvToMov',
    },
    diversions: ({ state }) => {
      const { meterDetails } = state || {};

      const Type = meterDetails?.meterType.value;

      if (!['1', '2', '4'].includes(Type)) {
        return SurveyExistingMeterDataBadge;
      } else {
        return SurveyExistingMeterIndex;
      }
    },
  },
];

export const SurveyExistingCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Existing Corrector installed',
    },
    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      const { pressureTier } = meterDetails || {};

      const isAmr = meterDetails?.isAmr;
      const isMeter = meterDetails?.isMeter;

      if (isAmr) {
        return SurveyExistingDataLoggerDetails;
      }

      if (isMeter) {
        if (pressureTier === 'LP' || pressureTier?.label === 'LP') {
          return SurveyStandardPage;
        } else {
          return SurveyStreamsSetSealDetailsPage;
        }
      }

      return SurveyStandardPage;
    },
  },
];

export const SurveyExistingDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Existing AMR installed',
    },
    diversions: ({ state }) => {
      const { meterDetails } = state || {};

      const pressureTier = meterDetails?.pressureTier?.label;
      const isMeter = meterDetails?.isMeter;

      if (isMeter) {
        if (pressureTier === 'LP') {
          return SurveyStandardPage;
        } else {
          return SurveyStreamsSetSealDetailsPage;
        }
      }

      return SurveyStandardPage;
    },
  },
];

export const InstancesForStreamFlow = ({ state }) => {
  // TODO: sort context switch
  // Redux might be a better option
  const { streamNumber } = state || {};

  return Array.from({ length: streamNumber }, (_, index) => index + 1).reduce(
    (acc, stream) => {
      return [
        ...acc,
        {
          screen: 'StreamFilterPage',
          params: {
            title: `Filter Page ${stream}`,
            stream: stream,
            photoKey: `Filter${stream}Photo`,
          },
        },
        {
          screen: 'StreamSlamshutPage',
          params: {
            title: `Slamshut Page ${stream}`,
            photoKey: `SlamShut${stream}Photo`,
          },
        },
        {
          screen: 'StreamActiveRegulatorPage',
          params: {
            title: `Active Regulator Page ${stream}`,
            photoKey: `ActiveRegulator${stream}Photo`,
          },
        },
        {
          screen: 'StreamReliefRegulatorPage',
          params: {
            title: `Relief Regulator Page ${stream}`,
            photoKey: `ReliefRegulator${stream}Photo`,
          },
        },
        {
          screen: 'StreamWaferCheckPage',
          params: {
            title: `Wafer Check Page ${stream}`,
            photoKey: `WaferCheck${stream}Photo`,
          },
        },
      ];
    },
    []
  );
};

export const SurveyStreamsSetSealDetailsPage = [
  {
    screen: 'StreamsSetSealDetails',
    params: {
      title: 'Streams Set Seal Details',
    },
    diversions: ({ state }) => {
      const streamFlows = InstancesForStreamFlow({ state });
      return [...streamFlows, ...SurveyStandardPage];
    },
  },
];

export const SurveyExistingMeterIndex = [
  {
    screen: 'MeterIndex',
    params: {
      title: 'Existing Meter index',
      photoKey: 'ExistingMeterIndex',
    },
  },
  {
    screen: 'MeterPhoto',
    params: {
      title: 'Existing Meter Photo',
      photoKey: 'ExistingMeterPhoto',
    },

    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      const { pressureTier } = meterDetails || {};
      const isCorrector = meterDetails?.isCorrector;
      const isAmr = meterDetails?.isAmr;
      const isMeter = meterDetails?.isMeter;

      if (isCorrector) {
        return SurveyExistingCorrectorDetails;
      }

      if (isAmr) {
        return SurveyExistingDataLoggerDetails;
      }

      if (isMeter) {
        if (pressureTier === 'LP' || pressureTier?.label === 'LP') {
          return SurveyStandardPage;
        }
      }

      return SurveyStreamsSetSealDetailsPage;
    },
  },
];

export const SurveyExistingMeterDataBadge = [
  {
    screen: 'MeterDataBadge',
    params: {
      title: 'Existing Meter data badge',
      photoKey: 'ExistingMeterDataBadge',
    },
  },
  ...SurveyExistingMeterIndex,
];
export const SurveyQuestions = [
  {
    screen: 'KioskPage',
    params: {
      title: 'Kiosk Details',
    },
  },
  {
    screen: 'EcvPage',
    params: {
      title: 'ECV details',
    },
  },
  {
    screen: 'MovPage',
    params: {
      title: 'MOV details',
    },
  },
  // {
  //   screen: 'VentsPage',
  //   params: {
  //     title: 'Vents details',
  //   },
  // },
  ...AssetTypeSelectionPage,
];
