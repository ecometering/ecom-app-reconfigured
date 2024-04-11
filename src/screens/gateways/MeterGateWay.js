import React, { useEffect,useState,useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';

const  MeterGatewayScreen= () => {
    console.log("MeterGatewayScreen we begin");
    const navigation = useNavigation();
    const {params}= useRoute();
    const { pageRoute, pageflow } = params;
    const route = useRoute();
    console.log("params",params);
    const {  jobType,meterDetails,updateVisitCount, visitCounts } = useContext(AppContext);
    console.log("meter details:",meterDetails);
    console.log("job type:",jobType);
    const [isCorrector,SetIsCorrector] = useState(meterDetails?.isCorrector );
    const [isAmr,SetIsAmr] = useState(meterDetails?.isAmr );
    const [Type, setType] = useState(meterDetails?.type.value);
    const [pressureTier, setPressureTier] = useState(meterDetails?.pressureTier.label);
    const diaphragmMeterTypes = ['1', '2', '4'];
console.log(" type,pressure and true or false:",Type,pressureTier,isCorrector,isAmr);
    useEffect(() => {
        // Enhanced conditional logic
        navigateBasedOnJobType();
      }, [isCorrector, isAmr, pressureTier,Type, jobType,pageflow,pageRoute]);


    // Determine pageRoute based on visitCounts
  
            function navigateBasedOnJobType() {
            
            console.log(`Navigating for jobType: ${jobType}, pageFlow: ${pageflow}`);
              switch (jobType) {
                  case "Install":
                    console.log ("starting install job",pageflow);
                    if (pageflow ===1){
                        console.log("MeterGatewayScreen",pageflow); 
                        if (!['1', '2', '4'].includes(Type)) {
                          navigation.replace('MeterDataBadge');
                      } else {
                            console.log("Navigating to MeterIndex");
                            navigation.replace('MeterIndex');
                        }

                    }
                    if (pageflow ===2){
                        if (isCorrector===true){
                            navigation.replace('CorrectorDetails');
                        }else if (isAmr) {
                            navigation.replace('DataLoggerDetails');
                          }else if ((Type === '1' || Type === '2' || Type === '4') && pressureTier === 'MP' || (Type !== '1' && Type !== '2' && Type !== '4')) {
                              navigation.replace('StreamsSetSealDetails');
                          }
                      
                        else {
                          navigation.replace('StandardPage');
                        }

                    }

                    
                  
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
                    console.log("MeterGatewayScreen begining removal job",pageRoute);
                    if (pageRoute ===1){
                        console.log("MeterGatewayScreen",pageRoute); 
                        if (Type === '1' || Type === '2' || Type === '4') {
                            navigation.replace('RemovedMeterDataBadge');
                        } else {
                            navigation.replace('RemovedMeterIndex');
                        }

                    }
                    else {
                        console.log("MeterGatewayScreen",pageRoute);
                        if (isCorrector===true){
                            navigation.replace('CorrectorDetails');
                        } else if (isAmr===true){
                            navigation.replace('DataLoggerDetails');
                        }else{
                            navigate.replace('StandardPage')
                    }
                };
                    break;
                  case "Survey":
                   
                    
                      // Add specific logic for Survey job type
                      break;
                  case "Warant":
                    console.log("MeterGatewayScreen begining warant job",pageRoute);
                    if (pageRoute ===1){
                        console.log("MeterGatewayScreen",pageRoute); 
                        if (Type === '1' || Type === '2' || Type === '4') {
                            navigation.replace('RemovedMeterDataBadge');
                        } else {
                            navigation.replace('RemovedMeterIndex');
                        }

                    }

                  break;
                  case "Exchange":
                    console.log("MeterGatewayScreen begining exchange job",pageRoute);
                    if (pageRoute === 1) {
                        if (pageflow === 1) {
                            console.log("Navigating to Screen 1 of Flow 1");
                            if (Type === '1' || Type === '2' || Type === '4') {
                                navigation.replace('ExistingMeterDataBadge');
                            } else {
                                navigation.replace('ExistingMeterIndex');
                            }
    
                        } else if (pageflow === '2') {
                            // Navigate to the first screen of the second flow
                            console.log("Navigating to Screen 1 of Flow 2");
                            if (corrector) {
                                navigation.navigate('ExistingCorrectorDetails');
                              } else if (datalogger) {
                                navigation.navigate('ExistingDataLoggerDetails');
                              } else {
                                navigation.navigate('NewScreen'); // Replace 'NewScreen' with the actual screen name you want to navigate to
                              }
                            
                            // Example: navigateToScreen1Flow2();
                        } else {
                            console.log("Invalid page flow for route 1, navigating to default.");
                            // Example: navigateToDefaultScreen();
                        }
                    } else if (pageRoute === '2') {
                        if (pageflow === '1') {
                            
                            console.log("Navigating to Screen 1 of Flow 1 in Route 2");
                            if (Type === '1' || Type === '2' || Type === '4') {
                                navigation.replace('InstalledMeterDataBadge');
                            } else {
                                navigation.replace('InstalledMeterIndex');
                            }
    
                        } else if (pageflow === '2') {
                            // Navigate to the first screen of the second flow in the second route
                            console.log("Navigating to Screen 1 of Flow 2 in Route 2");
                            if(isCorrector){
                                navigation.replace('InstalledCorrectorDetails');
                            }else if (isAmr) {
                                navigation.replace('InstalledDataLoggerDetails');
                              }else if (isMeter)
                              {
                                if ((Type === '1' || Type === '2' || Type === '4') && pressureTier === 'MP' || (Type !== '1' && Type !== '2' && Type !== '4')) {
                                  navigation.replace('StreamsSetSealDetails');
                              }
                          
                            }else {
                              navigation.replace('StandardPage');
                            }
                            // Example: navigateToScreen1Flow2Route2();
                        } else {
                            console.log("Invalid page flow for route 2, navigating to default.");
                            // Example: navigateToDefaultScreenRoute2();
                        }
                    } else {
                        console.log("Invalid page route, navigating to a general default screen.");
                        // Example: navigateToGeneralDefaultScreen();
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
       
export default MeterGatewayScreen;