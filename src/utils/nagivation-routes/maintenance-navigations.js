import { RegulatorPage } from './install-navigations';

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
    diversions: ({ state }) => {
      const { siteQuestions } = state;
      if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
        return MaintenanceStandardPage;
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

export const chatterBoxPage = [
  {
    screen: 'chatterBox',
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

export const AdditionalMaterialsPage = [
  {
    screen: 'AdditionalMaterials',
    diversions: ({ state }) => {
      const { standardDetails } = state;
      const { riddorReportable, conformStandard, chatterbox } = standardDetails;
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

    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      const { pressureTier } = meterDetails || {};
      const isCorrector = meterDetails?.isCorrector;
      const isAmr = meterDetails?.isAmr;
      const isMeter = meterDetails?.isMeter;
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
    },
  },
];
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
    diversions: ({ state }) => {
      const { standardDetails } = state;
      const {
        riddorReportable,
        conformStandard,
        chatterbox,
        additionalMaterials,
      } = standardDetails;
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

// AssetTypeSelectionPage
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    diversions: ({ state }) => {
      const { meterDetails } = state || {};

      if (meterDetails?.isMeter) {
        return MaintenanceExistingMeterDetails;
      } else if (meterDetails?.isCorrector) {
        return MaintenanceExistingCorrectorDetails;
      } else if (meterDetails?.isAmr) {
        return MaintenanceExistingDataLoggerDetails;
      }
    },
  },
];

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
    diversions: ({ state }) => {
      const { meterDetails } = state || {};

      const Type = meterDetails?.meterType.value;

      if (!['1', '2', '4'].includes(Type)) {
        return MaintenanceExistingMeterDataBadge;
      } else {
        return MaintenanceExistingMeterIndex;
      }
    },
  },
];

export const MaintenanceExistingCorrectorDetails = [
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
    },
  },
];

export const MaintenanceExistingDataLoggerDetails = [
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
          return MaintenanceQuestionsPage;
        } else {
          return StreamsSetSealDetailsPage;
        }
      }

      return MaintenanceQuestionsPage;
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

export const StreamsSetSealDetailsPage = [
  {
    screen: 'StreamsSetSealDetails',
    params: {
      title: 'Streams Set Seal Details',
    },
    diversions: ({ state }) => {
      const streamFlows = InstancesForStreamFlow({ state });
      return [...streamFlows, ...MaintenanceQuestionsPage];
    },
  },
];

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
