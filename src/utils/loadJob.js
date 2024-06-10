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
      if (jobData.id) {
        appContext.setJobID(jobData.id);
        console.log("Message: 581, Loading in Job ID:", jobData.id);
      }

      if (jobData.jobType) {
        appContext.setJobType(jobData.jobType);
        console.log("Message: 582, Loading in Job Type:", jobData.jobType);
      }

      if (jobData.JobStatus) {
        appContext.setJobStatus(jobData.JobStatus);
        console.log("Message: 583, Loading in Job Status:", jobData.JobStatus);
      }

      if (jobData.siteDetails) {
        try {
          appContext.setSiteDetails(JSON.parse(jobData.siteDetails));
          console.log("Message: 584, Loading in Site Details:", jobData.siteDetails);
        } catch (error) {
          console.log("Error parsing Site Details:", error);
        }
      }

      if (jobData.siteQuestions) {
        try {
          appContext.setSiteQuestions(JSON.parse(jobData.siteQuestions));
          console.log("Message: 585, Loading in Site Questions:", jobData.siteQuestions);
        } catch (error) {
          console.log("Error parsing Site Questions:", error);
        }
      }

      if (jobData.maintenanceQuestions) {
        try {
          appContext.setMaintenanceDetails(JSON.parse(jobData.maintenanceQuestions));
          console.log("Message: 586, Loading in Maintenance Details:", jobData.maintenanceQuestions);
        } catch (error) {
          console.log("Error parsing Maintenance Details:", error);
        }
      }

      if (jobData.photos) {
        try {
          appContext.setPhotos(JSON.parse(jobData.photos));
          console.log("Message: 587, Loading in Photos:", jobData.photos);
        } catch (error) {
          console.log("Error parsing Photos:", error);
        }
      }

      if (jobData.meterDetails) {
        try {
          appContext.setMeterDetails(JSON.parse(jobData.meterDetails));
          console.log("Message: 588, Loading in Meter Details:", jobData.meterDetails);
        } catch (error) {
          console.log("Error parsing Meter Details:", error);
        }
      }

      if (jobData.meterDetailsTwo) {
        try {
          appContext.setMeterDetailsTwo(JSON.parse(jobData.meterDetailsTwo));
          console.log("Message: 589, Loading in Meter Details Two:", jobData.meterDetailsTwo);
        } catch (error) {
          console.log("Error parsing Meter Details Two:", error);
        }
      }

      if (jobData.correctorDetails) {
        try {
          appContext.setCorrectorDetails(JSON.parse(jobData.correctorDetails));
          console.log("Message: 590, Loading in Corrector Details:", jobData.correctorDetails);
        } catch (error) {
          console.log("Error parsing Corrector Details:", error);
        }
      }

      if (jobData.correctorDetailsTwo) {
        try {
          appContext.setCorrectorDetailsTwo(JSON.parse(jobData.correctorDetailsTwo));
          console.log("Message: 591, Loading in Corrector Details Two:", jobData.correctorDetailsTwo);
        } catch (error) {
          console.log("Error parsing Corrector Details Two:", error);
        }
      }

      if (jobData.dataloggerDetails) {
        try {
          appContext.setDataLoggerDetails(JSON.parse(jobData.dataloggerDetails));
          console.log("Message: 592, Loading in Data Logger Details:", jobData.dataloggerDetails);
        } catch (error) {
          console.log("Error parsing Data Logger Details:", error);
        }
      }

      if (jobData.dataLoggerDetailsTwo) {
        try {
          appContext.setDataLoggerDetailsTwo(JSON.parse(jobData.dataLoggerDetailsTwo));
          console.log("Message: 593, Loading in Data Logger Details Two:", jobData.dataLoggerDetailsTwo);
        } catch (error) {
          console.log("Error parsing Data Logger Details Two:", error);
        }
      }

      if (jobData.chatterBoxDetails) {
        try {
          appContext.setChatterBoxDetails(JSON.parse(jobData.chatterBoxDetails));
          console.log("Message: 594, Loading in Chatter Box Details:", jobData.chatterBoxDetails);
        } catch (error) {
          console.log("Error parsing Chatter Box Details:", error);
        }
      }

      if (jobData.streams) {
        try {
          appContext.setStreams(JSON.parse(jobData.streams));
          console.log("Message: 595, Loading in Streams:", jobData.streams);
        } catch (error) {
          console.log("Error parsing Streams:", error);
        }
      }

      

      if (jobData.regulatorDetails) {
        try {
          appContext.setRegulatorDetails(JSON.parse(jobData.regulatorDetails));
          console.log("Message: 597, Loading in Regulator Details:", jobData.regulatorDetails);
        } catch (error) {
          console.log("Error parsing Regulator Details:", error);
        }
      }

      if (jobData.additionalMaterials) {
        try {
          appContext.setAdditionalMaterials(JSON.parse(jobData.additionalMaterials));
          console.log("Message: 598, Loading in Additional Materials:", jobData.additionalMaterials);
        } catch (error) {
          console.log("Error parsing Additional Materials:", error);
        }
      }

      if (jobData.kioskDetails) {
        try {
          appContext.setKioskDetails(JSON.parse(jobData.kioskDetails));
          console.log("Message: 599, Loading in Kiosk Details:", jobData.kioskDetails);
        } catch (error) {
          console.log("Error parsing Kiosk Details:", error);
        }
      }

      if (jobData.ecvDetails) {
        try {
          appContext.setEcvDetails(JSON.parse(jobData.ecvDetails));
          console.log("Message: 600, Loading in ECV Details:", jobData.ecvDetails);
        } catch (error) {
          console.log("Error parsing ECV Details:", error);
        }
      }

      if (jobData.movDetails) {
        try {
          appContext.setMovDetails(JSON.parse(jobData.movDetails));
          console.log("Message: 601, Loading in MOV Details:", jobData.movDetails);
        } catch (error) {
          console.log("Error parsing MOV Details:", error);
        }
      }

      if (jobData.standards) {
        try {
          appContext.setStandardDetails(JSON.parse(jobData.standards));
          console.log("Message: 602, Loading in Standards:", jobData.standards);
        } catch (error) {
          console.log("Error parsing Standards:", error);
        }
      }

      if (jobData.rebook) {
        try {
          appContext.setRebook(JSON.parse(jobData.rebook));
          console.log("Message: 603, Loading in Rebook:", jobData.rebook);
        } catch (error) {
          console.log("Error parsing Rebook:", error);
        }
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