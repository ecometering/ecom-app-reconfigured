import React, { createContext, useContext, useEffect, useState } from 'react';
import { meterType } from '../utils/constant';
import { database } from '../utils/db';

const AppContext = createContext({
  numberOfStreams: 0,
  currentStreamIndex: 0,
  updateCurrentStreamIndex: 0,
  extraPhotoCount: 0,
});

export const useAppContext = () => {
  return useContext(AppContext);
};

const AppContextProvider = (props) => {
  const [jobID, setJobID] = useState(null);
  const [jobType, setJobType] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [jobStarted, setJobStarted] = useState(false);
  const [photos, setPhotos] = useState({});

  const savePhoto = async (photoKey, photoDetails) => {
    setPhotos((prevPhotos) => ({
      ...prevPhotos,
      [photoKey]: photoDetails,
    }));
  };

  const updatePhoto = (photoKey, newDetails) => {
    setPhotos((prevPhotos) => ({
      ...prevPhotos,
      [photoKey]: { ...prevPhotos[photoKey], ...newDetails },
    }));
  };

  const loadPhoto = (photoKey) => {
    return photos[photoKey];
  };
  const [hasStreamNumber, setHasStreamNumber] = useState(false);
  const [streamNumber, setStreamNumber] = useState(0);
  const [streamValue, setStreamValue] = useState([]);
  const [streamCounter, setStreamCounter] = useState(0);

  const [extraCounter, setExtraCounter] = useState(0);

  // CHOSEN ITEM or METER
  const [siteDetails, setSiteDetails] = useState({
    mprn: '',
    companyName: '',
    buildingName: '',
    address1: '',
    address2: '',
    address3: '',
    town: '',
    county: '',
    postCode: '',
    title: '',
    contact: '',
    email1: '',
    email2: '',
    number1: '',
    number2: '',
    instructions: '',
    confirmContact: false,
    confirmWarrant: false, // Assuming confirmContact is a boolean, provide a default value accordingly
  });
  const [siteQuestions, setSiteQuestions] = useState({
    isSafe: false,
    isGeneric: false,
    genericReason: '',
    isCarryOut: false,
    carryOutReason: '',
    isFitted: false,
    isStandard: false,
  });

  const [meterDetails, setMeterDetails] = useState({});
  const [kioskDetails, setKioskDetails] = useState({});
  const [ecvDetails, setEcvDetails] = useState({});
  const [movDetails, setMovDetails] = useState({});
  const [regulatorDetails, setRegulatorDetails] = useState(null);
  const [standardDetails, setStandardDetails] = useState(null);
  const [ventDetails, setVentDetails] = useState({});
  //.. removed
  const [dataLoggerDetails, setDataLoggerDetails] = useState({
    loggerOwner: 'Eco Metering Solutions',
  });
  const [removedMeterDetails, setRemovedMeterDetails] = useState(null);
  //.. warant
  // ... Maintenance
  const [maintenanceDetails, setMaintenanceDetails] = useState(null);

  const [blobs, setBlobs] = useState([]);

  const [userLogged, setUserLogged] = useState(false);
  const [jobData, setJobdata] = useState(null);

  useEffect(() => {
    console.log('appcontenxt, jobType', jobType);
  }, [jobType, userLogged]);

  const setJobTypes = async (job) => {
    setJobType(job);
    console.log('Job type changed', job);
  };
  const [correctorDetails, setCorrectorDetails] = useState({
    manufacturer: '',
    model: '',
    serialNumber: '',
    isMountingBracket: null,
    uncorrected: '',
    corrected: '',
  });
  const [correctorDetailsTwo, setCorrectorDetailsTwo] = useState({
    manufacturer: '',
    model: '',
    serialNumber: '',
    isMountingBracket: null,
    uncorrected: '',
    corrected: '',
  });

  const resetContext = () => {
    setJobType(null);
    setJobDetails(null);
    setJobStarted(false);
    setPhotos({});
    setHasStreamNumber(false);
    setStreamNumber(0);
    setStreamValue([]);
    setStreamCounter(0);
    setExtraCounter(0);
    setSiteDetails({
      mprn: '',
      companyName: '',
      buildingName: '',
      address1: '',
      address2: '',
      address3: '',
      town: '',
      county: '',
      postCode: '',
      title: '',
      contact: '',
      email1: '',
      email2: '',
      number1: '',
      number2: '',
      instructions: '',
      confirmContact: false,
      confirmWarrant: false,
    });
    setSiteQuestions({
      isSafe: false,
      isGeneric: false,
      genericReason: '',
      isCarryOut: false,
      carryOutReason: '',
      isFitted: false,
      isStandard: false,
    });
    setMeterDetails(null);
    setRegulatorDetails(null);
    setStandardDetails(null);
    setMaintenanceDetails(null);
    setJobdata(null);
  };

  const providerValue = {
    resetContext,
    jobType,
    jobID,
    jobDetails,
    siteQuestions,
    photos,
    dataLoggerDetails,
    correctorDetails,
    correctorDetailsTwo,
    hasStreamNumber,
    jobData,
    streamNumber,
    streamValue,
    streamCounter,
    siteDetails,
    meterDetails,
    kioskDetails,
    ecvDetails,
    movDetails,
    ventDetails,
    regulatorDetails,
    standardDetails,
    extraCounter,
    removedMeterDetails,
    maintenanceDetails,
    setJobType,
    setJobDetails,
    setSiteQuestions,
    setPhotos,
    savePhoto,
    jobStarted,
    // addPhotoDetail,
    updatePhoto,
    setJobdata,
    setJobID,
    setMaintenanceDetails,
    setRemovedMeterDetails,
    setExtraCounter,
    setKioskDetails,
    setEcvDetails,
    setMovDetails,
    setDataLoggerDetails,
    setVentDetails,
    setStandardDetails,
    setRegulatorDetails,
    setMeterDetails,
    setSiteDetails,
    setCorrectorDetails,
    setCorrectorDetailsTwo,
    setHasStreamNumber,
    setStreamCounter,
    setStreamValue,
    setStreamNumber,
    setJobTypes,
    setJobStarted,
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
