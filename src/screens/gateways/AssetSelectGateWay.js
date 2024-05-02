import React, { useEffect, useContext } from 'react';
import { useNavigation,useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';

const AssetSelectGatewayScreen = () => {
    const navigation = useNavigation();
    const { jobType, meterDetails } = useContext(AppContext);
    const route = useRoute();
    const {  pageFlow } = route.params;
    console.log("Asset select pageFlow",pageFlow);
    // Log for debugging purposes
    console.log("Unified gateway screen", meterDetails);

    useEffect(() => {
        console.log('UnifiedGatewayScreen Mounted');

        switch (jobType) {
            case 'Install':
                if (meterDetails?.isMeter) {
                    navigation.replace('MeterDetails');
                } else if (meterDetails?.isCorrector) {
                    navigation.replace('CorrectorDetails');
                } else if (meterDetails?.isAmr) {
                    navigation.replace('DataLoggerDetails');
                }
                break;
            case 'Removal':
                if (meterDetails?.isMeter) {
                    navigation.replace('RemovedMeterDetails');
                } else if (meterDetails?.isCorrector) {
                    navigation.replace('RemovedCorrectorDetails');
                } else if (meterDetails?.isAmr) {
                    navigation.replace('RemovedDataLoggerDetails');
                }
                break;
            case 'Maintenance':
                if (meterDetails?.isMeter) {
                    navigation.replace('ExistingMeterDetails');
                } else if (meterDetails?.isCorrector) {
                    navigation.replace('ExistingCorrectorDetails');
                } else if (meterDetails?.isAmr) {
                    navigation.replace('ExistingDataLoggerDetails');
                }
                break;
            case 'Survey':
                if (meterDetails?.isMeter) {
                    navigation.replace('ExistingMeterDetails');
                } else if (meterDetails?.isCorrector) {
                    navigation.replace('ExistingCorrectorDetails');
                } else if (meterDetails?.isAmr) {
                    navigation.replace('ExistingDataLoggerDetails');
                }
                break;
            case 'Exchange':
                if (pageFlow === 1) {
                    // Page flow 1 navigation logic
                    if (meterDetails?.isMeter) {
                        navigation.replace('ExistingMeterDetails'); // Adjust screen names as needed for page flow 1
                    } else if (meterDetails?.isCorrector) {
                        navigation.replace('ExistingCorrectorDetails');
                    } else if (meterDetails?.isAmr) {
                        navigation.replace('ExistingDataLoggerDetails');
                    }
                } else if (pageFlow === 2) {
                    // Page flow 2 navigation logic
                    // Assuming different screens or logic for page flow 2
                    if (meterDetails?.isMeter) {
                        navigation.replace('InstalledMeterDetailsScreen'); // Example replacement for page flow 2
                    } else if (meterDetails?.isCorrector) {
                        navigation.replace('InstalledCorrectorDetailsScreen');
                    } else if (meterDetails?.isAmr) {
                        navigation.replace('InstalledDataLoggerDetailsScreen');
                    }
                }
                break;
            default:
                console.log('No conditions met, staying on the current screen or navigating to a default screen.');
                // Optionally navigate to a default or error screen
                // navigation.replace('SomeDefaultScreen');
                break;
        }
    }, [jobType, meterDetails, navigation]);

    return null; // This component does not render anything
};

export default AssetSelectGatewayScreen;