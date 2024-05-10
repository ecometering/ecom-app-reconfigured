import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

const config = {
  // All flow logic should be defined here with necessary props
  // Example: Install flow
  Install: [
    {
      screen: 'Home',
      params: {},
      next: 1,
      prev: null,
    },
    {
      screen: 'ImageUpload',
      params: { uploadCount: 1 },
      next: 2,
      prev: 0,
    },
    {
      screen: 'EndScreen',
      params: {},
      next: null,
      prev: 1,
    },
  ],
};

// Wrap the children with the provider to provide the navigation context
// inlcude the flowType to determine the flow of the navigation
export function NavigationProvider({ children, flowType = 'Install' }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Get the flow based on the flowType
  const flow = config[flowType];

  const goToNextStep = () => {
    const nextIndex = flow[currentStepIndex]?.next;
    if (nextIndex !== null) {
      setCurrentStepIndex(nextIndex);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = flow[currentStepIndex]?.prev;
    if (prevIndex !== null) {
      setCurrentStepIndex(prevIndex);
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        goToNextStep,
        goToPreviousStep,
        // Include the current step and total steps for the UI to display progress
        currentStep: currentStepIndex,
        totalSteps: flow?.length,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => useContext(NavigationContext);



const navigation= 
{
  
  // If user has valid token then gome to home page else if no token or invalid token go to login page. 
  Login: [
    {
      screen: 'LoginPage',
      name:'Login',
      params: {},
      next: 'HomePage',
      prev: null,
    },
    {
      screen: 'HomePage',
      name:'Home',
      params: {},
      next: {Calendar:'CalendarPage',
      JobsInProgress:'InProgressJobsPage',
      CompletedJobs:'CompletedJobsPage',
      PlannedJob:'PlannedJobPage',
    NewJob:'JobTypePage'},
    // this is dependent on the button pressed on home screen. 
      prev: 'LoginPage',
      //logout button

    },
    {
      screen: 'InProgressJobsPage',
      name:'JobsInProgress',
      params: {title:'Jobs in progress'},
      next: 'SiteDetails',
      prev:'HomePage',
      // takes the job details and set the values job type detemermined by job type job selected was created with 
    },
    {
      screen: 'CompletedJobsPage',
      name: 'CompletedJobs',
      params: {title:'Completed jobs '},
      next: 'SiteDetails',
      prev:'HomePage',
      // takes the job details and set the values job type detemermined by job type job selected was created with 
    },
    {
      screen: 'PlannedJobsPage',
      name: 'PlannedJobs',
      params: {title:'Planned jobs '},
      next: 'SiteDetails',
      prev:'HomePage',
      // takes the job details and set the values job type detemermined by job type job selected was created with 
    },
  ],
    Calendar:[
      {
        screen: 'CalendarPage',
        name: 'Calendar',
        params: {},
        next: {Daily:'DailyView',
        Weekly:'WeeklyView',},
        prev: 'HomePage',
      },
      // this is using tabs monthy weekly and daily on monthly and weekly if clicking a day should open daily view. 
      //back on daily should take back to monthly or weekly view. weekly & monthly back should take back to home screen. 
    ],
    NewJob:[
      {
        screen: 'JobTypePage',
        name: 'JobTypeSelection',
        params: {},
        next: 'SiteDetailsPage',
        prev: 'HomePage',
        // set JobType to Job type selected 
      },
      {
        screen: 'SiteDetailsPage',
        name:'SiteDetails',
        params: {title:'Site Details'},
        next: 'JobDetailsPage',
        prev: 'JobTypePage',
        // if job type warrant. Title is Warrant Details. 
      },
      {
        screen: 'GenericPhotoPage',
        name:'SitePhoto',
        params: {title: "Site Photo",
        photoKey: "sitePhoto",
      },
        next:jobType === "Warrant" && !siteDetails.confirmWarrant ? "SubmitSuccessPage" : "SiteQuestionsPage",
        prev: 'SiteDetailsPage',
        // set job details to job details entered 
      },
      {screen:'SiteQuestionsPage' ,
      name:'SiteQuestions',
      params:{title:'Site Questions', 
      photoKey:"bypassPhoto"
    },
      next: {!isSafe:'StandardPage',
      !isStandard:'StandardPage',
      !isCarryout:'RebookPage',
      next:'AssetTypeSelectionPage',
      ifSurvey:'KioskPhoto',
    ifMaintenace:'MaintenanceQuestions'}, 
      prev:'SitePhoto',
      },
      Install:[
        {
          screen: 'AssetTypeSelectionPage',
          name:'AssetSelection',
        params: {title:'Assets being istalled'},
        next: {isMeter:'MeterDetails',
        isCorrector:'CorrectorDetails',
        isAmr:'DataLoggerDetails'},
        prev: 'SiteQuestions',
        // checks meter first then corrector then finally Datalogger
        },
        Meter:[
          {
            screen: 'MeterDetailsPage',
            name:'MeterDetails',
            params: {title:'New Meter Details'},
            next: 'NewEcvToMov',
            prev: 'AssetTypeSelectionPage',
            // set meter details to meter details entered 
          },
          {
            screen: 'GenericPhotoPage',
            name:'NewEcvToMov',
            params: { title: 'New Ecv To Mov',
            photoKey: 'NewEcvToMov',
          },
            next: {diaphragm:'MeterIndex',
                    other: 'MeterDataBadge'},
            prev: 'MeterDetailsPage',
           
          },
          
          {
            screen: 'GenericPhotoPage',
            name:'MeterDataBadge',
            params: { title: 'New Meter data badge',
            photoKey: 'MeterDataBadge',
          },
            next: 'MeterIndex',
            prev: 'NewEcvToMov',
           
          },
          {
            screen: 'GenericPhotoPage',
            name:'MeterIndex',
            params: { title: 'New Meter index',
            photoKey: 'MeterIndex',
          },
            next: 'NewMeterPhoto',
            prev: {Diaphragm:'NewEcvToMov',
                other:'MeterDataBadge',},
           
          },
           {
            screen: 'GenericPhotoPage',
            name:'NewMeterPhoto',
            params: { title: 'New Meter photo',
            photoKey: 'NewMeterPhoto',
          },
            next: {iscorrector:'CorrectorDetails',
            isAmr:'DataLoggerDetailsPage',
            isDiaphragmMP:'StreamsSetSealDetails',
           isOther:'StreamsSetSealDetails', 
          isNotDiaphragmMP: 'Regulator'},

            prev: 'MeterIndex',
            //  checks if corrector is true first then corrector then the meter info
          },
          {
            screen: 'RegulatorPage',
            name:'Regulator',
            params: {title:'New Regulator',photoKey:'newRegulator'},
            next: 'StandardPage',
            prev: {
              isNotDiaphragmMP: 'NewMeterPhoto',
              isDiaphragmMP:'WaferCheckPage{n}',
              isOther:'WaferCheckPage{n}', 
              iscorrector:'CorrectorDetails',
              isAmr:'DataLoggerDetailsPage',
            }
            // depends on conditions. n is equal to number of streams to get last wafer check page.
          },
        ],
        corrector:[
            {
              screen: 'CorrectorDetails',
              name:'CorrectorDetails',
              params: {title:'New Corrector',photoKey:'newCorrector'},
              next: {isAmr:'DataLoggerDetailsPage',
            isDiaphragmMP:'StreamsSetSealDetails',
           isOther:'StreamsSetSealDetails', 
          isNotDiaphragmMP: 'Regulator'},
              prev: {
                isMeter:'NewMeterPhoto',
                isNoMeter:'AssetTypeSelectionPage'
              }
          ],
          DataLogger:[
            {
              screen: 'DataLoggerDetailsPage',
              name:'DataLoggerDetails',
              params: {title:'New Data Logger',photoKey:'newDataLogger'},
              next: {isDiaphragmMP:'StreamsSetSealDetails',
             isOther:'StreamsSetSealDetails', 
            isNotDiaphragmMP: 'Regulator'},
              prev: {
                isCorrector:'CorrectorDetails',
                isMeter:'NewMeterPhoto',
                isNoMeter:'AssetTypeSelectionPage'
              }
          
        ],
        
      setandSeal:[
        {
          screen: 'StreamsSetSealDetailsPage',
          name:'StreamsSetSealDetails',
          params: {title:'Set and Seal Details'},
          options:{streams:'n'},
          next:'FilterPage',
          prev: {isMeter:'NewMeterPhoto',
          isCorrector:'CorrectorDetails',
          isAmr:'DataLoggerDetailsPage'},
          // set set and seal details to set and seal details entered 
        },
        {
          screen:'FilterPage',
          name: 'Filter{n}',
          params: {streams:'n',title:'Filter {n}',photoKey:'Filter{n}'},
          next: 'SlamshutPage{n}',
          prev: {First:'StreamsSetSealDetailsPage',
                 AnyButFirst:'WaferCheckPage',}
        },
        {
          screen:'SlamshutPage',
          name: 'Slamshut{n}',
          params: {streams:'n',title:'Slamshut {n}',photoKey:'Slamshut{n}'},
          next: 'ActiveRegulator{n}',
          prev: 'Filter{n}'
        },
        {
          screen:'ActiveRegulatorPage',
          name: 'ActiveRegulator{n}',
          params: {streams:'n',title:'Active Regulator {n}',photoKey:'ActiveRegulator{n}'},
          next: 'ReliefRegulator{n}',
          prev: 'Slamshut{n}'
        },
        {
          screen:'ReliefRegulatorPage',
          name: 'ReliefRegulator{n}',
          params: {streams:'n',title:'Relief Regulator {n}',photoKey:'ReliefRegulator{n}'},
          next: 'WaferCheck{n}',
          prev: 'ActiveRegulatorPage{n}'
        },
        {
          screen:'WaferCheckPage',
          name: 'WaferCheck{n}',
          params: {streams:'n',title:'Wafer Check {n}',photoKey:'WaferCheck{n}'},
          next: {notFullNumberOfStreams:'FilterPage',
          fullNumberOfStreams:'StandardPage'},
          //should go to regulatorPage however we will just go to standards for now as pages need to be designed and created 
          prev: 'ReliefRegulator{n}'
        },
      ],],
      Removal:[  {
        screen: 'AssetTypeSelectionPage',
        name:'AssetSelectionRemoval',
      params: {title:'Assets being Removed'},
      next: {isMeter:'RemovedMeterDetails',
      isCorrector:'RemovedCorrectorDetails',
      isAmr:'RemovedDataLoggerDetails'},
      prev: 'SiteQuestions',
      // checks meter first then corrector then finally Datalogger
      },
      Meter:[
        {
          screen: 'MeterDetailsPage',
          name:'RemovedMeterDetails',
          params: {title:'Removed Meter Details'},
          next: {diaphragm:'RemovedMeterIndex',
                    other: 'RemovedMeterDataBadge'},
          prev: 'AssetTypeSelectionRemoval',
          // set meter details to meter details entered 
        },
        {
          screen: 'GenericPhotoPage',
          name:'RemovedMeterDataBadge',
          params: { title: 'Removed Meter data badge',
          photoKey: 'RemovedMeterDataBadge',
        },
          next: 'RemovedMeterIndex',
          prev: 'RemovedMeterDetails',
         
        },
        {
          screen: 'GenericPhotoPage',
          name:'RemovedMeterIndex',
          params: { title: 'Removed Meter index',
          photoKey: 'RemovedMeterIndex',
        },
          next: 'CappedECV',
          prev: {Diaphragm:'RemovedMeterDetails',
              other:'RemovedMeterDataBadge',},
         
        },
        {
          screen: 'GenericPhotoPage',
          name:'CappedECV',
          params: { title: 'Capped ECV',
          photoKey: 'CappedECV',
        },
          next: 'RemovedMeterPhoto',
          prev: 'RemovedMeterIndex',
              
         
        },
         {
          screen: 'GenericPhotoPage',
          name:'RemovedMeterPhoto',
          params: { title: 'Removed Meter photo',
          photoKey: 'RemovedMeterPhoto',
        },
          next: {iscorrector:'RemovedCorrectorDetails',
          isAmr:'RemovedDataLoggerDetails',
          isNone:'StandardPage',},

          prev: 'CappedECV',
          //  checks if corrector is true first then corrector then the meter info
        },
        
      ],
      corrector:[
          {
            screen: 'CorrectorDetails',
            name:'RemovedCorrectorDetails',
            params: {title:'Removed Corrector',photoKey:'RemovedCorrector'},
            next: {isAmr:'RemovedDataLoggerDetails',
          isNone:'StandardPage'},
            prev: {
              isMeter:'RemovedMeterPhoto',
              isNoMeter:'AssetSelectionRemoval'
            }
        ],
        DataLogger:[
          {
            screen: 'DataLoggerDetailsPage',
            name:'RemovedDataLoggerDetails',
            params: {title:'Removed Data Logger',photoKey:'RemovedDataLogger'},
            next: 'standardsPage',
            prev: {
              isCorrector:'RemovedCorrectorDetails',
              isMeter:'RemovedMeterPhoto',
              isNoMeter:'AssetSelectionRemoval'
            }
        
      ],
      ],
      //warrant uses removal only difference is the job can end if warrant is no 
      Exchange:[
        {
          screen: 'AssetTypeSelectionPage',
          name:'AssetSelectionExchange',
        params: {title:'Assets being Exchanged'},
        next: {isMeter:'RemovedMeterDetails',
        isCorrector:'RemovedCorrectorDetails',
        isAmr:'RemovedDataLoggerDetails'},
        prev: 'SiteQuestions',
        // checks meter first then corrector then finally Datalogger
        },
        //does all of the removal process but instead of going to Standards 
        //goes to install process using assets selected on asset select page 
         // example if only corrector we would go corrector removed then corrector installed pages
      ],
      Maintenance:[
        {
          screen: 'MaintenanceQuestions',
          name:'MaintenanceQuestions',
          params: {title:'MaintenanceQuestions'},
          next: 'AssetSelection',
          prev: 'SiteQuestions',
          // set meter details to meter details entered 
        },
        {
          screen: 'AssetTypeSelectionPage',
          name:'AssetSelection',
        params: {title:'Existing Assets'},
        next:'maintenanceQuestions',
        next: {isMeter:'ExistingMeterDetails',
        isCorrector:'ExistingCorrectorDetails',
        isAmr:'ExistingDataLoggerDetails'},
        prev: 'MaintenanceQuestions',
        // checks meter first then corrector then finally Datalogger
        },
        {
          screen: 'AssetTypeSelectionPage',
          name:'AssetSelection',
        params: {title:'Assets being istalled'},
        next: {isMeter:'MeterDetails',
        isCorrector:'CorrectorDetails',
        isAmr:'DataLoggerDetails'},
        prev: 'JobTypePage',
        // checks meter first then corrector then finally Datalogger
        },
        Meter:[
          {
            screen: 'MeterDetailsPage',
            name:'ExistingMeterDetails',
            params: {title:'Existing Meter Details'},
            next: 'ExistingEcvToMov',
            prev: 'AssetTypeSelectionPage',
            // set meter details to meter details entered 
          },
          {
            screen: 'GenericPhotoPage',
            name:'ExistingEcvToMov',
            params: { title: 'Existing Ecv To Mov',
            photoKey: 'ExistingEcvToMov',
          },
            next: {diaphragm:'ExistingMeterIndex',
                    other: 'ExistingMeterDataBadge'},
            prev: 'ExistingMeterDetailsPage',
           
          },
          
          {
            screen: 'GenericPhotoPage',
            name:'ExistingMeterDataBadge',
            params: { title: 'Existing Meter data badge',
            photoKey: 'ExistingMeterDataBadge',
          },
            next: 'ExistingMeterIndex',
            prev: 'ExistingEcvToMov',
           
          },
          {
            screen: 'GenericPhotoPage',
            name:'ExistingMeterIndex',
            params: { title: 'Existing Meter index',
            photoKey: 'ExistingMeterIndex',
          },
            next: 'ExistingMeterPhoto',
            prev: {Diaphragm:'ExistingEcvToMov',
                other:'ExistingMeterDataBadge',},
           
          },
           {
            screen: 'GenericPhotoPage',
            name:'ExistingMeterPhoto',
            params: { title: 'ExistingMeter photo',
            photoKey: 'ExistingMeterPhoto',
          },
            next: {iscorrector:'ExistingCorrectorDetails',
            isAmr:'ExistingDataLoggerDetailsPage',
            isDiaphragmMP:'StreamsSetSealDetails',
           isOther:'StreamsSetSealDetails', 
          isNotDiaphragmMP: 'StandardPage'},

            prev: 'ExistingMeterIndex',
            //  checks if corrector is true first then corrector then the meter info
          },
          {
            screen: 'RegulatorPage',
            name:'Regulator',
            params: {title:'New Regulator',photoKey:'newRegulator'},
            next: 'StandardPage',
            prev: {
              isNotDiaphragmMP: 'NewMeterPhoto',
              isDiaphragmMP:'WaferCheckPage{n}',
              isOther:'WaferCheckPage{n}', 
              iscorrector:'CorrectorDetails',
              isAmr:'DataLoggerDetailsPage',
            }
            // depends on conditions. n is equal to number of streams to get last wafer check page.
          },
        ],
        corrector:[
            {
              screen: 'ExistingCorrectorDetails',
              name:'ExistingCorrectorDetails',
              params: {title:'Existing Corrector',photoKey:'ExistingCorrector'},
              next: {isAmr:'ExistingDataLoggerDetailsPage',
            isDiaphragmMP:'StreamsSetSealDetails',
           isOther:'StreamsSetSealDetails', 
          isNotDiaphragmMP: 'StandardsPage'},
              prev: {
                isMeter:'ExistingMeterPhoto',
                isNoMeter:'AssetTypeSelectionPage'
              }
          ],
          DataLogger:[
            {
              screen: 'ExistingDataLoggerDetailsPage',
              name:'ExistingDataLoggerDetails',
              params: {title:'Existing Data Logger',photoKey:'ExistingDataLogger'},
              next: {isDiaphragmMP:'StreamsSetSealDetails',
             isOther:'StreamsSetSealDetails', 
            isNotDiaphragmMP: 'StandardsPage'},
              prev: {
                isCorrector:'ExistingCorrectorDetails',
                isMeter:'ExistingMeterPhoto',
                isNoMeter:'AssetTypeSelectionPage'
              }
          
        ],
      ],
      Survey:[
        {
          screen: 'GenericPhotoPage',
          name:'KioskPhoto',
          params: { title: 'Kiosk Photo',
          photoKey: 'KioskPhoto',
        },
          next: 'KioskPage',
          prev: 'SiteQuestions',
         
        },
        {
          screen: 'KioskPage',
          name:'KioskPage',
          params: {title:'Kiosk Information'},
          next: 'VentsPage',
          prev: 'KioskPhoto',
          // set meter details to meter details entered 
        },
        {
          screen: 'VentsPage',
          name:'VentsPage',
          params: {title:'Vents Information'},
          next: 'EcvPage',
          prev: 'KioskPage',
          // set meter details to meter details entered 
        },
        {
          screen: 'EcvPage',
          name:'EcvPage',
          params: {title:'ECV Information'},
          next: 'MovPage',
          prev: 'VentsPage',
          // set meter details to meter details entered 
        },
        {
          screen: 'MovPage',
          name:'MovPage',
          params: {title:'MOV Information'},
          next: 'AssetSelection',
          prev: 'VentsPage',
          // set meter details to meter details entered 
        },
        {
        screen: 'AssetTypeSelectionPage',
        name:'AssetSelection',
      params: {title:'Existing Assets'},
      next:'maintenanceQuestions',
      next: {isMeter:'ExistingMeterDetails',
      isCorrector:'ExistingCorrectorDetails',
      isAmr:'ExistingDataLoggerDetails'},
      prev: 'JobTypePage',
      // checks meter first then corrector then finally Datalogger
      },
      {
        screen: 'AssetTypeSelectionPage',
        name:'AssetSelection',
      params: {title:'Assets being istalled'},
      next: {isMeter:'MeterDetails',
      isCorrector:'CorrectorDetails',
      isAmr:'DataLoggerDetails'},
      prev: 'JobTypePage',
      // checks meter first then corrector then finally Datalogger
      },
      Meter:[
        {
          screen: 'MeterDetailsPage',
          name:'ExistingMeterDetails',
          params: {title:'Existing Meter Details'},
          next: 'ExistingEcvToMov',
          prev: 'AssetTypeSelectionPage',
          // set meter details to meter details entered 
        },
        {
          screen: 'GenericPhotoPage',
          name:'ExistingEcvToMov',
          params: { title: 'Existing Ecv To Mov',
          photoKey: 'ExistingEcvToMov',
        },
          next: {diaphragm:'ExistingMeterIndex',
                  other: 'ExistingMeterDataBadge'},
          prev: 'ExistingMeterDetailsPage',
         
        },
        
        {
          screen: 'GenericPhotoPage',
          name:'ExistingMeterDataBadge',
          params: { title: 'Existing Meter data badge',
          photoKey: 'ExistingMeterDataBadge',
        },
          next: 'ExistingMeterIndex',
          prev: 'ExistingEcvToMov',
         
        },
        {
          screen: 'GenericPhotoPage',
          name:'ExistingMeterIndex',
          params: { title: 'Existing Meter index',
          photoKey: 'ExistingMeterIndex',
        },
          next: 'ExistingMeterPhoto',
          prev: {Diaphragm:'ExistingEcvToMov',
              other:'ExistingMeterDataBadge',},
         
        },
         {
          screen: 'GenericPhotoPage',
          name:'ExistingMeterPhoto',
          params: { title: 'ExistingMeter photo',
          photoKey: 'ExistingMeterPhoto',
        },
          next: {iscorrector:'ExistingCorrectorDetails',
          isAmr:'ExistingDataLoggerDetailsPage',
          isDiaphragmMP:'StreamsSetSealDetails',
         isOther:'StreamsSetSealDetails', 
        isNotDiaphragmMP: 'StandardPage'},

          prev: 'ExistingMeterIndex',
          //  checks if corrector is true first then corrector then the meter info
        },
        {
          screen: 'RegulatorPage',
          name:'Regulator',
          params: {title:'New Regulator',photoKey:'newRegulator'},
          next: 'StandardPage',
          prev: {
            isNotDiaphragmMP: 'NewMeterPhoto',
            isDiaphragmMP:'WaferCheckPage{n}',
            isOther:'WaferCheckPage{n}', 
            iscorrector:'CorrectorDetails',
            isAmr:'DataLoggerDetailsPage',
          }
          // depends on conditions. n is equal to number of streams to get last wafer check page.
        },
      ],
      corrector:[
          {
            screen: 'ExistingCorrectorDetails',
            name:'ExistingCorrectorDetails',
            params: {title:'Existing Corrector',photoKey:'ExistingCorrector'},
            next: {isAmr:'ExistingDataLoggerDetailsPage',
          isDiaphragmMP:'StreamsSetSealDetails',
         isOther:'StreamsSetSealDetails', 
        isNotDiaphragmMP: 'StandardsPage'},
            prev: {
              isMeter:'ExistingMeterPhoto',
              isNoMeter:'AssetTypeSelectionPage'
            }
        ],
        DataLogger:[
          {
            screen: 'ExistingDataLoggerDetailsPage',
            name:'ExistingDataLoggerDetails',
            params: {title:'Existing Data Logger',photoKey:'ExistingDataLogger'},
            next: {isDiaphragmMP:'StreamsSetSealDetails',
           isOther:'StreamsSetSealDetails', 
          isNotDiaphragmMP: 'StandardsPage'},
            prev: {
              isCorrector:'ExistingCorrectorDetails',
              isMeter:'ExistingMeterPhoto',
              isNoMeter:'AssetTypeSelectionPage'
            }],
      ]
    Standard:[
      {
        screen: 'StandardPage',
        name:'StandardPage',
        params: {title:'Standards Page'},
        next: {ifNotRiddor:'RiddorReport',
      ifNotStandards:'SnClientInfo',
      next:'CompositeLabel'}
        
       
      },
      {
        screen: 'RiddorReportPage',
        name:'RiddorReport',
        params: {title:'Riddor Report'},
        next: {
      ifNotStandards:'SnClientInfo',
      next:'CompositeLabel'}
      
      },
      {
        screen: 'SnClientInfoPage',
        name:'SnClientInfo',
        params: {title:''},
        next:'GasSafeWarning'
      
      },
      {
        screen: 'GenericPhotoPage',
        name:'CompositeLabel',
        params: { title: 'Composite Label Photo',
        photoKey: 'CompositeLabel',
      },
        next: 'DSEARLabel',
       
      },
      {
        screen: 'GenericPhotoPage',
        name:'DSEARLabel',
        params: { title: 'DSEAR Label Photo',
        photoKey: 'DSEARLabel',
      },
        next: {ifSurvey:'SiteSurveyDrawing',
        next:'AdditionalPhotos'}
       
      },
      {
        screen: 'GenericPhotoPage',
        name:'SiteSurveyDrawing',
        params: {  title: "Site Survey Drawing",
        photoKey: "siteSurveyDrawing",
      },
        next:'AdditionalPhotos'
        
      },
      {
        screen: 'GenericPhotoPage',
        name:'ExtraPhotoPage',
        params: {  photoNumber:{n}, photoKey: "extraPhotos_{n},", title: "Extra Photos {n} " 
      },
        next:{ifYes:'ExtraPhotoPage',
        ifNo:'SubmitSuccessPage'}
        
      },
      {
        screen: 'SubmitSuccessPage',
        name:'SubmitSuccessPage',
        params: {title:'Submit Job'},
        next:'HomePage'
        
      },
    ],
    ]
};
//set and seal is the same process currently for Maintenance, survey install and exchaneg on install section 