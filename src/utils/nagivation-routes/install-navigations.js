import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { getCorrectorRoute } from '../gateway-functions/correctorGateway';
import { getDataloggerRoute } from '../gateway-functions/dataloggerGateway';
import { getMeterRoute } from '../gateway-functions/meterGateway';

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
    diversions: getMeterRoute({ jobType: 'Install', pageflow: 1 }),
  },
];

export const CorrectorDetailsPage = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'New Corrector installed',
      photoKey: 'installedCorrector',
    },
    diversions: getCorrectorRoute(),
  },
];

export const DataLoggerDetailsPage = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'New AMR installed',
      photoKey: 'installedAMR',
    },
    diversions: getDataloggerRoute(),
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
    diversions: getMeterRoute({ jobType: 'Install', pageflow: 2 }),
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

// CorrectorDetailsPage
// DataLoggerDetailsPage
// StandardPage

export const InstancesForStreamFlow = () => {
  // TODO: sort context switch
  // Redux might be a better option
  const { numberOfStreams } = 5;

  return Array.from(
    { length: numberOfStreams },
    (_, index) => index + 1
  ).reduce((acc, stream) => {
    return [
      ...acc,
      {
        screen: `FilterPage-${stream}`,
        params: {
          title: `Filter Page ${stream}`,
        },
      },
      {
        screen: `SlamshutPage-${stream}`,
        params: {
          title: `Slamshut Page ${stream}`,
        },
      },
      {
        screen: `ActiveRegulatorPage-${stream}`,
        params: {
          title: `Active Regulator Page ${stream}`,
        },
      },
      {
        screen: `ReliefRegulatorPage-${stream}`,
        params: {
          title: `Relief Regulator Page ${stream}`,
        },
      },
      {
        screen: `WaferCheckPage-${stream}`,
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
      nextScreen: 'FilterPage-1',
    },
    diversions: InstancesForStreamFlow().push(RegulatorPage),
  },
];

export const RegulatorPage = [
  {
    screen: 'Regulator',
  },
];

export const RegulatorPhotoPage = [
  {
    screen: 'RegulatorPhoto',
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
