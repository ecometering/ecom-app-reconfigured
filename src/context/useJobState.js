import { useState, useCallback } from 'react';
import { useSQLiteContext } from 'expo-sqlite/next';
import moment from 'moment';
import { fieldMapping, jsonFields } from './stateDatabaseMapping';

const getInitialJobState = (jobType) => ({
  jobID: null,
  jobType: jobType || '',
  jobStatus: null,
  startDate: moment().format('YYYY-MM-DD HH:mm'),
  endDate: null,
  rebook: null,
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
  meterDetails: {},
  kioskDetails: {},
  ecvDetails: {},
  movDetails: {},
  regulatorDetails: {},
  standards: null,
  meterDetailsTwo: {},
  additionalMaterials: {},
  dataLoggerDetails: {},
  dataLoggerDetailsTwo: {
    loggerOwner: ['Install', 'Maintenance'].includes(jobType)
      ? 'Eco Metering Solutions'
      : '',
  },
  maintenanceQuestions: null,
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
});

const useJobState = () => {
  const [jobType, setJobTypeState] = useState('');
  const initialState = getInitialJobState(jobType);
  const [state, setState] = useState(initialState);
  const db = useSQLiteContext();

  const ensureFieldsExist = async () => {
    try {
      const tableInfo = await db.getAllAsync('PRAGMA table_info(Jobs);');
      const existingFields = tableInfo.map((info) => info.name);

      const missingFields = Object.values(fieldMapping).filter(
        (field) => !existingFields.includes(field)
      );

      for (const field of missingFields) {
        await db.runAsync(`ALTER TABLE Jobs ADD COLUMN ${field} TEXT;`);
      }
    } catch (error) {
      console.error('Error ensuring fields exist in database:', error);
    }
  };

  const saveToDatabase = async (currentState) => {
    try {
      const { jobID } = currentState;

      const fields = Object.keys(fieldMapping).filter((key) => key !== 'jobID');
      const values = fields.map((field) => {
        if (jsonFields.includes(field)) {
          return JSON.stringify(currentState[field]);
        }
        return currentState[field];
      });

      if (jobID) {
        const updateFields = fields
          .map((field) => `${fieldMapping[field]} = ?`)
          .join(', ');
        await db.runAsync(`UPDATE Jobs SET ${updateFields} WHERE id = ?`, [
          ...values,
          jobID,
        ]);
      } else {
        const placeholders = fields.map(() => '?').join(', ');
        const result = await db.runAsync(
          `INSERT INTO Jobs (${fields
            .map((field) => fieldMapping[field])
            .join(', ')}) VALUES (${placeholders})`,
          values
        );
        setState((prev) => ({
          ...prev,
          jobID: result.lastInsertRowId,
        }));
      }
    } catch (error) {
      console.error('Error saving state to database:', error);
    }
  };

  const setStateAndSave = (newState) => {
    setState((prevState) => {
      const updatedState =
        typeof newState === 'function' ? newState(prevState) : newState;
      ensureFieldsExist().then(() => saveToDatabase(updatedState));
      return updatedState;
    });
  };

  const resetState = useCallback(
    () => setStateAndSave(getInitialJobState(jobType)),
    [jobType]
  );

  const setJobType = useCallback((newJobType) => {
    setJobTypeState(newJobType);
    setStateAndSave((prevState) => ({
      ...prevState,
      jobType: newJobType,
    }));
  }, []);

  return {
    state,
    setState: setStateAndSave,
    setJobType,
    resetState,
  };
};

export default useJobState;
