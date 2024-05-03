import React, { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { openDatabase } from '../utils/database';

// Function to load job details from the database
export const loadJob = async (jobId) => {
  const db = await openDatabase(); // Assuming openDatabase() returns a promise of a database connection

  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM Jobs WHERE id = ?;',
        [jobId],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0)); // Access the first row if it exists
          } else {
            resolve(null); // Resolve with null if no data found
          }
        },
        (tx, error) => {
          console.error('Error loading job:', error);
          reject(error); // Proper error handling
        }
      );
    });
  });
};

// Component to process and update job details
const JobDetailsProcessor = ({ jobID }) => {
  const {
    setSiteDetails,
    setSiteQuestions,
    setMaintenanceQuestions,
    setMeterDetails,
    setCorrectorDetails,
    setDataloggerDetails,
    setStreams,
    setRegulator,
    setAdditionalMaterials,
    setChatterboxDetails,
    setStandards,
    setRebook,
    setPhotos,
    setOtherDetails,
  } = useContext(AppContext); // Use context to set details

  // Function to update app context with job data
  const updateAppContext = (data) => {
    console.log('Updating app context with:', data);

    setSiteDetails(data.siteDetails);
    setSiteQuestions(data.siteQuestions);
    setMaintenanceQuestions(data.maintenanceQuestions);
    setMeterDetails(data.meterDetails);
    setCorrectorDetails(data.correctorDetails);
    setDataloggerDetails(data.dataloggerDetails);
    setStreams(data.streams);
    setRegulator(data.regulator);
    setAdditionalMaterials(data.additionalMaterials);
    setChatterboxDetails(data.chatterboxDetails);
    setStandards(data.standards);
    setRebook(data.rebook);
    setPhotos(data.photos);
    setOtherDetails(data.otherDetails);

    console.log('Updated app context');
  };

  // Main function to process and update context with the job details
  const processAndUpdateJobDetails = async () => {
    try {
      const jobData = await loadJob(jobID);

      if (!jobData) {
        console.log('No job found for ID:', jobID);
        return;
      }

      const {
        siteDetails = '{}',
        siteQuestions = '{}',
        maintenanceQuestions = '{}',
        meterDetails = '{}',
        correctorDetails = '{}',
        dataloggerDetails = '{}',
        streams = '{}',
        regulator = '{}',
        additionalMaterials = '{}',
        chatterboxDetails = '{}',
        standards = '{}',
        rebook = '{}',
        photos = '{}',
        ...otherDetails
      } = jobData;

      // Parse JSON string columns and update context
      const parsedData = {
        otherDetails,
        siteDetails: JSON.parse(siteDetails),
        siteQuestions: JSON.parse(siteQuestions),
        maintenanceQuestions: JSON.parse(maintenanceQuestions),
        meterDetails: JSON.parse(meterDetails),
        correctorDetails: JSON.parse(correctorDetails),
        dataloggerDetails: JSON.parse(dataloggerDetails),
        streams: JSON.parse(streams),
        regulator: JSON.parse(regulator),
        additionalMaterials: JSON.parse(additionalMaterials),
        chatterboxDetails: JSON.parse(chatterboxDetails),
        standards: JSON.parse(standards),
        rebook: JSON.parse(rebook),
        photos: JSON.parse(photos),
      };

      updateAppContext(parsedData);
    } catch (error) {
      console.error('Error processing job details:', error);
    }
  };

  useEffect(() => {
    processAndUpdateJobDetails();
  }, [jobID]);

  return null; // This component does not render anything
};

export default JobDetailsProcessor;
