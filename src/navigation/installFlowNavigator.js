import GenericPhotoPage from "../screens/jobs/GenericPhotoPage";
import CorrectorDetailsPage from "../screens/jobs/CorrectorDetailsPage";
import DataLoggerDetailsPage from "../screens/jobs/DataLoggerDetailsPage";
import MeterDetailsPage from "../screens/jobs/MeterDetailsPage";
import StreamsSetSealDetailsPage from "../screens/jobs/StreamsSetSealDetailsPage";
import RegulatorPage from "../screens/jobs/RegulatorPage";
import ChatterBoxPage from "../screens/jobs/ChatterBoxPage";
import AdditionalMaterialPage from "../screens/jobs/AdditionalMaterialPage";
import { AppContext } from "../context/AppContext";
import React, { useState, useEffect } from "react";

import { createStackNavigator } from "@react-navigation/stack";


const Stack = createStackNavigator();

const assetSelection = ({ meter, corrector, datalogger }) => {
  if (meter) return 'MeterDetails';
  if (corrector) return 'CorrectorDetails';
  if (datalogger) return 'DataLoggerDetails';
  throw new Error('At least one asset must be selected.');
};

// Simplified meter badge logic
const meterBadge = (meterType) => meterType === 'Diaphragm' ? 'MeterIndex' : 'MeterDataBadge';

// Refactored Set and Seal logic based on meterType and meterPressure
const setAndSeal = (meterType, meterPressure) => {
  if (meterType === 'Diaphragm' && meterPressure === 'Medium') return 'StreamsSetSealDetails';
  return meterType === 'Diaphragm' ? 'Regulator' : 'StreamsSetSealDetails';
};

const nextAfterMeterPhoto = ({ corrector, datalogger, meterType, meterPressure }) => {
  if (corrector && datalogger) return 'CorrectorDetails';
  if (corrector) return 'CorrectorDetails';
  if (datalogger) return 'DataLoggerDetails';
  return setAndSeal(meterType, meterPressure);
};

// Determine next after CorrectorDetails
const nextAfterCorrector = ({ datalogger, meter, meterType, meterPressure }) => {
  if (datalogger) {
    return 'DataLoggerDetails'; // Navigate to DataLogger if true
  } else if (meter) {
    return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
  } else {
    return 'StandardsNavigation'; // Fallback to StandardsNavigation
  }
};

// Function to determine the next page from DataLoggerDetails
const nextAfterDataLogger = ({ meter, meterType, meterPressure }) => {
  if (meter) {
    return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
  } else {
    return 'StandardsNavigation'; // Fallback to StandardsNavigation
  }
};



const InstallFlowNavigator = () => {
  const appContext = useContext(AppContext);
  const meterType = appContext.meterDetails?.type;
  const meterPressure = appContext.meterDetails?.pressure; 
  <Stack.Navigator > 
    <Stack.Screen name="AssetTypeSelectionPage" component={AssetTypeSelectionPage} initialParams={{title:'Assets being installed',nextScreen: ()=>assetSelection(meter,corrector,datalogger)}} />
    
    {/* meter process */}
    <Stack.Screen name="MeterDetails" component={MeterDetailsPage}
    initialParams={{title: 'New Meter Details',nextScreen: NewEcvToMov
    }}  />  
    <Stack.Screen 
        key = "NewEcvToMov"
        name="NewEcvToMov"
        component ={GenericPhotoPage} 
        initialParams={{title: 'New ECV to MOV',
         photoKey: 'NewEcvToMov',nextScreen:()=>meterBadge(meterType)}}
    />
    
    
    <Stack.Screen 
    key = "MeterDataBadge"
    name ="MeterDataBadge" 
    component={GenericPhotoPage}
    initialParams={{
        title: 'New Meter data badge',
        photoKey: 'MeterDataBadge',
        nextScreen:'MeterIndex'}} />
   
    <Stack.Screen 
    key = "MeterIndex"
    name="MeterIndex"
     component= {MeterDetailsPage}
        initialParams={{title: 'New Meter index',photoKey: 'MeterIndex',nextScreen:'NewMeterPhoto'}}
         />

    <Stack.Screen
    key = "NewMeterPhoto"
    name="NewMeterPhoto"
    component={GenericPhotoPage}
    initialParams={{title: 'New Meter photo',photoKey: 'NewMeterPhoto',nextScreen:()=>nextAfterMeterPhoto(corrector,datalogger,meterType,meterPressure)}} 
    
    />
    {/* DataLogger process */}
    <Stack.Screen name="DataLoggerDetails" component={DataLoggerDetailsPage} initialParams={{title:'New AMR installed',nextScreen:()=> nextAfterDataLogger}}/>
    {/*  Corrector Process */}
    <Stack.Screen name ="CorrectorDetails" component={CorrectorDetailsPage} initialParams={{title: 'New Corrector installed',nextScreen:()=>nextAfterCorrector}} />
    
    {/* set and seal process */}
    <Stack.Screen name="StreamsSetSealDetails" component={StreamsSetSealDetailsPage} />
    {/* regulator process */}
    <Stack.Screen name="Regulator" component={RegulatorPage} />
    <Stack.Screen name="ChatterBox" component={ChatterBoxPage} />
    <Stack.Screen name="CorrectorDetails" component={CorrectorDetailsPage} />
    <Stack.Screen name="AdditionalMaterial" component={AdditionalMaterialPage} />
  </Stack.Navigator>

};

export default InstallFlowNavigator;