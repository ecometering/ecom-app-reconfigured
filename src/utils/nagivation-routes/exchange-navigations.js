import { getAssetSelectRoute } from '../gateway-functions/assetSelectGateway';
import { getCorrectorRoute } from '../gateway-functions/correctorGateway';
import { getDataloggerRoute } from '../gateway-functions/dataloggerGateway';
import { getMeterRoute } from '../gateway-functions/meterGateway';

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
    ...SubmitSuccessPage,
    diversions: (state) => {
      getAssetSelectRoute({ state, pageFlow: 1 });
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
      getMeterRoute({ state, pageRoute: 1, pageFlow: 1 });
    },
  },
];

export const InstalledMeterDetails = [
  {
    screen: 'MeterDetails',
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
      getMeterRoute({ state, pageRoute: 2, pageFlow: 1 });
    },
  },
];

export const InstalledCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Installed Corrector Details',
      photoKey: 'removedCorrector',
    },
    diversions: (state) => getCorrectorRoute({ state, pageRoute: 2 }),
  },
];

export const InstalledDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Installed AMR',
      photoKey: 'RemovedAMR',
    },
    diversions: (state) => getDataloggerRoute({ state }),
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
    diversions: (state) => getMeterRoute({ state, pageRoute: 2, pageFlow: 2 }),
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
    diversions: (state) => getCorrectorRoute({ state, pageRoute: 1 }),
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
    diversions: (state) => getAssetSelectRoute({ state, pageFlow: 2 }),
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
  const { numberOfStreams } = state || {};

  return Array.from(
    { length: numberOfStreams },
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
    diversions: (state) =>
      InstancesForStreamFlow({ state }).push(RegulatorPage),
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
  {
    screen: 'ChatterBox',
  },
  {
    screen: 'AdditionalMaterial',
  },
  ...ExchangeStandardPage,
];
