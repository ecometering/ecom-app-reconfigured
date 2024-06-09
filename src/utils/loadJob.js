import { useSQLiteContext } from "expo-sqlite/next";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

const LoadJob = async (db, appContext, jobID) => {
  const loadData = async () => {
    try {
      const result = await db.getAllAsync('SELECT * FROM Jobs WHERE id = ?', [jobID]);
      console.log('Data loaded from database:', result[0]);
      return result[0];
    } catch (error) {
      console.log('Error loading data from database:', error);
      throw error;
    }
  };

  const setAppContext = (jobData) => {
    try {
      appContext.setJobID(jobData.id);
      console.log("Message: 581, Loading in Job ID:", jobData.id);
  
      appContext.setJobType(jobData.jobType);
      console.log("Message: 582, Loading in Job Type:", jobData.jobType);
  
      appContext.setJobStatus(jobData.JobStatus);
      console.log("Message: 583, Loading in Job Status:", jobData.JobStatus);
  
      try {
        appContext.setSiteDetails(
          jobData.siteDetails ? JSON.parse(jobData.siteDetails) : null
        );
        console.log("Message: 584, Loading in Site Details:", jobData.siteDetails);
      } catch (error) {
        console.log("Error parsing Site Details:", error);
        appContext.setSiteDetails(null);
      }
  
      try {
        appContext.setSiteQuestions(
          jobData.siteQuestions ? JSON.parse(jobData.siteQuestions) : null
        );
        console.log("Message: 585, Loading in Site Questions:", jobData.siteQuestions);
      } catch (error) {
        console.log("Error parsing Site Questions:", error);
        appContext.setSiteQuestions(null);
      }
  
      try {
        appContext.setMaintenanceDetails(
          jobData.maintenanceQuestions ? JSON.parse(jobData.maintenanceQuestions) : null
        );
        console.log("Message: 586, Loading in Maintenance Details:", jobData.maintenanceQuestions);
      } catch (error) {
        console.log("Error parsing Maintenance Details:", error);
        appContext.setMaintenanceDetails(null);
      }
  
      try {
        appContext.setPhotos(
          jobData.photos ? JSON.parse(jobData.photos) : null
        );
        console.log("Message: 587, Loading in Photos:", jobData.photos);
      } catch (error) {
        console.log("Error parsing Photos:", error);
        appContext.setPhotos(null);
      }
  
      try {
        appContext.setMeterDetails(
          jobData.meterDetails ? JSON.parse(jobData.meterDetails) : null
        );
        console.log("Message: 588, Loading in Meter Details:", jobData.meterDetails);
      } catch (error) {
        console.log("Error parsing Meter Details:", error);
        appContext.setMeterDetails(null);
      }
  
      try {
        appContext.setMeterDetailsTwo(
          jobData.meterDetailsTwo ? JSON.parse(jobData.meterDetailsTwo) : null
        );
        console.log("Message: 589, Loading in Meter Details Two:", jobData.meterDetailsTwo);
      } catch (error) {
        console.log("Error parsing Meter Details Two:", error);
        appContext.setMeterDetailsTwo(null);
      }
  
      try {
        appContext.setCorrectorDetails(
          jobData.correctorDetails ? JSON.parse(jobData.correctorDetails) : null
        );
        console.log("Message: 590, Loading in Corrector Details:", jobData.correctorDetails);
      } catch (error) {
        console.log("Error parsing Corrector Details:", error);
        appContext.setCorrectorDetails(null);
      }
  
      try {
        appContext.setCorrectorDetailsTwo(
          jobData.correctorDetailsTwo ? JSON.parse(jobData.correctorDetailsTwo) : null
        );
        console.log("Message: 591, Loading in Corrector Details Two:", jobData.correctorDetailsTwo);
      } catch (error) {
        console.log("Error parsing Corrector Details Two:", error);
        appContext.setCorrectorDetailsTwo(null);
      }
  
      try {
        appContext.setDataLoggerDetails(
          jobData.dataloggerDetails ? JSON.parse(jobData.dataloggerDetails) : null
        );
        console.log("Message: 592, Loading in Data Logger Details:", jobData.dataloggerDetails);
      } catch (error) {
        console.log("Error parsing Data Logger Details:", error);
        appContext.setDataLoggerDetails(null);
      }
  
      try {
        appContext.setDataLoggerDetailsTwo(
          jobData.dataloggerDetailsTwo ? JSON.parse(jobData.dataloggerDetailsTwo) : null
        );
        console.log("Message: 593, Loading in Data Logger Details Two:", jobData.dataloggerDetailsTwo);
      } catch (error) {
        console.log("Error parsing Data Logger Details Two:", error);
        appContext.setDataLoggerDetailsTwo(null);
      }
  
      try {
        appContext.setChatterBoxDetails(
          jobData.chatterBoxDetails ? JSON.parse(jobData.chatterBoxDetails) : null
        );
        console.log("Message: 594, Loading in Chatter Box Details:", jobData.chatterBoxDetails);
      } catch (error) {
        console.log("Error parsing Chatter Box Details:", error);
        appContext.setChatterBoxDetails(null);
      }
  
      try {
        appContext.setStreams(
          jobData.streams ? JSON.parse(jobData.streams) : null
        );
        console.log("Message: 595, Loading in Streams:", jobData.streams);
      } catch (error) {
        console.log("Error parsing Streams:", error);
        appContext.setStreams(null);
      }
  
      try {
        appContext.setStreamCounter(
          jobData.streamCounter ? JSON.parse(jobData.streamCounter) : null
        );
        console.log("Message: 596, Loading in Stream Counter:", jobData.streamCounter);
      } catch (error) {
        console.log("Error parsing Stream Counter:", error);
        appContext.setStreamCounter(null);
      }
  
      try {
        appContext.setRegulatorDetails(
          jobData.regulatorDetails ? JSON.parse(jobData.regulatorDetails) : null
        );
        console.log("Message: 597, Loading in Regulator Details:", jobData.regulatorDetails);
      } catch (error) {
        console.log("Error parsing Regulator Details:", error);
        appContext.setRegulatorDetails(null);
      }
  
      try {
        appContext.setAdditionalMaterials(
          jobData.additionalMaterials ? JSON.parse(jobData.additionalMaterials) : null
        );
        console.log("Message: 598, Loading in Additional Materials:", jobData.additionalMaterials);
      } catch (error) {
        console.log("Error parsing Additional Materials:", error);
        appContext.setAdditionalMaterials(null);
      }
  
      try {
        appContext.setKioskDetails(
          jobData.kioskDetails ? JSON.parse(jobData.kioskDetails) : null
        );
        console.log("Message: 599, Loading in Kiosk Details:", jobData.kioskDetails);
      } catch (error) {
        console.log("Error parsing Kiosk Details:", error);
        appContext.setKioskDetails(null);
      }
  
      try {
        appContext.setEcvDetails(
          jobData.ecvDetails ? JSON.parse(jobData.ecvDetails) : null
        );
        console.log("Message: 600, Loading in ECV Details:", jobData.ecvDetails);
      } catch (error) {
        console.log("Error parsing ECV Details:", error);
        appContext.setEcvDetails(null);
      }
  
      try {
        appContext.setMovDetails(
          jobData.movDetails ? JSON.parse(jobData.movDetails) : null
        );
        console.log("Message: 601, Loading in MOV Details:", jobData.movDetails);
      } catch (error) {
        console.log("Error parsing MOV Details:", error);
        appContext.setMovDetails(null);
      }
  
      try {
        appContext.setStandardDetails(
          jobData.standards ? JSON.parse(jobData.standards) : null
        );
        console.log("Message: 602, Loading in Standards:", jobData.standards);
      } catch (error) {
        console.log("Error parsing Standards:", error);
        appContext.setStandards(null);
      }
  
      try {
        appContext.setRebook(
          jobData.rebook ? JSON.parse(jobData.rebook) : null
        );
        console.log("Message: 603, Loading in Rebook:", jobData.rebook);
      } catch (error) {
        console.log("Error parsing Rebook:", error);
        appContext.setRebook(null);
      }
    } catch (error) {
      console.log('Error setting data to context:', error);
      throw error;
    }
  };

  try {
    const jobData = await loadData();
     setAppContext(jobData);
    return jobData;
  } catch (error) {
    console.log('Error loading job:', error);
    throw error;
  }
};


export default LoadJob;