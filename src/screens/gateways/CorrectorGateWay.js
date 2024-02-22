import React, { useEffect,useState,useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';

const  CorrectorGatewayScreen= () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {  jobType,meterDetails } = useContext(AppContext);
    console.log("CorrectorGatewayScreen",meterDetails);
    console.log("CorrectorGatewayScreen",jobType);
    const [isCorrector,SetIsCorrector] = useState(meterDetails?.isCorrector );
    const [isAmr,SetIsAmr] = useState(meterDetails?.isAmr );
    const [isMeter,SetIsMeter] = useState(meterDetails?.isMeter );
console.log(" gateway screen",isMeter,isCorrector,isAmr);
    useEffect(() => {
        console.log('CorrectorGatewayScreen Mounted');
        // Enhanced conditional logic
        navigateBasedOnJobType();
      }, [isCorrector, isAmr, isMeter, navigation, jobType]);
  
      
  
            function navigateBasedOnJobType() {
              switch (jobType) {
                  case "Install":
                    if (isAmr) {
                      navigation.replace('DataLoggerDetails');
                  } else if (isMeter) {
                      // Assuming setAndSeal is a function that determines the next screen based on meter type and pressure
                      // This placeholder should be replaced with actual logic to determine the next step in the set and seal process
                      const nextScreen = setAndSeal(meterDetails?.meterType, meterDetails?.meterPressure);
                      navigation.replace(nextScreen);
                  } else {
                      navigation.replace('Standards');}
                  
                      break;
                  case "Maintenance":
                    const nextAfterCorrectorMaintenance = ({ datalogger, meter, meterType, meterPressure }) => {
                      if (datalogger) {
                        return 'ExistingDataLoggerDetails'; // Navigate to DataLogger if true
                      } else if (meter) {
                        return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
                      } else {
                        return 'MaintenanceQuestions'; // Fallback to maintenance questions 
                      }
                    };
                      // Add specific logic for Maintenance job type
                      break;
                  case "Removal":
                    if (datalogger) {
                      return 'RemovedDataLoggerDetails'; // Navigate to DataLogger if true
                    // Use setAndSeal logic if meter is present
                    } else {
                      return 'StandardPage'; // Fallback to StandardsNavigation
                    }
                      break;
                  case "Survey":
                    const nextAfterCorrector = ({ datalogger, meter, meterType, meterPressure }) => {
                      if (datalogger) {
                        return 'ExistingDataLoggerDetails'; // Navigate to DataLogger if true
                      } else if (meter) {
                        return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
                      } else {
                        return 'StandardPage'; // Fallback to StandardsNavigation
                      }
                    };
                    
                      // Add specific logic for Survey job type
                      break;
                  case "Warant":
                    if (datalogger) {
                      return 'RemovedDataLoggerDetails'; // Navigate to DataLogger if true
                    // Use setAndSeal logic if meter is present
                    } else {
                      return 'StandardPage'; // Fallback to StandardsNavigation
                    }

                  break;
                  case "exchange":
                  
                  break;
                  // Add more cases for different jobTypes if needed
                  default:
                      // Default case if jobType is not recognized
                      console.log('Job type not recognized, staying on the current screen or navigating to a default screen.');
                      break;
              }
          }
const nextAfterCorrector = ({ isAmr, isMeter, meterType, meterPressure }) => {
    if (isAmr) {
      return 'DataLoggerDetails'; // Navigate to DataLogger if true
    } else if (isMeter) {
      return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
    } else {
      return 'StandardPage'; // Fallback to StandardsNavigation
    }
  };

  const nextAfterMeterPhoto = ({ isCorrector, isAmr, meterType, meterPressure }) => {
    if (isCorrector && isAmr) return 'CorrectorDetails';
    if (isCorrector) return 'CorrectorDetails';
    if (isAmr) return 'DataLoggerDetails';
    return setAndSeal(meterType, meterPressure);
  };
}
export default CorrectorGatewayScreen;