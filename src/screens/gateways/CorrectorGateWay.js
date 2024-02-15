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
        if (isMeter) {
            navigation.replace('MeterDetails');
        } else if (isCorrector) {
            navigation.replace('CorrectorDetails');
        } else if (isAmr) {
            navigation.replace('DataLoggerDetails');
        } else {
            // Add a default navigation or error handling if needed
            console.log('No conditions met, staying on the current screen or navigating to a default screen.');
            // navigation.replace('SomeDefaultScreen');
        }
    }, [isCorrector, isAmr, isMeter, navigation]);

    return null; // This component does not render anything
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