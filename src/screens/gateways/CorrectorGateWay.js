import React, { useEffect,useState,useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';

const  CorrectorGatewayScreen= () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { pageRoute } = route.params || {};
    const {  jobType,meterDetails } = useContext(AppContext);
    console.log("CorrectorGatewayScreen",meterDetails);
    console.log("CorrectorGatewayScreen",jobType);
    const [isCorrector,SetIsCorrector] = useState(meterDetails?.isCorrector );
    const [isAmr,SetIsAmr] = useState(meterDetails?.isAmr );
    const [isMeter,SetIsMeter] = useState(meterDetails?.isMeter );
    const {meterType,pressureTier} = meterDetails;
  
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
                    }else if (isMeter)
                    {
                      if ((Type === '1' || Type === '2' || Type === '4') && pressureTier === 'MP' || (Type !== '1' && Type !== '2' && Type !== '4')) {
                        navigation.replace('StreamsSetSealDetails');
                    }
                
                  }else {
                    navigation.replace('StandardPage');
                  }
                  
                      break;
                  case "Maintenance":
                    const nextAfterCorrectorMaintenance = ({ datalogger, meter, meterType, meterPressure }) => {
                      if (datalogger) {
                       navigation.replace('ExistingDataLoggerDetails'); // Navigate to DataLogger if true
                      } else if (meter) {
                        navigation.replace('StreamsSetSealDetails') // Use setAndSeal logic if meter is present
                      } else {
                        navigation.replace('MaintenanceQuestions'); // Fallback to maintenance questions 
                      }
                    };
                      // Add specific logic for Maintenance job type
                      break;
                  case "Removal":
                    if (datalogger) {
                      navigation.replace('RemovedDataLoggerDetails'); // Navigate to DataLogger if true
                    // Use setAndSeal logic if meter is present
                    } else {
                      navigation.replace('StandardPage'); // Fallback to StandardsNavigation
                    }
                      break;
                  case "Survey":
                    
                      if (isAmr) {
                        navigation.replace('ExistingDataLoggerDetails');
                      }else if (isMeter)
                      {
                        if ((meterType.value === '1' || meterType.value === '2' || meterType.value === '4') && pressureTier === 'MP' || (meterType.value !== '1' && meterType.value !== '2' && meterType.value !== '4')) {
                          navigation.replace('StreamsSetSealDetails');
                      }
                  
                    }else {
                      navigation.replace('StandardPage');
                    }
                    
                    
                      // Add specific logic for Survey job type
                      break;
                  case "Warant":
                    if (datalogger) {
                      navigation.replace('RemovedDataLoggerDetails'); // Navigate to DataLogger if true
                    // Use setAndSeal logic if meter is present
                    } else {
                      navigation.replace('StandardPage'); // Fallback to StandardsNavigation
                    }

                  break;
                  case "exchange":
                  if (pageRoute===1){
                    if (isAmr) {
                      navigation.replace('DataLoggerDetails');
                    }else {
                      navigation.replace('AssetSelectGatewayScreenFinal');
                    }
                  
                    }else if (pageRoute === 2) {
                      if (isAmr) {
                        navigation.replace('DataLoggerDetails');
                      }else if (isMeter)
                      {
                        if ((meterType.value === '1' || meterType.value === '2' || meterType.value === '4') && pressureTier === 'MP' || (meterType.value !== '1' && meterType.value !== '2' && meterType.value !== '4')) {
                          navigation.replace('StreamsSetSealDetails');
                      }
                  
                    }else {
                      navigation.replace('StandardPage');
                    }
                    }
                  break;
                  // Add more cases for different jobTypes if needed
                  default:
                      // Default case if jobType is not recognized
                      console.log('Job type not recognized, staying on the current screen or navigating to a default screen.');
                      break;
              }
          }

}
export default CorrectorGatewayScreen;