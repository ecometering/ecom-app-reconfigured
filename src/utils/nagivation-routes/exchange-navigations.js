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
    diversions: (state) => {
      const { siteQuestions } = state;
      if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
        return ExchangeStandardPage;
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
export const ExchangeStandardPage = [
  {
    screen: 'StandardPage',
    diversions: (state) => {
      const { standardDetails } = state;
      const { riddorReportable, conformStandard,chatterbox,additionalMaterials } = standardDetails;
      if (chatterbox === true) {
        return chatterboxPage}
      else {
        if (additionalMaterials === true) {
          return AdditionalMaterialsPage;
        }
        else{
      if (riddorReportable === true) {
        return RiddorReportPage;
      } else {
        if (conformStandard === false) {
          return SnClientInfoPage;
        } else {
          return CompositeLabelPhoto;
        }
      }}}
    },
  },
];

export const RebookPage = [
  {
    screen: 'RebookPage',
  },
  ...SubmitSuccessPage,
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

// TODO: Asset Type Selection never uses pageFlow 2
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    diversions: (state) => {
      const { meterDetails } = state || {};
      if (meterDetails?.isMeter) {
        return ExistingMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return ExistingCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return ExistingDataLoggerDetails;
      }
    },
  },
];

export const ExistingMeterDetails = [
  {
    screen: 'MeterDetails',
    params: {
      title: 'Existing Meter Details',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};
      const Type = meterDetails?.meterType?.value;
      if (Type === '1' || Type === '2' || Type === '4') {
        return ExistingMeterDataBadge;
      } else {
        return ExistingMeterIndex;
      }
    },
  },
];

export const InstalledMeterDetails = [
  {
    screen: 'MeterDetailsTwo',
    params: {
      title: 'Installed Meter Details',
    },
  },
  {
    screen: 'EcvToMovphoto',
    params: {
      title: 'ECV to MOV photo',
      photoKey: 'ecvToMovPhoto',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};
      const Type = meterDetails?.meterType?.value;
      if (Type === '1' || Type === '2' || Type === '4') {
        return InstalledMeterDataBadge;
      } else {
        return InstalledMeterIndex;
      }
    },
  },
];

export const InstalledCorrectorDetails = [
  {
    screen: 'CorrectorDetailsTwo',
    params: {
      title: 'Installed Corrector Details',
      photoKey: 'removedCorrector',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};
      const { pressureTier } = meterDetails || {};

      const isAmr = meterDetails?.isAmr;
      const isMeter = meterDetails?.isMeter;

      if (isAmr) {
        return InstalledDataLoggerDetails;
      } else if (isMeter) {
        if (
            pressureTier === 'MP') 
         {
          return ExchangeStreamsSetSealDetailsPage;
        }
      } else {
        return RegulatorPage;
      }
    },
  },
];

export const InstalledDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Installed AMR',
      photoKey: 'RemovedAMR',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};

      const pressureTier = meterDetails?.pressureTier?.label;
      const meterType = meterDetails?.meterType;
      const isMeter = meterDetails?.isMeter;

      if (isMeter) {
        if (
          ((meterType.value === '1' ||
            meterType.value === '2' ||
            meterType.value === '4') &&
            pressureTier === 'MP') ||
          (meterType.value !== '1' &&
            meterType.value !== '2' &&
            meterType.value !== '4')
        ) {
          return ExchangeStreamsSetSealDetailsPage;
        }
      } else {
        return ExchangeStandardPage;
      }
    },
  },
];

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
    diversions: (state) => {
      const { meterDetails } = state || {};

      const isAmr = meterDetails?.isAmr;
      const Type = meterDetails?.meterType.value;
      const isCorrector = meterDetails?.isCorrector;
      const pressureTier = meterDetails?.pressureTier.label;

      if (isCorrector) {
        return InstalledCorrectorDetails;
      } else if (isAmr) {
        return InstalledDataLoggerDetails;
        // TODO: isMeter is not defined
      } else if (isMeter) {
        if ( pressureTier === 'MP') {
          return ExchangeStreamsSetSealDetailsPage;
        }
      } else {
        return ExchangeStandardPage;
      }
    },
  },
];

export const InstalledMeterDataBadge = [
  {
    screen: 'MeterDataBadge',
    params: {
      title: 'Installed Meter data badge',
      photoKey: 'InstalledMeterDataBadge',
    },
  },
  ...InstalledMeterIndex,
];

export const ExistingMeterIndex = [
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
  },
  {
    screen: 'EcvPhoto',
    params: {
      title: 'Ecv Photo',
      photoKey: 'EcvPhoto',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};

      const isAmr = meterDetails?.isAmr;

      if (isAmr) {
        return ExistingDataLoggerDetails;
      } else {
        if (meterDetails?.isMeter) {
          return InstalledMeterDetails;
        } else if (meterDetails?.isCorrector) {
          return InstalledCorrectorDetails;
        } else if (meterDetails?.isAmr) {
          return InstalledDataLoggerDetails;
        }
      }
    },
  },
];

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
    diversions: (state) => {
      const { meterDetails } = state || {};
      if (meterDetails?.isMeter) {
        return InstalledMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return InstalledCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return InstalledDataLoggerDetails;
      }
    },
  },
];

export const ExistingCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Existing Corrector Details',
    },
    diversions: (state) => {
      // TODO: check this logic if its correct
      const { meter, corrector, datalogger } = state;

      if (datalogger) {
        return ExistingDataLoggerDetails;
      } else {
        if (meter) return InstalledMeterDetails;
        if (corrector) return InstalledCorrectorDetails;
        if (datalogger) return InstalledDataLoggerDetails;
      }
    },
  },
];

export const InstancesForStreamFlow = ({ state }) => {
  // TODO: sort context switch
  // Redux might be a better option
  const { streamNumber } = state || {};

  return Array.from(
    { length: streamNumber },
    (_, index) => index + 1
  ).reduce((acc, stream) => {
    return [
      ...acc,
      {
        screen: 'StreamFilterPage',
        params: {
          title: `Filter Page ${stream}`,
        },
      },
      {
        screen: 'StreamSlamshutPage',
        params: {
          title: `Slamshut Page ${stream}`,
        },
      },
      {
        screen: 'StreamActiveRegulatorPage',
        params: {
          title: `Active Regulator Page ${stream}`,
        },
      },
      {
        screen: 'StreamReliefRegulatorPage',
        params: {
          title: `Relief Regulator Page ${stream}`,
        },
      },
      {
        screen: 'StreamWaferCheckPage',
        params: {
          title: `Wafer Check Page ${stream}`,
        },
      },
    ];
  }, []);
};

export const ExchangeStreamsSetSealDetailsPage = [
  {
    screen: 'StreamsSetSealDetails',
    params: {
      title: 'Streams Set Seal Details',
      nextScreen: 'FilterPage-1',
    },
    diversions: (state) => {
      const streamFlow = InstancesForStreamFlow({ state });
      return [...streamFlow, ...RegulatorPage];
    },
  },
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

  ...ExchangeStandardPage,
];
