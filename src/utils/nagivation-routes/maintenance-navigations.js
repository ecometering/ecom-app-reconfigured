export const MaintenanceNavigation = [
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
    return MaintenanceStandardPage;
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

export const MaintenanceExistingMeterIndex = [
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
    diversionsKey: 'maintenanceExistingMeterIndexDiversion', // Updated
  },
];

// Define maintenanceExistingMeterIndexDiversion function here
const maintenanceExistingMeterIndexDiversion = (state) => {
  const { meterDetails,siteQuestions } = state || {};
  const { pressureTier } = meterDetails || {};
  const isCorrector = siteQuestions?.isCorrector;
  const isAmr = siteQuestions?.isAmr;
  const isMeter = siteQuestions?.isMeter;
  if (isCorrector) {
    return MaintenanceExistingCorrectorDetails;
  }
  if (isAmr) {
    return MaintenanceExistingDataLoggerDetails;
  }
  if (isMeter) {
    if (pressureTier === 'LP' || pressureTier?.label === 'LP') {
      return RegulatorPage;
    }
  }

  return StreamsSetSealDetailsPage;
};

export const MaintenanceExistingMeterDataBadge = [
  {
    screen: 'MeterDataBadge',
    params: {
      title: 'Existing Meter data badge',
      photoKey: 'ExistingMeterDataBadge',
    },
  },
  ...MaintenanceExistingMeterIndex,
];

// Site Questions Alternative Flows
export const MaintenanceStandardPage = [
  {
    screen: 'StandardPage',
    diversionsKey: 'maintenanceStandardPageDiversion', // Updated
  },
];

// Define maintenanceStandardPageDiversion function here
const maintenanceStandardPageDiversion = (state) => {
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
    params: {
      title: 'Assets maintenance required',
    },
    diversionsKey: 'assetTypeSelectionDiversion', // Updated
  },
];

// Define assetTypeSelectionDiversion function here
const assetTypeSelectionDiversion = (state) => {
  const { siteQuestions } = state || {};

  if (siteQuestions?.isMeter) {
    return MaintenanceExistingMeterDetails;
  } else if (siteQuestions?.isCorrector) {
    return MaintenanceExistingCorrectorDetails;
  } else if (siteQuestions?.isAmr) {
    return MaintenanceExistingDataLoggerDetails;
  }
};

export const MaintenanceExistingMeterDetails = [
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
    diversionsKey: 'maintenanceExistingMeterDetailsDiversion', // Updated
  },
];

// Define maintenanceExistingMeterDetailsDiversion function here
const maintenanceExistingMeterDetailsDiversion = (state) => {
  const { meterDetails } = state || {};

  const Type = meterDetails?.meterType.value;

  if (!['1', '2', '4', '7'].includes(Type)) {
    return MaintenanceExistingMeterDataBadge;
  } else {
    return MaintenanceExistingMeterIndex;
  }
};

export const MaintenanceExistingCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Existing Corrector installed',
    },
    diversionsKey: 'maintenanceExistingCorrectorDetailsDiversion', // Updated
  },
];

// Define maintenanceExistingCorrectorDetailsDiversion function here
const maintenanceExistingCorrectorDetailsDiversion = (state) => {
  const { meterDetails,siteQuestions } = state || {};
  const { pressureTier } = meterDetails || {};

  const isAmr = siteQuestions?.isAmr;
  const isMeter = siteQuestions?.isMeter;

  if (isAmr) {
    return MaintenanceExistingDataLoggerDetails;
  }
  if (isMeter) {
    if (pressureTier === 'LP' || pressureTier?.label === 'LP') {
      return RegulatorPage;
    } else {
      return StreamsSetSealDetailsPage;
    }
  }
  return MaintenanceQuestionsPage;
};

export const MaintenanceExistingDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Existing AMR installed',
    },
    diversionsKey: 'maintenanceExistingDataLoggerDetailsDiversion', // Updated
  },
];

// Define maintenanceExistingDataLoggerDetailsDiversion function here
const maintenanceExistingDataLoggerDetailsDiversion = (state) => {
  const { meterDetails,siteQuestions } = state || {};
  const pressureTier = meterDetails?.pressureTier?.label;
  const isMeter = siteQuestions?.isMeter;

  if (isMeter) {
    if (pressureTier === 'LP') {
      return MaintenanceQuestionsPage;
    } else {
      return StreamsSetSealDetailsPage;
    }
  }

  return MaintenanceQuestionsPage;
};

export const InstancesForStreamFlow = (state) => {
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
  return [...streamFlows, ...MaintenanceQuestionsPage];
};

export const MaintenanceQuestionsPage = [
  {
    screen: 'MaintenanceQuestions',
  },
  {
    screen: 'Regulator',
  },
  {
    screen: 'RegulatorPhotoPage',
    params: {
      title: 'Existing Regulator photo',
      photoKey: 'RegulatorPhotoPage',
    },
  },
  ...MaintenanceStandardPage,
];

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
export const maintenanceDiversions = {
  siteQuestionsDiversion,
  chatterBoxDiversion,
  additionalMaterialsDiversion,
  maintenanceExistingMeterIndexDiversion,
  maintenanceStandardPageDiversion,
  riddorReportDiversion,
  assetTypeSelectionDiversion,
  maintenanceExistingMeterDetailsDiversion,
  maintenanceExistingCorrectorDetailsDiversion,
  maintenanceExistingDataLoggerDetailsDiversion,
  streamsSetSealDetailsDiversion,
  standardPageDiversion,
};
