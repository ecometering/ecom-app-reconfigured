
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
    diversions: ({ state }) => {
      const { siteQuestions } = state || {};
      if (!siteQuestions?.isSafe || !siteQuestions?.isStandard) {
        return StandardPage;
      } else if (!siteQuestions?.isCarryOut) {
        return AbortPage;
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
    screen: 'ChatterBox',
    params: {
      title: 'Installed chatter box',
      photoKey: 'InstalledChatterBox',
    },
    diversions: ({ state }) => {
      const { standards,siteQuestions } = state;
      const { riddorReportable, conformStandard } = standards;
      if (riddorReportable) {
        return RiddorReportPage;
      } 
      else {
        if (!siteQuestions.isStandard) {
          return SnClientInfoPage;
        } 
        else {
          return CompositeLabelPhoto;
        }
      }
    },
  },
];

export const AdditionalMaterialsPage = [
  {
    screen: 'AdditionalMaterial',
    diversions: ({ state }) => {
      const { standards,siteQuestions } = state;
      const { riddorReportable, conformStandard, chatterbox } = standards;
      if (chatterbox === true) {
        return chatterBoxPage;
      } else {
        if (riddorReportable === true) {
          return RiddorReportPage;
        } 
        else {
          if (!siteQuestions.isStandard) {
            return SnClientInfoPage;
          } 
          else {
            return CompositeLabelPhoto;
          }
        }
      }
    },
  },
];
// Site Questions Alternative Flows
export const StandardPage = [
  {
    screen: 'StandardPage',
    diversions: ({ state }) => {
      const { standards,siteQuestions } = state;
      const {
        riddorReportable,
        conformStandard,
        chatterbox,
        additionalMaterials,
      } = standards;
     
        if (chatterbox === true) {
          return chatterBoxPage;
        } else {
          if (riddorReportable === true) {
            return RiddorReportPage;
          }
           else {
            if (!siteQuestions.isStandard) {
              return SnClientInfoPage;
            } 
            else {
              return CompositeLabelPhoto;
            }
          }
        
      }
    },
  },
];

export const AbortPage = [
  {
    screen: 'AbortPage',
    params: {
      photoKey: 'AbortReason',
      title:'Job abort reason'
    },
  },
  ...SubmitSuccessPage,
];

// navigation.navigate('JobTypeNavigator'); i dont know what this suposed to do

// Standard Page Alternative Flows
export const RiddorReportPage = [
  {
    screen: 'RiddorReportPage',
    params:{
      title: 'Riddor Report',
      photoKey:'RiddorReport'
    },
    diversions: ({ state }) => {
      const { standards,siteQuestions } = state;
      if (!siteQuestions.isStandard) {
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
    params: {
      title: 'Gas warning photo',
      photoKey: 'gasWarning',
    },
  },
  
  ...CompositeLabelPhoto,
 
];
 // {
  //   screen: 'SnClientInfoPage',
  // },
  // {
  //   screen: 'GasSafeWarningPage',
  // },
// AssetTypeSelectionPage
export const AssetTypeSelectionPage = [
  {
    screen: 'AssetTypeSelectionPage',
    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      if (meterDetails?.isMeter) {
        return MeterDetailsPage;
      } else if (meterDetails?.isCorrector) {
        return CorrectorDetailsPage;
      } else if (meterDetails?.isAmr) {
        return DataLoggerDetailsPage;
      }
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
    screen: 'EcvPhoto',
    params: {
      title: 'New ECV to MOV',
      photoKey: 'NewEcvToMov',
    },
    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      const Type = meterDetails?.meterType.value;

      if (!['1', '2', '4','7'].includes(Type)) {
        return MeterDataBadgePage;
      } else {
        return MeterIndexPage;
      }
    },
  },
];

export const CorrectorDetailsPage = [
  {
    screen: 'CorrectorDetails',
    params: {
      title: 'New Corrector installed',
      photoKey: 'installedCorrector',
    },
    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      const { pressureTier } = meterDetails || {};
      const isAmr = meterDetails?.isAmr;
      const isMeter = meterDetails?.isMeter;
      console.log(meterDetails)
      if (isAmr) {
        console.log('Diverting to DataLoggerDetailsPage');
        return DataLoggerDetailsPage;
      }

      if (isMeter) {
        if (pressureTier === 'LP' || pressureTier?.label === 'LP') {
          console.log('Diverting to RegulatorPage');
          return RegulatorPage;
        } else {
          console.log('Diverting to StreamsSetSealDetailsPage');
          return StreamsSetSealDetailsPage;
        }
      }

      if (!isMeter && !isAmr) {
        console.log('Diverting to StandardsPage');
        return StandardPage;
      }
    },
  },
];

export const DataLoggerDetailsPage = [
  {
    screen: 'DataLoggerDetails',
    params: {
      title: 'New AMR installed',
      photoKey: 'installedAMR',
    },
    diversions: ({ state }) => {
      const { meterDetails } = state || {};

      const pressureTier = meterDetails?.pressureTier?.label;
      const isMeter = meterDetails?.isMeter;

      if (isMeter) {
        if (pressureTier === 'LP') {
          return RegulatorPage;
        } else {
          return StreamsSetSealDetailsPage;
        }
      }
      return StandardPage;
    },
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
    screen: 'MeterPhoto',
    params: {
      title: 'New Meter photo',
      photoKey: 'NewMeterPhoto',
    },
    diversions: ({ state }) => {
      const { meterDetails } = state || {};
      const isMeter = meterDetails?.isMeter;
      const isAmr = meterDetails?.isAmr;
      const isCorrector = meterDetails?.isCorrector;
      const pressureTier = meterDetails?.pressureTier.label;

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
    },
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
    diversions: ({ state }) => {
      const streamFlows = InstancesForStreamFlow({ state });
      return [...streamFlows, ...RegulatorPage];
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

  ...StandardPage,
];
