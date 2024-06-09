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
export const chatterBoxPage =[
  {
    screen: 'chatterBox',
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
    }}
  },

]

export const AdditionalMaterialsPage =[
  {
    screen: 'AdditionalMaterials',
    diversions: (state) => {
      const { standardDetails } = state;
      const { riddorReportable, conformStandard,chatterbox, } = standardDetails;
    if (chatterbox === true) {
      return chatterBoxPage}
    else {
      
    if (riddorReportable === true) {
      return RiddorReportPage;
    } else {
      if (conformStandard === false) {
        return SnClientInfoPage;
      } else {
        return CompositeLabelPhoto;
      }
    }}
  },
}
]
// Site Questions Alternative Flows
export const ExchangeStandardPage = [
  {
    screen: 'StandardPage',
    diversions: (state) => {
      const { standardDetails } = state;
      const { riddorReportable, conformStandard,chatterbox,additionalMaterials } = standardDetails;
     if (additionalMaterials === true) {
          return AdditionalMaterialsPage;
        }
        else{ 
          if (chatterbox === true) {
        return chatterBoxPage}
      else {
        
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
      const Type = meterDetails?.meterType.value;

      if (!['1', '2', '4'].includes(Type)) {
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
    screen: 'EcvPhoto',
    params: {
      title: 'ECV to MOV photo',
      photoKey: 'ecvToMovPhoto',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};
      const Type = meterDetails?.meterType.value;

      if (!['1', '2', '4'].includes(Type)) {
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
      photoKey: 'InstalledCorrector',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};
      const { pressureTier } = meterDetails || {};

      const isAmr = meterDetails?.isAmr;
      const isMeter = meterDetails?.isMeter;

      if (isAmr) {
        return InstalledDataLoggerDetails;
      } 
      if (isMeter) {
        if (pressureTier === 'LP' || pressureTier?.label === 'LP') {
         return RegulatorPage; 
        }
      } else {
        return ExchangeStreamsSetSealDetailsPage;
      }
    },
  },
];

export const InstalledDataLoggerDetails = [
  {
    screen: 'DataLoggerDetailsTwo',
    params: {
      title: 'Installed AMR',
      photoKey: 'InstalledAMR',
    },
    diversions: (state) => {
      const { meterDetails } = state || {};

      const pressureTier = meterDetails?.pressureTier?.label;
      
      const isMeter = meterDetails?.isMeter;

      if (isMeter) {
        if (pressureTier === 'LP') {
          return RegulatorPage;
        }else {
          return ExchangeStreamsSetSealDetailsPage;
        }
      } 
        return ExchangeStandardPage;
      
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
      const isMeter = meterDetails?.isMeter;
      const isAmr = meterDetails?.isAmr;
      const isCorrector = meterDetails?.isCorrector;
      const pressureTier = meterDetails?.pressureTier.label;

      if (isCorrector) {
        return InstalledCorrectorDetails;
      } 
      if (isAmr) {
        return InstalledDataLoggerDetails;
        
      } 
      if (isMeter) {
        if (pressureTier === 'LP' || pressureTier?.label === 'LP') {

          return RegulatorPage;
        }
      } else {
        return ExchangeStreamsSetSealDetailsPage
      }
    },
  },
];

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
    diversions: (state) => {
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
      } 
      if (meterDetails?.isCorrector) {
        return InstalledCorrectorDetails;
      } 
        return InstalledDataLoggerDetails;
      
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
      const { meterDetails } = state;

      if (meterDetails?.isAmr) {
        return ExistingDataLoggerDetails;
      }
       if(meterDetails.isMeter){
        return InstalledMeterDetails;
      }
       
      return InstalledCorrectorDetails;
        
      
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
            stream:stream ,
            photoKey:`Filter${stream}Photo`
          },
        },
        {
          screen: 'StreamSlamshutPage',
          params: {
            title: `Slamshut Page ${stream}`,
            photoKey:`SlamShut${stream}Photo`,
          },
        },
        {
          screen: 'StreamActiveRegulatorPage',
          params: {
            title: `Active Regulator Page ${stream}`,
            photoKey:`ActiveRegulator${stream}Photo`,

          },
        },
        {
          screen: 'StreamReliefRegulatorPage',
          params: {
            title: `Relief Regulator Page ${stream}`,
            photoKey:`ReliefRegulator${stream}Photo`,

          },
        },
        {
          screen: 'StreamWaferCheckPage',
          params: {
            title: `Wafer Check Page ${stream}`,
            photoKey:`WaferCheck${stream}Photo`,

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
    diversions: (state) => {
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

  ...ExchangeStandardPage,
];
