import { useFormStateContext } from './AppContext';
import { useNavigation, StackActions } from '@react-navigation/native';
import React, { createContext, useContext, useState, useEffect } from 'react';

// Flow types
import {
  InstallNavigation,
  installDiversions,
} from '../utils/nagivation-routes/install-navigations';
import {
  RemovalNavigation,
  removalDiversions,
} from '../utils/nagivation-routes/removal-navigations';
import {
  ExchangeNavigation,
  exchangeDiversions,
} from '../utils/nagivation-routes/exchange-navigations';
import {
  SurveyNavigation,
  surveyDiversions,
} from '../utils/nagivation-routes/survey-navigations';
import {
  WarrantNavigation,
  warrantDiversions,
} from '../utils/nagivation-routes/warrant-navigations';
import {
  MaintenanceNavigation,
  maintenanceDiversions,
} from '../utils/nagivation-routes/maintenance-navigations';

export const ProgressiveNavigationContext = createContext();

const config = {
  Survey: SurveyNavigation,
  Install: InstallNavigation,
  Removal: RemovalNavigation,
  Warrant: WarrantNavigation,
  Exchange: ExchangeNavigation,
  Maintenance: MaintenanceNavigation,
};

const diversions = {
  Survey: surveyDiversions,
  Install: installDiversions,
  Removal: removalDiversions,
  Warrant: warrantDiversions,
  Exchange: exchangeDiversions,
  Maintenance: maintenanceDiversions,
};

export function NavigationProvider({ children }) {
  const { state, setState } = useFormStateContext();

  const flow = state?.navigation || [];
  const lastNavigationIndex = state?.lastNavigationIndex || 0;
  const navigation = useNavigation();

  const [flowType, setFlowType] = useState(); // Default flow type

  useEffect(() => {
    if (flowType && flow?.length === 0) {
      setState((prevState) => {
        return {
          ...prevState,
          navigation: config[flowType],
          lastNavigationIndex: 0,
        };
      });
    }
  }, [flowType]);

  const goToNextStep = () => {
    if (flow[lastNavigationIndex]?.diversionsKey) {
      const divKey = flow[lastNavigationIndex].diversionsKey;
      const diversionFunc = diversions[flowType][divKey](state);
      pushNavigation(diversionFunc);
    } else {
      const nextIndex = lastNavigationIndex + 1;
      if (nextIndex < flow.length) {
        setState((prevState) => {
          return {
            ...prevState,
            lastNavigationIndex: nextIndex,
            navigation: flow,
          };
        });
        navigation.navigate(flow[nextIndex].screen, flow[nextIndex].params);
      }
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = lastNavigationIndex - 1;
    if (prevIndex >= 0) {
      setState((prevState) => {
        return {
          ...prevState,
          lastNavigationIndex: prevIndex,
          navigation: flow,
        };
      });
      navigation.navigate(flow[prevIndex].screen, flow[prevIndex].params);
    }
  };

  const startFlow = ({ newFlowType, lastNavigationIndex, stateNavigation }) => {
    const parsedLastNavigationIndex = Number(lastNavigationIndex) || 0;
    setFlowType(newFlowType);
    if (stateNavigation && Object.keys(stateNavigation).length > 0) {
      setState((prevState) => {
        return {
          ...prevState,
          lastNavigationIndex: parsedLastNavigationIndex,
          navigation: stateNavigation,
        };
      });
      stateNavigation.forEach((screen) => {
        navigation.dispatch(
          StackActions.push(screen.screen, screen.params || {})
        );
      });
      return navigation.navigate(
        stateNavigation[parsedLastNavigationIndex].screen
      );
    } else {
      return navigation.navigate(config[newFlowType][0].screen);
    }
  };

  const jumpToStep = (index) => {
    if (index >= 0 && index < flow.length) {
      setState((prevState) => {
        return {
          ...prevState,
          lastNavigationIndex: index,
        };
      });

      navigation.dispatch(StackActions.pop(flow.length));
      const screens = flow.slice(0, index + 1);
      screens.forEach((screen) => {
        navigation.dispatch(
          StackActions.push(screen.screen, screen.params || {})
        );
      });
      navigation.navigate(flow[index].screen, flow[index].params);
    }
  };

  const pushNavigation = (flowUpdate) => {
    const nextIndex = lastNavigationIndex + 1;
    const newFlow = [...flow];
    newFlow.splice(nextIndex, 0, ...flowUpdate); // Insert the new flow updates at the next index
    setState((prevState) => {
      return {
        ...prevState,
        navigation: newFlow,
        lastNavigationIndex: nextIndex,
      };
    });
    navigation.navigate(flowUpdate[0].screen, flowUpdate[0].params);
  };

  return (
    <ProgressiveNavigationContext.Provider
      value={{
        flow,
        startFlow,
        jumpToStep,
        setFlowType,
        goToNextStep,
        goToPreviousStep,
        pushNavigation,
        currentStep: lastNavigationIndex,
        totalSteps: flow?.length || 0,
      }}
    >
      {children}
    </ProgressiveNavigationContext.Provider>
  );
}

export const useProgressNavigation = () =>
  useContext(ProgressiveNavigationContext);
