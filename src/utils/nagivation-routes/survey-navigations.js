import { getAssetSelectRoute } from '../gateway-functions/assetSelectGateway';

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
    diversions: (state) => {
      const { siteQuestions } = state;
      if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
        return SurveyStandardPage;
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

export const SnClientInfoPage = [
  {
    screen: 'SnClientInfoPage',
  },
  {
    screen: 'GasSafeWarningPage',
  },
  ...CompositeLabelPhoto,
];

// Site Questions Alternative Flows
export const SurveyStandardPage = [
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

export const SurveyExistingMeterDetails = [
  {
    screen: 'MeterDetails',
    params: {
      title: 'Existing Meter Details',
    },
  },
  {
    screen: 'ExistingEcvToMov',
    params: {
      title: 'New ECV to MOV',
      photoKey: 'ExistingEcvToMov',
    },
    diversions: (state) => {
      getMeterRoute({ state, pageFlow: 1 });
    },
  },
];

export const SurveyExistingCorrectorDetails = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'Existing Corrector installed',
    },
    diversions: (state) => {
      getCorrectorRoute({ state });
    },
  },
];

export const SurveyExistingDataLoggerDetails = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'Existing AMR installed',
    },
    diversions: (state) => getDataloggerRoute({ state }),
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

export const SurveyStreamsSetSealDetailsPage = [
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
    screen: 'ChatterBox',
  },
  {
    screen: 'AdditionalMaterial',
  },
  ...SurveyStandardPage,
];

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
