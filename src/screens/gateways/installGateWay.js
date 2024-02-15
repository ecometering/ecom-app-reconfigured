import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';

const InstallGatewayScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { isMeter, isCorrector, isAmr } = route.params || {}; // Default to an empty object

    useEffect(() => {
        console.log('InstallGatewayScreen Mounted');
        // Conditional navigation logic
        if (isMeter) {
            navigation.replace('MeterDetails');
        } else if (isCorrector) {
            navigation.replace('CorrectorDetails');
        } else {
            navigation.replace('DataLoggerDetails');
        } 
    }, [isCorrector, isAmr, isMeter, navigation]);

    return null; // This component does not render anything
};

export default InstallGatewayScreen;
