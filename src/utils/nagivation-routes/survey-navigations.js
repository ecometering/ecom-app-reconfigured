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
    diversionsKey: 'siteQuestionsDiversion', // Updated
  },
];

// Define siteQuestionsDiversion function here
const siteQuestionsDiversion = (state) => {
  const { siteQuestions } = state;
  if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
    return SurveyStandardPage;
  } else if (!siteQuestions?.isCarryOut) {
    return AbortPage;
  } else {
    return SurveyQuestions;
  }
};

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

export const RiddorReportPage = [
  {
    screen: 'RiddorReportPage',
    params: {
      title: 'Riddor Report',
      photoKey: 'RiddorReport',
    },
    diversionsKey: 'riddorReportDiversion', // Updated
  },
];

// Define riddorReportDiversion function here
const riddorReportDiversion = (state) => {
  const { siteQuestions } = state;
  if (!siteQuestions.isStandard) {
    return SnClientInfoPage;
  } else {
    return CompositeLabelPhoto;
  }
};

export const SnClientInfoPage = [
  {
    screen: 'SnClientInfoPage',
    params: {
      title: 'Gas warning photo',
      photoKey: 'gasWarning',
    },
  },
  ...CompositeLabelPhoto,
];

// Site Questions Alternative Flows
export const SurveyStandardPage = [
  {
    screen: 'StandardPage',
    diversionsKey: 'surveyStandardPageDiversion', // Updated
  },
];

// Define surveyStandardPageDiversion function here
const surveyStandardPageDiversion = (state) => {
  const { standards, siteQuestions } = state;
  const { riddorReportable, conformStandard } = standards;
  if (riddorReportable === true) {
    return RiddorReportPage;
  } else {
    if (!siteQuestions.isStandard) {
      return SnClientInfoPage;
    } else {
      return CompositeLabelPhoto;
    }
  }
};

export const AbortPage = [
  {
    screen: 'AbortPage',
    params: {
      photoKey: 'AbortReason',
      title: 'Job abort reason',
    },
  },
  ...SubmitSuccessPage,
];

// AssetTypeSelectionPage
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    diversionsKey: 'assetTypeSelectionDiversion',
    params:{
      title: 'Existing assets',
    },
     
  },
];

// Define assetTypeSelectionDiversion function here
const assetTypeSelectionDiversion = (state) => {
  const { siteQuestions } = state || {};
  if (siteQuestions?.isMeter) {
    return SurveyExistingMeterDetails;
  } else if (siteQuestions?.isCorrector) {
    return SurveyExistingCorrectorDetails;
  } else if (siteQuestions?.isAmr) {
    return SurveyExistingDataLoggerDetails;
  }
};

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
    diversionsKey: 'surveyExistingMeterDetailsDiversion', // Updated
  },
];

// Define surveyExistingMeterDetailsDiversion function here
const surveyExistingMeterDetailsDiversion = (state) => {
  const { meterDetails } = state || {};
  const Type = meterDetails?.meterType.value;

  if (!['1', '2', '4', '7'].includes(Type)) {
    return SurveyExistingMeterDataBadge;
  } else {
    return SurveyExistingMeterIndex;
  }
};

export const SurveyExistingCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Existing Corrector installed',
    },
    diversionsKey: 'surveyExistingCorrectorDetailsDiversion', // Updated
  },
];

// Define surveyExistingCorrectorDetailsDiversion function here
const surveyExistingCorrectorDetailsDiversion = (state) => {
  const { meterDetails,siteQuestions } = state || {};
  const { pressureTier } = meterDetails || {};

  const isAmr = siteQuestions?.isAmr;
  const isMeter = siteQuestions?.isMeter;

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
};

export const SurveyExistingDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Existing AMR installed',
    },
    diversionsKey: 'surveyExistingDataLoggerDetailsDiversion', // Updated
  },
];

// Define surveyExistingDataLoggerDetailsDiversion function here
const surveyExistingDataLoggerDetailsDiversion = (state) => {
  const { meterDetails,siteQuestions } = state || {};
  const pressureTier = meterDetails?.pressureTier?.label;
  const isMeter = siteQuestions?.isMeter;

  if (isMeter) {
    if (pressureTier === 'LP') {
      return SurveyStandardPage;
    } else {
      return SurveyStreamsSetSealDetailsPage;
    }
  }

  return SurveyStandardPage;
};

export const InstancesForStreamFlow = (state) => {
  // TODO: sort context switch
  // Redux might be a better option
  const { streams } = state || {};

  return Array.from({ length: streams.Number }, (_, index) => index + 1).reduce(
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
            stream: stream,
            photoKey: `SlamShut${stream}Photo`,
          },
        },
        {
          screen: 'StreamActiveRegulatorPage',
          params: {
            title: `Active Regulator Page ${stream}`,
            stream: stream,
            photoKey: `ActiveRegulator${stream}Photo`,
          },
        },
        {
          screen: 'StreamReliefRegulatorPage',
          params: {
            title: `Relief Regulator Page ${stream}`,
            stream: stream,
            photoKey: `ReliefRegulator${stream}Photo`,
          },
        },
        {
          screen: 'StreamWaferCheckPage',
          params: {
            title: `Wafer Check Page ${stream}`,
            stream: stream,
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
    diversionsKey: 'surveyStreamsSetSealDetailsPageDiversion', // Updated
  },
];

// Define surveyStreamsSetSealDetailsPageDiversion function here
const surveyStreamsSetSealDetailsPageDiversion = (state) => {
  const streamFlows = InstancesForStreamFlow(state);
  return [...streamFlows, ...SurveyStandardPage];
};

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
    diversionsKey: 'surveyExistingMeterIndexDiversion', // Updated
  },
];

// Define surveyExistingMeterIndexDiversion function here
const surveyExistingMeterIndexDiversion = (state) => {
  const { meterDetails,siteQuestions } = state || {};
  const { pressureTier } = meterDetails || {};
  const isCorrector = siteQuestions?.isCorrector;
  const isAmr = siteQuestions?.isAmr;
  const isMeter = siteQuestions?.isMeter;

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
};

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

// Export all diversion functions in an object
export const surveyDiversions = {
  siteQuestionsDiversion,
  riddorReportDiversion,
  surveyStandardPageDiversion,
  assetTypeSelectionDiversion,
  surveyExistingMeterDetailsDiversion,
  surveyExistingCorrectorDetailsDiversion,
  surveyExistingDataLoggerDetailsDiversion,
  surveyStreamsSetSealDetailsPageDiversion,
  surveyExistingMeterIndexDiversion,
};
