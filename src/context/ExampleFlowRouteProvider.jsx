import { useNavigation } from '@react-navigation/native';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Flow types
import { InstallNavigation } from '../utils/nagivation-routes/install-navigations';

export const ProgressiveNavigationContext = createContext();

const config = {
  Install: InstallNavigation,
  // TODO: Add more flow types here
};

export function NavigationProvider({ children }) {
  const navigation = useNavigation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [flowType, setFlowType] = useState(); // Default flow type
  const [flow, setFlow] = useState([]);

  useEffect(() => {
    if (flowType) {
      setFlow(config[flowType]);
      setCurrentStepIndex(0);
    }
  }, [flowType]);

  const goToNextStep = () => {
    if (flow[currentStepIndex].diversions) {
      pushNavigation(flow[currentStepIndex].diversions);
    } else {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < flow.length) {
        setCurrentStepIndex(nextIndex);
        navigation.navigate(flow[nextIndex].screen, flow[nextIndex].params);
      }
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStepIndex(prevIndex);
      navigation.navigate(flow[prevIndex].screen, flow[prevIndex].params);
    }
  };

  const startFlow = (newFlowType) => {
    setFlowType(newFlowType);
    return config[newFlowType][0];
  };

  const pushNavigation = (flowUpdate) => {
    const nextIndex = currentStepIndex + 1;
    setFlow((prevFlow) => {
      const newFlow = [...prevFlow];
      newFlow.splice(nextIndex, 0, ...flowUpdate); // Insert the new flow updates at the next index
      return newFlow;
    });
    setCurrentStepIndex(nextIndex);
    navigation.navigate(flowUpdate[0].screen, flowUpdate[0].params);
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
        currentStep: currentStepIndex,
        totalSteps: flow.length,
      }}
    >
      {children}
    </ProgressiveNavigationContext.Provider>
  );
}

export const useProgressNavigation = () =>
  useContext(ProgressiveNavigationContext);
