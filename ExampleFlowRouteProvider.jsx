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
