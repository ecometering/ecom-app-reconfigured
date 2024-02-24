import React, { useEffect,useState,useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';

const  MeterGatewayScreen= () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {pageRoute} = route.params;
    const {  jobType,meterDetails } = useContext(AppContext);
    console.log("MeterGatewayScreen",meterDetails);
    console.log("MeterGatewayScreen",jobType);
    const [isCorrector,SetIsCorrector] = useState(meterDetails?.isCorrector );
    const [isAmr,SetIsAmr] = useState(meterDetails?.isAmr );
    const [metertype, setType] = useState(meterDetails?.type);
    const [pressureTier, setPressureTier] = useState(meterDetails?.pressureTier);
    const diaphragmMeterTypes = ['1', '2', '4'];

console.log(" Meter gateway screen",type,pressureTier,isCorrector,isAmr);
    useEffect(() => {
        console.log('CorrectorGatewayScreen Mounted');
        // Enhanced conditional logic
        navigateBasedOnJobType();
      }, [isCorrector, isAmr, pressureTier,meterType, navigation, jobType]);
  
      
  
            function navigateBasedOnJobType() {
              switch (jobType) {
                  case "Install":
                    if (pageRoute ===1){
                        cosole.log("MeterGatewayScreen",pageRoute); 
                        if (meterType.value === '1' || meterType.value === '2' || meterType.value === '4') {
                            navigation.replace('NewMeterDataBadge');
                        } else {
                            navigation.replace('NewMeterIndex');
                        }
                    }
                    if (pageRoute ===2){
                        if (isCorrector===true){
                            navigation.replace('CorrectorDetails');
                        } else if (isAmr===true){
                            navigation.replace('DataLoggerDetails');
                        }}

                    if (isAmr) {
                      navigation.replace('DataLoggerDetails');
                  } else if (isMeter) {
                      // Assuming setAndSeal is a function that determines the next screen based on meter type and pressure
                      // This placeholder should be replaced with actual logic to determine the next step in the set and seal process
                      const nextScreen = setAndSeal(meterDetails?.meterType, meterDetails?.meterPressure);
                      navigation.replace(nextScreen);
                  } else {
                      navigation.replace('StandardPage');}
                  
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

}
export default MeterGatewayScreen;