export const ExchangeNavigation = [
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
    return ExchangeStandardPage;
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
export const chatterBoxPage = [
  {
    screen: 'chatterBox',
    diversionsKey: 'chatterBoxDiversion', // Updated
  },
];

// Define chatterBoxDiversion function here
const chatterBoxDiversion = (state) => {
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
};

export const AdditionalMaterialsPage = [
  {
    screen: 'AdditionalMaterials',
    diversionsKey: 'additionalMaterialsDiversion', // Updated
  },
];

// Define additionalMaterialsDiversion function here
const additionalMaterialsDiversion = (state) => {
  const { standards, siteQuestions } = state;
  const { riddorReportable, conformStandard, chatterbox } = standards;
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
export const ExchangeStandardPage = [
  {
    screen: 'StandardPage',
    diversionsKey: 'exchangeStandardDiversion', // Updated
  },
];

// Define exchangeStandardDiversion function here
const exchangeStandardDiversion = (state) => {
  const { standards, siteQuestions } = state;
  const { riddorReportable, conformStandard, chatterbox } = standards;

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

// Standard Page Alternative Flows
export const RiddorReportPage = [
  {
    screen: 'RiddorReportPage',
    diversionsKey: 'riddorReportDiversion', // Updated
  },
];

// Define riddorReportDiversion function here
const riddorReportDiversion = (state) => {
  const { siteQuestions } = state;
  if (siteQuestions.isStandard === false) {
    return SnClientInfoPage;
  } else {
    return CompositeLabelPhoto;
  }
};

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
    screen: 'RemovedItemsphoto',
    params: {
      title: 'Removed Items photo',
      photoKey: 'RemovedItems',
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
  // {
  //   screen: 'GasSafeWarningPage',
  // },
  ...CompositeLabelPhoto,
];

// TODO: Asset Type Selection never uses pageFlow 2
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    params: {
      title: 'Assets being Exchanged',
    },
    diversionsKey: 'assetTypeSelectionDiversion', // Updated
  },
];

// Define assetTypeSelectionDiversion function here
const assetTypeSelectionDiversion = (state) => {
  const { meterDetails } = state || {};
  if (meterDetails?.isMeter) {
    return ExistingMeterDetails;
  } else if (meterDetails?.isCorrector) {
    return ExistingCorrectorDetails;
  } else if (meterDetails?.isAmr) {
    return ExistingDataLoggerDetails;
  }
};

export const ExistingMeterDetails = [
  {
    screen: 'MeterDetails',
    params: {
      title: 'Existing Meter Details',
    },
    diversionsKey: 'existingMeterDetailsDiversion', // Updated
  },
];

// Define existingMeterDetailsDiversion function here
const existingMeterDetailsDiversion = (state) => {
  const { meterDetails } = state || {};
  const Type = meterDetails?.meterType.value;

  if (!['1', '2', '4', '7'].includes(Type)) {
    return ExistingMeterDataBadge;
  } else {
    return ExistingMeterIndex;
  }
};

export const InstalledMeterDetails = [
  {
    screen: 'MeterDetailsTwo',
    params: {
      title: 'Installed Meter Details',
    },
  },
  {
    screen: 'EcvPhoto',
    params: {
      title: 'ECV to MOV photo',
      photoKey: 'ecvToMovPhoto',
    },
    diversionsKey: 'installedMeterDetailsDiversion', // Updated
  },
];

// Define installedMeterDetailsDiversion function here
const installedMeterDetailsDiversion = (state) => {
  const { meterDetails } = state || {};
  const Type = meterDetails?.meterType.value;

  if (!['1', '2', '4', '7'].includes(Type)) {
    return InstalledMeterDataBadge;
  } else {
    return InstalledMeterIndex;
  }
};

export const InstalledCorrectorDetails = [
  {
    screen: 'CorrectorDetailsTwo',
    params: {
      title: 'Installed Corrector Details',
      photoKey: 'InstalledCorrector',
    },
    diversionsKey: 'installedCorrectorDetailsDiversion', // Updated
  },
];

// Define installedCorrectorDetailsDiversion function here
const installedCorrectorDetailsDiversion = (state) => {
  const { meterDetails } = state || {};
  const { pressureTier, isAmr, isMeter } = meterDetails || {};

  console.log('Meter Details:', meterDetails);

  if (isAmr) {
    console.log('Diverting to InstalledDataLoggerDetails');
    return InstalledDataLoggerDetails;
  }

  if (isMeter) {
    if (pressureTier === 'LP' || pressureTier?.label === 'LP') {
      console.log('Diverting to RegulatorPage');
      return RegulatorPage;
    } else {
      console.log('Diverting to ExchangeStreamsSetSealDetailsPage');
      return ExchangeStreamsSetSealDetailsPage;
    }
  }

  if (!isMeter && !isAmr) {
    console.log('Diverting to StandardsPage');
    return ExchangeStandardPage;
  }
};

export const InstalledDataLoggerDetails = [
  {
    screen: 'DataLoggerDetailsTwo',
    params: {
      title: 'Installed AMR',
      photoKey: 'InstalledAMR',
    },
    diversionsKey: 'installedDataLoggerDetailsDiversion', // Updated
  },
];

// Define installedDataLoggerDetailsDiversion function here
const installedDataLoggerDetailsDiversion = (state) => {
  const { meterDetails } = state || {};

  const pressureTier = meterDetails?.pressureTier?.label;

  const isMeter = meterDetails?.isMeter;

  if (isMeter) {
    if (pressureTier === 'LP') {
      return RegulatorPage;
    } else {
      return ExchangeStreamsSetSealDetailsPage;
    }
  }
  return ExchangeStandardPage;
};

export const InstalledMeterIndex = [
  {
    screen: 'MeterIndex',
    params: {
      title: 'Installed Meter index',
      photoKey: 'InstalledMeterIndex',
    },
  },
  {
    screen: 'MeterPhoto',
    params: {
      title: 'Installed Meter Photo',
      photoKey: 'InstalledMeterPhoto',
    },
    diversionsKey: 'installedMeterIndexDiversion', // Updated
  },
];

// Define installedMeterIndexDiversion function here
const installedMeterIndexDiversion = (state) => {
  const { meterDetails } = state || {};
  const isMeter = meterDetails?.isMeter;
  const isAmr = meterDetails?.isAmr;
  const isCorrector = meterDetails?.isCorrector;
  const pressureTier = meterDetails?.pressureTier?.label;

  console.log('isMeter:', isMeter);
  console.log('isAmr:', isAmr);
  console.log('isCorrector:', isCorrector);
  console.log('pressureTier:', pressureTier);

  if (isCorrector) {
    console.log('Diverting to InstalledCorrectorDetails');
    return InstalledCorrectorDetails;
  }

  if (isAmr) {
    console.log('Diverting to InstalledDataLoggerDetails');
    return InstalledDataLoggerDetails;
  }

  if (isMeter) {
    console.log('isMeter is true');
    if (pressureTier === 'LP') {
      console.log('Diverting to RegulatorPage');
      return RegulatorPage;
    }
    console.log("pressureTier is not 'LP', continuing...");
  }

  console.log('Diverting to ExchangeStreamsSetSealDetailsPage');
  return ExchangeStreamsSetSealDetailsPage;
};

export const InstalledMeterDataBadge = [
  {
    screen: 'ExistingMeterDataBadge',
    params: {
      title: 'Installed Meter data badge',
      photoKey: 'InstalledMeterDataBadge',
    },
  },
  ...InstalledMeterIndex,
];

export const ExistingMeterIndex = [
  {
    screen: 'ExistingMeterIndex',
    params: {
      title: 'Existing Meter index',
      photoKey: 'ExistingMeterIndex',
    },
  },
  {
    screen: 'ExistingMeterPhoto',
    params: {
      title: 'Existing Meter Photo',
      photoKey: 'ExistingMeterPhoto',
    },
  },
  {
    screen: 'ExistingEcvPhoto',
    params: {
      title: 'Ecv Photo',
      photoKey: 'EcvPhoto',
    },
    diversionsKey: 'existingMeterIndexDiversion', // Updated
  },
];

// Define existingMeterIndexDiversion function here
const existingMeterIndexDiversion = (state) => {
  const { meterDetails } = state || {};

  const isAmr = meterDetails?.isAmr;
  const isCorrector = meterDetails?.isCorrector;

  if (isCorrector) {
    return ExistingCorrectorDetails;
  }
  if (isAmr) {
    return ExistingDataLoggerDetails;
  }
  return InstalledMeterDetails;
};

export const ExistingMeterDataBadge = [
  {
    screen: 'MeterDataBadge',
    params: {
      title: 'Existing Meter data badge',
      photoKey: 'ExistingMeterDataBadge',
    },
  },
  ...ExistingMeterIndex,
];

export const ExistingDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Existing DataLogger Details',
    },
    diversionsKey: 'existingDataLoggerDetailsDiversion', // Updated
  },
];

// Define existingDataLoggerDetailsDiversion function here
const existingDataLoggerDetailsDiversion = (state) => {
  const { meterDetails } = state || {};
  if (meterDetails?.isMeter) {
    return InstalledMeterDetails;
  }
  if (meterDetails?.isCorrector) {
    return InstalledCorrectorDetails;
  }
  return InstalledDataLoggerDetails;
};

export const ExistingCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Existing Corrector Details',
    },
    diversionsKey: 'existingCorrectorDetailsDiversion', // Updated
  },
];

// Define existingCorrectorDetailsDiversion function here
const existingCorrectorDetailsDiversion = (state) => {
  const { meterDetails } = state;

  if (meterDetails?.isAmr) {
    return ExistingDataLoggerDetails;
  }
  if (meterDetails.isMeter) {
    return InstalledMeterDetails;
  }

  return InstalledCorrectorDetails;
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

export const ExchangeStreamsSetSealDetailsPage = [
  {
    screen: 'StreamsSetSealDetails',
    params: {
      title: 'Streams Set Seal Details',
    },
    diversionsKey: 'exchangeStreamsSetSealDetailsDiversion', // Updated
  },
];

// Define exchangeStreamsSetSealDetailsDiversion function here
const exchangeStreamsSetSealDetailsDiversion = (state) => {
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

  ...ExchangeStandardPage,
];

// Export all diversion functions in an object
export const exchangeDiversions = {
  siteQuestionsDiversion,
  chatterBoxDiversion,
  additionalMaterialsDiversion,
  exchangeStandardDiversion,
  riddorReportDiversion,
  assetTypeSelectionDiversion,
  existingMeterDetailsDiversion,
  installedMeterDetailsDiversion,
  installedCorrectorDetailsDiversion,
  installedDataLoggerDetailsDiversion,
  installedMeterIndexDiversion,
  existingMeterIndexDiversion,
  existingDataLoggerDetailsDiversion,
  existingCorrectorDetailsDiversion,
  exchangeStreamsSetSealDetailsDiversion,
};
