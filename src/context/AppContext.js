import React, { createContext, useEffect, useState } from "react";

const AppContext = createContext(null);

const AppContextProvider = (props) => {
  const [jobType, setJobType] = useState(null);
  const [isWarrant, setIsWarrant] = useState(false);

  const [hasStreamNumber, setHasStreamNumber] = useState(false);
  const [streamNumber, setStreamNumber] = useState(0);
  const [streamValue, setStreamValue] = useState([]);
  const [streamCounter, setStreamCounter] = useState(0);

  const [extraCounter, setExtraCounter] = useState(0);
  const [passedRemoval, setPassedRemoval] = useState(false);
  const [startRemoval, setStartRemoval] = useState(false);

  // CHOSEN ITEM or METER
  const [siteDetails, setSiteDetails] = useState(null);
  const [meterDetails, setMeterDetails] = useState(null);
  const [regulatorDetails, setRegulatorDetails] = useState(null);
  const [standardDetails, setStandardDetails] = useState(null);
  //.. removed
  const [removedSiteDetails, setRemovedSiteDetails] = useState(null);
  const [removedMeterDetails, setRemovedMeterDetails] = useState(null);
  //.. warant
  const [warrantDetails, setWarrantDetails] = useState(null);
  // ... Maintenance
  const [maintenanceDetails, setMaintenanceDetails] = useState(null);

  const [blobs, setBlobs] = useState([]);

  const [userLogged, setUserLogged] = useState(false);

  useEffect(() => {
    console.log("appcontenxt, jobType", jobType);
  }, [jobType, userLogged]);

  const setJobTypes = async (job) => {
    setJobType(job);
    console.log("Job type changed", job);
  };

  const providerValue = {
    jobType,
    isWarrant,
    hasStreamNumber,
    streamNumber,
    streamValue,
    streamCounter,
    siteDetails,
    meterDetails,
    regulatorDetails,
    standardDetails,
    extraCounter,
    removedSiteDetails,
    removedMeterDetails,
    passedRemoval,
    warrantDetails,
    maintenanceDetails,
    startRemoval,
    setStartRemoval,
    setMaintenanceDetails,
    setWarrantDetails,
    setPassedRemoval,
    setRemovedMeterDetails,
    setRemovedSiteDetails,
    setExtraCounter,
    setStandardDetails,
    setRegulatorDetails,
    setMeterDetails,
    setSiteDetails,
    setHasStreamNumber,
    setStreamCounter,
    setStreamValue,
    setStreamNumber,
    setIsWarrant,
    setJobTypes,
    blobs,
    setBlobs,
    userLogged,
    setUserLogged,
  };

  return (
    <AppContext.Provider value={providerValue}>
      {props.children}
    </AppContext.Provider>
  );
};

const AppConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppConsumer };
