import React, { useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';

const AssetSelectGatewayScreen = () => {
    const navigation = useNavigation();
    const { jobType, meterDetails } = useContext(AppContext);

    // Log for debugging purposes
    console.log("Unified gateway screen", meterDetails);

    useEffect(() => {
        console.log('UnifiedGatewayScreen Mounted');

        switch (jobType) {
            case 'Install':
                if (meterDetails?.isMeter) {
                    navigation.replace('NewMeterDetails');
                } else if (meterDetails?.isCorrector) {
                    navigation.replace('NewCorrectorDetails');
                } else if (meterDetails?.isAmr) {
                    navigation.replace('NewDataLoggerDetails');
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
            case 'Survey':
            case 'Exchange':
                // Assuming you have specific screens for these job types
                if (meterDetails?.isMeter) {
                    navigation.replace('ExistingMeterDetails'); // Adjust screen names as needed
                } else if (meterDetails?.isCorrector) {
                    navigation.replace('ExistingCorrectorDetails');
                } else if (meterDetails?.isAmr) {
                    navigation.replace('ExistingDataLoggerDetails');
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
