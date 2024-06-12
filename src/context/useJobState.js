import { useState, useCallback } from 'react';

const getInitialJobState = (jobType) => ({
  jobID: null,
  jobType,
  jobDetails: null,
  jobStarted: false,
  jobStatus: null,
  siteDetails: {
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
  },
  siteQuestions: {
    isSafe: false,
    isGeneric: false,
    genericReason: '',
    isCarryOut: false,
    carryOutReason: '',
    isFitted: false,
    isStandard: false,
  },
  photos: {},
  streams: {},
  extraCounter: 0,
  meterDetails: {},
  kioskDetails: {},
  ecvDetails: {},
  movDetails: {},
  regulatorDetails: {},
  standardDetails: null,
  ventDetails: {},
  meterDetailsTwo: {},
  additionalMaterials: {},
  dataLoggerDetails: {},
  dataLoggerDetailsTwo: {
    loggerOwner: ['Install', 'Maintenance'].includes(jobType)
      ? 'Eco Metering Solutions'
      : '',
  },
  maintenanceDetails: null,
  correctorDetails: {
    manufacturer: '',
    model: '',
    serialNumber: '',
    isMountingBracket: null,
    uncorrected: '',
    corrected: '',
  },
  correctorDetailsTwo: {
    manufacturer: '',
    model: '',
    serialNumber: '',
    isMountingBracket: null,
    uncorrected: '',
    corrected: '',
  },
  chatterBoxDetails: {},
  blobs: [],
  userLogged: false,
});

const useJobState = () => {
  const [jobType, setJobType] = useState();
  const initialState = getInitialJobState(jobType);
  const [state, setState] = useState(initialState);

  const resetState = useCallback(
    () => setState(getInitialJobState(jobType)),
    [jobType]
  );

  return {
    state,
    setState,
    setJobType,
    resetState,
  };
};

export default useJobState;
