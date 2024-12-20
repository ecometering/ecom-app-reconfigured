// InstallNavigation configuration
export const InstallNavigation = [
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
  const { siteQuestions } = state || {};
  if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
    return StandardPage;
  } else if (!siteQuestions?.isCarryOut) {
    return AbortPage;
  } else {
    return AssetTypeSelectionPage;
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
    photoKey: 'extraPhotos_0',
    title: 'Extra Photos ',
  }
) => [
  {
    screen: 'ExtraPhotoPage',
    params,
  },
];

export const chatterBoxPage = [
  {
    screen: 'ChatterBox',
    params: {
      title: 'Installed chatter box',
      photoKey: 'InstalledChatterBox',
    },
    diversionsKey: 'chatterBoxDiversion', // Updated
  },
];

// Define chatterBoxDiversion function here
const chatterBoxDiversion = (state) => {
  const { standards, siteQuestions } = state;
  const { riddorReportable } = standards;
  if (riddorReportable) {
    return RiddorReportPage;
  } else {
    if (!siteQuestions.isStandard) {
      return SnClientInfoPage;
    } else {
      return CompositeLabelPhoto;
    }
  }
};

export const AdditionalMaterialsPage = [
  {
    screen: 'AdditionalMaterial',
    diversionsKey: 'additionalMaterialsDiversion', // Updated
  },
];

// Define additionalMaterialsDiversion function here
const additionalMaterialsDiversion = (state) => {
  const { standards, siteQuestions } = state;
  const { riddorReportable, chatterbox } = standards;
  if (chatterbox === true) {
    return chatterBoxPage;
  } else {
    if (riddorReportable === true) {
      return RiddorReportPage;
    } else {
      if (!siteQuestions.isStandard) {
        return SnClientInfoPage;
      } else {
        return CompositeLabelPhoto;
      }
    }
  }
};

// Site Questions Alternative Flows
export const StandardPage = [
  {
    screen: 'StandardPage',
    diversionsKey: 'standardPageDiversion', // Updated
  },
];

// Define standardPageDiversion function here
const standardPageDiversion = (state) => {
  const { standards, siteQuestions } = state;
  const { riddorReportable, chatterbox } = standards;

  if (chatterbox === true) {
    return chatterBoxPage;
  } else {
    if (riddorReportable === true) {
      return RiddorReportPage;
    } else {
      if (!siteQuestions.isStandard) {
        return SnClientInfoPage;
      } else {
        return CompositeLabelPhoto;
      }
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

// navigation.navigate('JobTypeNavigator'); i dont know what this suposed to do

// Standard Page Alternative Flows
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

// Riddor Report Alternative Flows
// alternates between:
// SnClientInfoPage
// CompositeLabelPhoto

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
    params: {
      title: 'Gas warning photo',
      photoKey: 'gasWarning',
    },
  },

  ...CompositeLabelPhoto,
];

// AssetTypeSelectionPage
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    params: {
      title: 'Assets being Installed',
    },
    diversionsKey: 'assetTypeSelectionDiversion', // Updated
  },
];

// Define assetTypeSelectionDiversion function here
const assetTypeSelectionDiversion = (state) => {
  const { siteQuestions } = state || {};
  if (siteQuestions?.isMeter) {
    return MeterDetailsPage;
  } else if (siteQuestions?.isCorrector) {
    return CorrectorDetailsPage;
  } else if (siteQuestions?.isAmr) {
    return DataLoggerDetailsPage;
  }
};

// AssetTypeSelectionPage Alternative Flows
export const MeterDetailsPage = [
  {
    screen: 'MeterDetails',
    params: {
      title: 'New Meter Details',
    },
  },
  {
    screen: 'EcvPhoto',
    params: {
      title: 'New ECV to MOV',
      photoKey: 'NewEcvToMov',
    },
    diversionsKey: 'ecvPhotoDiversion', // Updated
  },
];

// Define ecvPhotoDiversion function here
const ecvPhotoDiversion = (state) => {
  const { meterDetails } = state || {};
  const Type = meterDetails?.meterType.value;

  if (!['1', '2', '4', '7'].includes(Type)) {
    return MeterDataBadgePage;
  } else {
    return MeterIndexPage;
  }
};

export const CorrectorDetailsPage = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'New Corrector installed',
      photoKey: 'installedCorrector',
    },
    diversionsKey: 'correctorDetailsDiversion', // Updated
  },
];

// Define correctorDetailsDiversion function here
const correctorDetailsDiversion = (state) => {
  const { meterDetails, siteQuestions } = state || {};
  const { pressureTier } = meterDetails || {};
  const isAmr = siteQuestions?.isAmr;
  const isMeter = siteQuestions?.isMeter;
  if (isAmr) {
    return DataLoggerDetailsPage;
  }

  if (isMeter) {
    if (pressureTier === 'LP' || pressureTier?.label === 'LP') {
      return RegulatorPage;
    } else {
      return StreamsSetSealDetailsPage;
    }
  }

  if (!isMeter && !isAmr) {
    return StandardPage;
  }
};

export const DataLoggerDetailsPage = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'New AMR installed',
      photoKey: 'installedAMR',
    },
    diversionsKey: 'dataLoggerDiversion', // Updated
  },
];

// Define dataLoggerDiversion function here
const dataLoggerDiversion = (state) => {
  const { meterDetails, siteQuestions } = state || {};

  const pressureTier = meterDetails?.pressureTier?.label;
  const isMeter = siteQuestions?.isMeter;

  if (isMeter) {
    if (pressureTier === 'LP') {
      return RegulatorPage;
    } else {
      return StreamsSetSealDetailsPage;
    }
  }
  return StandardPage;
};

// siteQuestions Alternative Flows
export const MeterIndexPage = [
  {
    screen: 'MeterIndex',
    params: {
      title: 'New Meter index',
      photoKey: 'MeterIndex',
    },
  },
  {
    screen: 'MeterPhoto',
    params: {
      title: 'New Meter photo',
      photoKey: 'NewMeterPhoto',
    },
    diversionsKey: 'meterPhotoDiversion', // Updated
  },
];

// Define meterPhotoDiversion function here
const meterPhotoDiversion = (state) => {
  const { meterDetails, siteQuestions } = state || {};
  const isMeter = siteQuestions?.isMeter;
  const isAmr = siteQuestions?.isAmr;
  const isCorrector = siteQuestions?.isCorrector;
  const pressureTier = meterDetails?.pressureTier?.label;

  if (isCorrector) {
    return CorrectorDetailsPage;
  }
  if (isAmr) {
    return DataLoggerDetailsPage;
  }
  if (isMeter) {
    if (pressureTier === 'LP' || pressureTier?.label === 'LP') {
      return RegulatorPage;
    }
  }
  return StreamsSetSealDetailsPage;
};

export const MeterDataBadgePage = [
  {
    screen: 'MeterDataBadge',
    params: {
      title: 'New Meter data badge',
      photoKey: 'MeterDataBadge',
    },
  },
  ...MeterIndexPage,
];

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

export const StreamsSetSealDetailsPage = [
  {
    screen: 'StreamsSetSealDetails',
    params: {
      title: 'Streams Set Seal Details',
    },
    diversionsKey: 'streamsSetSealDetailsDiversion', // Updated
  },
];

// Define streamsSetSealDetailsDiversion function here
const streamsSetSealDetailsDiversion = (state) => {
  const streamFlows = InstancesForStreamFlow(state);
  return [...streamFlows, ...RegulatorPage];
};

export const RegulatorPage = [
  {
    screen: 'Regulator',
  },
  {
    screen: 'RegulatorPhotoPage',
    params: {
      title: 'New Regulator photo',
      photoKey: 'RegulatorPhotoPage',
    },
  },

  ...StandardPage,
];

// Export all diversion functions in an object
export const installDiversions = {
  siteQuestionsDiversion,
  chatterBoxDiversion,
  additionalMaterialsDiversion,
  standardPageDiversion,
  riddorReportDiversion,
  assetTypeSelectionDiversion,
  ecvPhotoDiversion,
  correctorDetailsDiversion,
  dataLoggerDiversion,
  meterPhotoDiversion,
  streamsSetSealDetailsDiversion,
};
