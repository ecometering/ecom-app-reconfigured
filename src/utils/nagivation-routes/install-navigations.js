import { getMeterRoute } from '../gateway-functions/meterGateway';
import { getCorrectorRoute } from '../gateway-functions/correctorGateway';
import { getDataloggerRoute } from '../gateway-functions/dataloggerGateway';
import { getAssetSelectRoute } from '../gateway-functions/assetSelectGateway';

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
    diversions: (state) => {
      const { siteQuestions } = state;
      if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
        return StandardPage;
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
export const StandardPage = [
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

// navigation.navigate('JobTypeNavigator'); i dont know what this suposed to do

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
  },
  {
    screen: 'GasSafeWarningPage',
  },
  ...CompositeLabelPhoto,
];

// AssetTypeSelectionPage
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    ...SubmitSuccessPage,
    diversions: (state) => {
      getAssetSelectRoute({ state });
    },
  },
];

// AssetTypeSelectionPage Alternative Flows
export const MeterDetailsPage = [
  {
    screen: 'MeterDetails',
    params: {
      title: 'New Meter Details',
    },
  },
  {
    screen: 'NewEcvToMov',
    params: {
      title: 'New ECV to MOV',
      photoKey: 'NewEcvToMov',
    },
    diversions: (state) =>
      getMeterRoute({ state, jobType: 'Install', pageflow: 1 }),
  },
];

export const CorrectorDetailsPage = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'New Corrector installed',
      photoKey: 'installedCorrector',
    },
    diversions: (state) => getCorrectorRoute({ state }),
  },
];

export const DataLoggerDetailsPage = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'New AMR installed',
      photoKey: 'installedAMR',
    },
    diversions: (state) => getDataloggerRoute({ state }),
  },
];

// export const MeterDetails Alternative Flows
export const MeterIndexPage = [
  {
    screen: 'MeterIndex',
    params: {
      title: 'New Meter index',
      photoKey: 'MeterIndex',
    },
  },
  {
    screen: 'NewMeterPhoto',
    params: {
      title: 'New Meter photo',
      photoKey: 'NewMeterPhoto',
    },
    diversions: (state) =>
      getMeterRoute({ state, jobType: 'Install', pageflow: 2 }),
  },
];

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

export const StreamsSetSealDetailsPage = [
  {
    screen: 'StreamsSetSealDetails',
    params: {
      title: 'Streams Set Seal Details',
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
  ...StandardPage,
];
