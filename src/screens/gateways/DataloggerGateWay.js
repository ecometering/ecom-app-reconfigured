import React, { useEffect,useState,useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';

const  DataloggerGatewayScreen= () => {
    const navigation = useNavigation();
    const route = useRoute();
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
                    if (isMeter)
                    {
                      if ((Type === '1' || Type === '2' || Type === '4') && pressureTier === 'MP' || (Type !== '1' && Type !== '2' && Type !== '4')) {
                        navigation.replace('StreamsSetSealDetails');
                    }
                
                  }else {
                    navigation.replace('StandardPage');
                  };
                  
                      break;
                  case "Maintenance":
                    if (isMeter)
                    {
                      if ((Type === '1' || Type === '2' || Type === '4') && pressureTier === 'MP' || (Type !== '1' && Type !== '2' && Type !== '4')) {
                        navigation.replace('StreamsSetSealDetails');
                    }
                
                  }else {
                    navigation.replace('MaintenanceQuestions');
                  
                    };
                      // Add specific logic for Maintenance job type
                      break;
                  case "Removal":
                    navigation.replace('StandardPage'); // Fallback to StandardsNavigation
                      break;
                      case "Survey":
                        console.log('Survey job type detected, navigating to the next screen.');
                        if (isMeter) {
                          if ((meterType.value === '1' || meterType.value === '2' || meterType.value === '4') && pressureTier === 'MP') {
                            navigation.replace('StreamsSetSealDetails');
                          } else {
                            navigation.replace('StandardPage');
                          }
                        } else {
                          navigation.replace('StandardPage');
                        }
                        break;
                  case "Warant":
                    navigation.replace('StandardPage'); // Fallback to StandardsNavigation

                  break;
                  case "exchange":
                    if (isMeter)
                    {
                      if ((meterType.value === '1' || meterType.value === '2' || meterType.value === '4') && pressureTier === 'MP' || (meterType.value !== '1' && meterType.value !== '2' && meterType.value !== '4')) {
                        navigation.replace('StreamsSetSealDetails');
                    }
                
                  }else {
                    navigation.replace('StandardPage');
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
export default DataloggerGatewayScreen;