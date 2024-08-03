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
    diversionsKey: 'sitePhotoPageDiversion', // Updated
  },
];

// Define sitePhotoPageDiversion function here
const sitePhotoPageDiversion = (state) => {
  const { siteDetails } = state;
  if (siteDetails?.confirmWarrant) {
    return SiteQuestionsPage;
  } else {
    return SubmitSuccessPage;
  }
};

export const SiteQuestionsPage = [
  {
    screen: 'SiteQuestionsPage',
    params: {
      title: 'Site Questions',
      photoKey: 'bypassPhoto',
    },
    diversionsKey: 'siteQuestionsPageDiversion', // Updated
  },
];

// Define siteQuestionsPageDiversion function here
const siteQuestionsPageDiversion = (state) => {
  const { siteQuestions } = state;
  if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
    return WarrantStandardPage;
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
  ...CompositeLabelPhoto,
];

// Standard Page Alternative Flows
export const RiddorReportPage = [
  {
    screen: 'RiddorReportPage',
    params: {
      title: 'Riddor Report',
    },
    diversionsKey: 'riddorReportPageDiversion', // Updated
  },
];

// Define riddorReportPageDiversion function here
const riddorReportPageDiversion = (state) => {
  const { siteQuestions } = state;
  if (!siteQuestions.isStandard) {
    return SnClientInfoPage;
  } else {
    return CompositeLabelPhoto;
  }
};

// AssetTypeSelectionPage
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    params: {
      title: 'Assets being removed',
    },
    diversionsKey: 'assetTypeSelectionPageDiversion', // Updated
  },
];

// Define assetTypeSelectionPageDiversion function here
const assetTypeSelectionPageDiversion = (state) => {
  const { meterDetails } = state || {};
  if (meterDetails?.isMeter) {
    return RemovedMeterDetails;
  } else if (meterDetails?.isCorrector) {
    return RemovedCorrectorDetails;
  } else if (meterDetails?.isAmr) {
    return RemovedDataLoggerDetails;
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

// Site Questions Alternative Flows
export const chatterBoxPage = [
  {
    screen: 'chatterBox',
    diversionsKey: 'chatterBoxPageDiversion', // Updated
  },
];

// Define chatterBoxPageDiversion function here
const chatterBoxPageDiversion = (state) => {
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

export const AdditionalMaterialsPage = [
  {
    screen: 'AdditionalMaterials',
    diversionsKey: 'additionalMaterialsPageDiversion', // Updated
  },
];

// Define additionalMaterialsPageDiversion function here
const additionalMaterialsPageDiversion = (state) => {
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
};

// Site Questions Alternative Flows
export const RemovedStandardPage = [
  {
    screen: 'StandardPage',
    diversionsKey: 'removedStandardPageDiversion', // Updated
  },
];

// Define removedStandardPageDiversion function here
const removedStandardPageDiversion = (state) => {
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

export const RemovedMeterDetails = [
  {
    screen: 'MeterDetails',
    params: {
      title: 'Removed Meter Details',
    },
    diversionsKey: 'removedMeterDetailsDiversion', // Updated
  },
];

// Define removedMeterDetailsDiversion function here
const removedMeterDetailsDiversion = (state) => {
  const { meterDetails } = state || {};
  const Type = meterDetails?.meterType.value;

  if (!['1', '2', '4', '7'].includes(Type)) {
    return RemovedMeterDataBadge;
  } else {
    return RemovedMeterIndex;
  }
};

export const RemovedCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Removed Corrector Details',
      photoKey: 'removedCorrector',
    },
    diversionsKey: 'removedCorrectorDetailsDiversion', // Updated
  },
];

// Define removedCorrectorDetailsDiversion function here
const removedCorrectorDetailsDiversion = (state) => {
  const { meterDetails } = state;

  if (meterDetails?.isAmr) {
    return RemovedDataLoggerDetails;
  }
  return RemovedStandardPage;
};

export const RemovedDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Removed AMR',
      photoKey: 'RemovedAMR',
    },
    diversionsKey: 'removedDataLoggerDetailsDiversion', // Updated
  },
];

// Define removedDataLoggerDetailsDiversion function here
const removedDataLoggerDetailsDiversion = () => RemovedStandardPage;

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
    diversionsKey: 'removedMeterIndexDiversion', // Updated
  },
];

// Define removedMeterIndexDiversion function here
const removedMeterIndexDiversion = (state) => {
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
};

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

// Export all diversion functions in an object
export const warrantDiversions = {
  sitePhotoPageDiversion,
  siteQuestionsPageDiversion,
  riddorReportPageDiversion,
  assetTypeSelectionPageDiversion,
  chatterBoxPageDiversion,
  additionalMaterialsPageDiversion,
  removedStandardPageDiversion,
  removedMeterDetailsDiversion,
  removedCorrectorDetailsDiversion,
  removedDataLoggerDetailsDiversion,
  removedMeterIndexDiversion,
};
