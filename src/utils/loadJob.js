import React, { useEffect, useState } from 'react';
import {  openDatabase, getDatabaseJob } from '../utils/database'; 
import { AppContext } from "../../context/AppContext";


export const fetchJobDetails = (jobId) => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM Jobs WHERE jobId = ?;`,
          [jobId],
          (_, { rows: { _array } }) => {
            if (_array.length > 0) {
              resolve(_array[0]);
            } else {
              reject('Job not found.');
            }
          },
          (_, error) => reject(error)
        );
      });
    });
  };
  const [siteDetails, setSiteDetails] = useState(null);
  // Assuming you have a method to update your app context or state
  const updateAppContext = (data) => {
    console.log('Updating app context with:', data);
    setSiteDetails(data.siteDetails);
    console.log ('file- load job - updateAppContext - data.siteDetails',siteDetails)
    
  };
  
  // Main function to process and update context with the job details
  const processAndUpdateJobDetails = async (jobId) => {
    try {
      const jobData = await fetchJobDetails(jobId);
      // Destructure jobData to separate JSON string columns and other data
      const {
        siteDetails,
        siteQuestions,
        maintenanceQuestions,
        meterDetails, // Assuming JSON string
        correctorDetails, // Assuming JSON string
        dataloggerDetails, // Assuming JSON string
        streams, // Assuming JSON string
        regulator, // Assuming JSON string
        additionalMaterials, // Assuming JSON string
        chatterboxDetails, // Assuming JSON string
        standards, // Assuming JSON string
        rebook, // Assuming JSON string
        photos, // Assuming JSON string
        ...otherDetails
      } = jobData;
  
      // Parse JSON string columns
      const parsedData = {
        siteDetails: JSON.parse(siteDetails || '{}'),
        siteQuestions: JSON.parse(siteQuestions || '{}'),
        maintenanceQuestions: JSON.parse(maintenanceQuestions || '{}'),
        meterDetails: JSON.parse(meterDetails || '{}'),
        correctorDetails: JSON.parse(correctorDetails || '{}'),
        dataloggerDetails: JSON.parse(dataloggerDetails || '{}'),
        streams: JSON.parse(streams || '{}'),
        regulator: JSON.parse(regulator || '{}'),
        additionalMaterials: JSON.parse(additionalMaterials || '{}'),
        chatterboxDetails: JSON.parse(chatterboxDetails || '{}'),
        standards: JSON.parse(standards || '{}'),
        rebook: JSON.parse(rebook || '{}'),
        photos: JSON.parse(photos || '{}'),
        ...otherDetails
      };
  
      // Update your app context or state with the parsed data
      updateAppContext(parsedData);
    } catch (error) {
      console.error("Error processing job details:", error);
    }
  };