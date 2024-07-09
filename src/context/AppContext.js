import React, { createContext, useContext, useMemo } from 'react';
import useJobState from './useJobState';

const AppContext = createContext();

export const useFormStateContext = () => useContext(AppContext);

const AppContextProvider = ({ children }) => {
  const { state, setState, setJobType, resetState } = useJobState();
  console.log('state', state);

  const providerValue = useMemo(
    () => ({ state, setState, setJobType, resetState }),
    [state, setState, setJobType, resetState]
  );

  return (
    <AppContext.Provider value={providerValue}>{children}</AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
