import React, { createContext, useEffect, useState } from "react";

const AppContext = createContext({
  numberOfStreams: 0,
  currentStreamIndex: 0, 
  updateCurrentStreamIndex: 0,
  extraPhotoCount: 0
});

const AppContextProvider = (props) => {
  const [jobType, setJobType] = useState(null);
const [jobDetails, setJobDetails] = useState(null);
  const [isWarrant, setIsWarrant] = useState(false);
  const [photos, setPhotos] = useState([]);

  // Function to add a new photo detail
  const addPhotoDetail = (newPhotoDetail) => {
    setPhotos(prevPhotos => [...prevPhotos, newPhotoDetail]);
  };
  const [hasStreamNumber, setHasStreamNumber] = useState(false);
  const [streamNumber, setStreamNumber] = useState(0);
  const [streamValue, setStreamValue] = useState([]);
  const [streamCounter, setStreamCounter] = useState(0);

  const [extraCounter, setExtraCounter] = useState(0);
  const [passedRemoval, setPassedRemoval] = useState(false);
  const [startRemoval, setStartRemoval] = useState(false);

  // CHOSEN ITEM or METER
  const [siteDetails, setSiteDetails] = useState({
    mprn: "",
    companyName: "",
    buildingName: "",
    address1: "",
    address2: "",
    address3: "",
    town: "",
    county: "",
    postCode: "",
    title: "",
    contact: "",
    email1: "",
    email2: "",
    number1: "",
    number2: "",
    instructions: "",
    confirmContact: false,// Assuming confirmContact is a boolean, provide a default value accordingly
  });
  const [siteQuestions, setSiteQuestions] = useState({});

  const [meterDetails, setMeterDetails] = useState(null);
  const [regulatorDetails, setRegulatorDetails] = useState(null);
  const [standardDetails, setStandardDetails] = useState(null);
  //.. removed
  const [removedMeterDetails, setRemovedMeterDetails] = useState(null);
  //.. warant
  // ... Maintenance
  const [maintenanceDetails, setMaintenanceDetails] = useState(null);

  const [blobs, setBlobs] = useState([]);

  const [userLogged, setUserLogged] = useState(false);
  const [jobData, setJobdata] = useState(null);

  useEffect(() => {
    console.log("appcontenxt, jobType", jobType);
  }, [jobType, userLogged]);

  const setJobTypes = async (job) => {
    setJobType(job);
    console.log("Job type changed", job);
  };
const [visitCounts, setVisitCounts] = useState({});
const updateVisitCount = (screenName) => {
  setVisitCounts((prevCounts) => ({
      ...prevCounts,
      [screenName]: (prevCounts[screenName] || 0) + 1,
  }));
};
  const providerValue = {
    jobType,
    jobDetails,
    siteQuestions,
    photos,

    isWarrant,
    hasStreamNumber,
    jobData,
    streamNumber,
    streamValue,
    streamCounter,
    siteDetails,
    meterDetails,
    regulatorDetails,
    standardDetails,
    extraCounter,
    removedMeterDetails,
    passedRemoval,
    maintenanceDetails,
    startRemoval,
    setStartRemoval,
    setJobType,
    setJobDetails,
    setSiteQuestions,
    setPhotos,
    addPhotoDetail,
    setJobdata,
    setMaintenanceDetails,
    setPassedRemoval,
    setRemovedMeterDetails,
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