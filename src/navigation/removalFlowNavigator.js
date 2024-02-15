import GenericPhotoPage from "../screens/jobs/GenericPhotoPage";
import CorrectorDetailsPage from "../screens/jobs/CorrectorDetailsPage";
import DataLoggerDetailsPage from "../screens/jobs/DataLoggerDetailsPage";
import MeterDetailsPage from "../screens/jobs/MeterDetailsPage";
import AssetTypeSelectionPage from "../screens/jobs/AssetTypeSelectionPage";
import AdditionalMaterialPage from "../screens/jobs/AdditionalMaterialPage";
import { AppContext } from "../context/AppContext";
import React, { useState, useEffect,useContext } from "react";
import RemovalGatewayScreen from "../screens/gateways/removalGateWay";

import { createStackNavigator } from "@react-navigation/stack";


const Stack = createStackNavigator();

const assetSelection = ({ meter, corrector, datalogger }) => {
    if (meter) return 'RemovedMeterDetails';
    if (corrector) return 'RemovedCorrectorDetails';
    if (datalogger) return 'RemovedDataLoggerDetails';
    throw new Error('At least one asset must be selected.');
  };
  
  // Simplified meter badge logic
  const meterBadge = (meterType) => meterType === 'Diaphragm' ? 'RemovedMeterIndex' : 'RemovedMeterDataBadge';

  const nextAfterMeterPhoto = ({ corrector, datalogger }) => {
    if (corrector && datalogger) return 'RemovedCorrectorDetails';
    if (corrector) return 'RemovedCorrectorDetails';
    if (datalogger) return 'RemovedDataLoggerDetails';
    return 'StandardPage';
  };

  const nextAfterCorrector = ({ datalogger, }) => {
    if (datalogger) {
      return 'RemovedDataLoggerDetails'; // Navigate to DataLogger if true
    // Use setAndSeal logic if meter is present
    } else {
      return 'StandardPage'; // Fallback to StandardsNavigation
    }
  };
  const RemovalFlowNavigator = () => {
    const appContext = useContext(AppContext);
    const meterType = appContext.meterDetails?.type;
return(
    <Stack.Navigator > 
    <Stack.Screen name="AssetTypeSelectionPage" component={AssetTypeSelectionPage} initialParams={{title:'Assets being Removed',nextScreen:'RemovedGateway'}} />
    <stack.Screen name="RemovedGateway" component={RemovalGatewayScreen} />
    <Stack.Screen name="RemovedMeterDetails" component={MeterDetailsPage} initialParams={{title:' Removed Meter Details',nextScreen: ()=>meterBadge(meterType)}} />
    <Stack.Screen 
    key = "RemovedMeterDataBadge"
    name ="RemovedMeterDataBadge" 
    component={GenericPhotoPage}
    initialParams={{
        title: 'Removed Meter data badge',
        photoKey: 'RemovedMeterDataBadge',
        nextScreen:'RemovedMeterIndex'}} />
   
    <Stack.Screen 
    key = "MeterIndex"
    name="RemovedMeterIndex"
     component= {MeterDetailsPage}
        initialParams={{title: 'Removed Meter index',photoKey: 'RemovedMeterIndex',nextScreen:'RemovedMeterPhoto'}}
         />

    <Stack.Screen
    key = "RemovedMeterPhoto"
    name="RemovedMeterPhoto"
    component={GenericPhotoPage}
    initialParams={{title: 'Removed Meter photo',photoKey: 'RemovedMeterPhoto',nextScreen:'EcvPhoto'}} />
    <Stack.Screen Key = "EcvPhoto" name = "EcvPhoto" component = {GenericPhotoPage} initialParams={{title: 'Ecv Photo',photoKey: 'EcvPhoto',nextScreen:()=>nextAfterMeterPhoto(corrector,datalogger)}} />
    
    <Stack.Screen name="AdditionalMaterial" component={AdditionalMaterialPage} initialParams={{title: 'Additional Material',nextScreen:()=>nextAfterCorrector(datalogger)}} />
    <Stack.Screen name="RemovedCorrectorDetails" component={CorrectorDetailsPage} initialParams={{title: ' Removed Corrector Details',nextScreen:()=>nextAfterCorrector(datalogger)}} />
    <Stack.Screen name="RemovedDataLoggerDetails" component={DataLoggerDetailsPage} initialParams={{title:'Removed AMR ',nextScreen:()=> 'StandardPage'}} />
</Stack.Navigator>
    
    
  );};

  export default RemovalFlowNavigator;
  // Function to determine the next page from DataLoggerDetails
  