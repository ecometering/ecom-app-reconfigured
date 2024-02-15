import React, { useEffect,useState,useContext } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppContext } from '../../context/AppContext';


const RemovalGatewayScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const {  meterDetails } = useContext(AppContext);

    // const { isMeter, isCorrector, isAmr } = route.params 
    const [isMeter, setIsMeter] = useState(meterDetails?.isMeter );
    const [isAmr, setIsAmr] = useState(meterDetails?.isAmr );
    const [isCorrector, setIsCorrector] = useState(meterDetails?.isCorrector );// Default to an empty object
console.log(" gateway screen",isMeter,isCorrector,isAmr);
    useEffect(() => {
        console.log('InstallGatewayScreen Mounted');
        // Enhanced conditional logic
        if (isMeter) {
            navigation.replace('RemovedMeterDetails');
        } else if (isCorrector) {
            navigation.replace('RemovedCorrectorDetails');
        } else if (isAmr) {
            navigation.replace('RemovedDataLoggerDetails');
        } else {
            // Add a default navigation or error handling if needed
            console.log('No conditions met, staying on the current screen or navigating to a default screen.');
            // navigation.replace('SomeDefaultScreen');
        }
    }, [isCorrector, isAmr, isMeter, navigation]);

    return null; // This component does not render anything
};

export default RemovalGatewayScreen;
