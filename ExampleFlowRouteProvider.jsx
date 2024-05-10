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
      next:'AssetTypeSelectionPage'}, 
      prev:'SiteQuestions',
      },
      Install:[
        {
          screen: 'AssetTypeSelectionPage',
          name:'AssetSelection',
        params: {title:'Assets being istalled'},
        next: {isMeter:'MeterDetailsPage',
        isCorrector:'CorrectorDetailsPage',
        isAmr:'DataLoggerDetailsPage'},
        prev: 'JobTypePage',
        // checks meter first then corrector then finally Datalogger
        }
      ]
    ],
};