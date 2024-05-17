import { useNavigation } from '@react-navigation/native';
import React, { createContext, useContext, useState } from 'react';

export const ProgressiveNavigationContext = createContext();

const config = {
  // All flow logic should be defined here with necessary props
  // Example: Install flow
  Install: [
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
  ],
};

// Wrap the children with the provider to provide the navigation context
// inlcude the flowType to determine the flow of the navigation
export function NavigationProvider({ children }) {
  // Get the flow based on the flowType
  const navigation = useNavigation();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [flowType, setFlowType] = useState(); // Default flow type [Install

  const [flow, setFlow] = useState([]);

  const goToNextStep = () => {
    console.log({ flow, flowType });
    const nextIndex =
      currentStepIndex + 1 < flow.length ? currentStepIndex + 1 : null;
    if (nextIndex !== null) {
      setCurrentStepIndex(nextIndex);
      navigation.navigate(flow[nextIndex].screen);
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1 >= 0 ? currentStepIndex - 1 : null;
    if (prevIndex !== null) {
      setCurrentStepIndex(prevIndex);
      navigation.navigate(flow[prevIndex].screen);
    }
  };

  const startFlow = (newFlowType) => {
    // set the flow type and reset the current step index
    setFlowType(newFlowType);
    setCurrentStepIndex(0);
    setFlow(config[newFlowType]);
    // return the first screen of the flow
    return config[newFlowType][0];
  };

  // This function is used to push a new screen to the navigation flow
  const pushNavigation = (screen, params = {}) => {
    const nextIndex = currentStepIndex + 1;
    setFlow((prevFlow) => {
      // push it to the next index
      const newFlow = [...prevFlow];
      newFlow[nextIndex] = { screen, params };
      return newFlow;
    });
    setCurrentStepIndex(nextIndex);
    navigation.navigate(screen, params);
  };

  return (
    <ProgressiveNavigationContext.Provider
      value={{
        flow,
        startFlow,
        setFlowType,
        goToNextStep,
        goToPreviousStep,
        pushNavigation,
        // Include the current step and total steps for the UI to display progress
        currentStep: currentStepIndex,
        totalSteps: flow?.length,
      }}
    >
      {children}
    </ProgressiveNavigationContext.Provider>
  );
}

export const useProgressNavigation = () =>
  useContext(ProgressiveNavigationContext);
