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
  const [jobStatus,setJobStatus]=useState(null);
  const [photos, setPhotos] = useState({});
const [streams,setStreams]=useState({});
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
const [rebook,setRebook] =useState({});
  const [meterDetails, setMeterDetails] = useState({});
  const [kioskDetails, setKioskDetails] = useState({});
  const [ecvDetails, setEcvDetails] = useState({});
  const [movDetails, setMovDetails] = useState({});
  const [regulatorDetails, setRegulatorDetails] = useState({});
  const [standardDetails, setStandardDetails] = useState({});
  const [ventDetails, setVentDetails] = useState({});
  const [meterDetailsTwo, setMeterDetailsTwo] = useState({});
  const [additionalMaterials,setAdditionalMaterials]=useState({});
  //.. removed
  const [dataLoggerDetails, setDataLoggerDetails] = useState({});
  useEffect(() => {
    
    if (jobType === "Install" || jobType === "Maintenance") {
      setDataLoggerDetails({ loggerOwner: 'Eco Metering Solutions' });
    } else {
      setDataLoggerDetails({});
    }
  }, [jobType]);

  const [dataLoggerDetailsTwo, setDataLoggerDetailsTwo] = useState({
    loggerOwner: 'Eco Metering Solutions',
  });
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
  const [chatterBoxDetails,setChatterBoxDetails]=useState({});
  const resetContext = () => {
    setJobID(null);
    setJobType(null);
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
    setJobStatus(null);
    setJobDetails(null);
    setJobStarted(false);
    setSiteQuestions({
      isSafe: false,
      isGeneric: false,
      genericReason: '',
      isCarryOut: false,
      carryOutReason: '',
      isFitted: false,
      isStandard: false,
    });
     setMaintenanceDetails(null);
     setPhotos({});
    setMeterDetails({});
    setMeterDetailsTwo({});
    setCorrectorDetails({
      manufacturer: '',
      model: '',
      serialNumber: '',
      isMountingBracket: null,
      uncorrected: '',
      corrected: '',
    });
    setCorrectorDetailsTwo({
      manufacturer: '',
      model: '',
      serialNumber: '',
      isMountingBracket: null,
      uncorrected: '',
      corrected: '',
    }); 
    setDataLoggerDetails(
      (jobType === "Install" || jobType === "Maintenance") 
        ? { loggerOwner: 'Eco Metering Solutions' } 
        : {}
    );
    setDataLoggerDetailsTwo({
      loggerOwner: 'Eco Metering Solutions',
    });
    setChatterBoxDetails({});
  
    setStreams({});
    setRegulatorDetails({});
    setAdditionalMaterials({});
   
    setKioskDetails({});
    setEcvDetails({});
    setMovDetails({});
    setStandardDetails({});
    setRebook({});
    
    setVentDetails({});
    
    
   
   
    
    setBlobs([]);
    setUserLogged(false);
    setJobdata(null);
  };

  const providerValue = {
    resetContext,
    jobType,
    jobID,
    jobStatus,
    jobDetails,
    siteQuestions,
    photos,
    dataLoggerDetails,
    correctorDetails,
    chatterBoxDetails,
    correctorDetailsTwo,
    hasStreamNumber,
    jobData,
    streamNumber,
    streamValue,
    streamCounter,
    streams,
    siteDetails,
    meterDetails,
    meterDetailsTwo,
    regulatorDetails,
    dataLoggerDetailsTwo,
    additionalMaterials,
    kioskDetails,
    ecvDetails,
    movDetails,
    rebook,
    ventDetails,
    regulatorDetails,
    standardDetails,
    extraCounter,
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
    setJobStatus,
    setMaintenanceDetails,
    setExtraCounter,
    setMeterDetailsTwo,
    setAdditionalMaterials,
    setKioskDetails,
    setEcvDetails,
    setMovDetails,
    setDataLoggerDetails,
    setDataLoggerDetailsTwo,
    setVentDetails,
    setStandardDetails,
    setRegulatorDetails,
    setMeterDetails,
    setSiteDetails,
    setCorrectorDetails,
    setChatterBoxDetails,
    setCorrectorDetailsTwo,
    setHasStreamNumber,
    setStreamCounter,
    setStreamValue,
    setStreamNumber,
    setStreams,
    setJobTypes,
    setRebook,
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
