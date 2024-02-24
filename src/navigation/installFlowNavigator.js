import GenericPhotoPage from "../screens/jobs/GenericPhotoPage";
import CorrectorDetailsPage from "../screens/jobs/CorrectorDetailsPage";
import DataLoggerDetailsPage from "../screens/jobs/DataLoggerDetailsPage";
import MeterDetailsPage from "../screens/jobs/MeterDetailsPage";
import StreamsSetSealDetailsPage from "../screens/jobs/StreamsSetSealDetailsPage";
import RegulatorPage from "../screens/jobs/RegulatorPage";
import ChatterBoxPage from "../screens/jobs/ChatterBoxPage";
import AdditionalMaterialPage from "../screens/jobs/AdditionalMaterialPage";
import AssetTypeSelectionPage from "../screens/jobs/AssetTypeSelectionPage";

import SlamshutPage from "../screens/jobs/SlamshutPage";
import WaferCheckPage from "../screens/jobs/WaferCheckPage";
import ReliefRegulatorPage from "../screens/jobs/ReliefRegulatorPage";
import ActiveRegulatorPage from "../screens/jobs/ActiveRegulatorPage";
import FilterPage from "../screens/jobs/FilterPage";
import { AppContext } from "../context/AppContext";
import React, { useState, useEffect, useContext,createContext } from "react";

// import gateways 
import InstallGatewayScreen from "../screens/gateways/installGateWay";
import CorrectorGateway from "../screens/gateways/CorrectorGateWay";


import { createStackNavigator } from "@react-navigation/stack";


const Stack = createStackNavigator();





// Simplified meter badge logic
const meterBadge = (meterType) => meterType === 'Diaphragm' ? 'MeterIndex' : 'MeterDataBadge';

// Refactored Set and Seal logic based on meterType and meterPressure
const setAndSeal = (meterType, meterPressure) => {
  if (meterType === 'Diaphragm' && meterPressure === 'Medium') return 'StreamsSetSealDetails';
  return meterType === 'Diaphragm' ? 'Regulator' : 'StreamsSetSealDetails';
};

const nextAfterMeterPhoto = ({ isCorrector, isAmr, meterType, meterPressure }) => {
  if (isCorrector && isAmr) return 'CorrectorDetails';
  if (isCorrector) return 'CorrectorDetails';
  if (isAmr) return 'DataLoggerDetails';
  return setAndSeal(meterType, meterPressure);
};

// Determine next after CorrectorDetails
const nextAfterCorrector = ({ isAmr, isMeter, meterType, meterPressure }) => {
  if (isAmr) {
    return 'DataLoggerDetails'; // Navigate to DataLogger if true
  } else if (isMeter) {
    return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
  } else {
    return 'StandardPage'; // Fallback to StandardsNavigation
  }
};

// Function to determine the next page from DataLoggerDetails
const nextAfterDataLogger = ({ isMeter, meterType, meterPressure }) => {
  if (isMeter) {
    return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
  } else {
    return 'StandardPage'; // Fallback to StandardsNavigation
  }
};

const generateScreenInstancesForStreams = (numberOfStreams) => {
  let screens = [];
  for (let i = 0; i < numberOfStreams; i++) {
    // Dynamically generate screen names with stream index
    const streamScreens = [
      { name: `FilterPage-${i}`, component: FilterPage, title: `Filter ${i + 1}` },
      { name: `SlamshutPage-${i}`, component: SlamshutPage, title: `Slamshut ${i + 1}` },
      { name: `ActiveRegulatorPage-${i}`, component: ActiveRegulatorPage, title: `Active Regulator ${i + 1}` },
      { name: `ReliefRegulatorPage-${i}`, component: ReliefRegulatorPage, title: `Relief Regulator ${i + 1}` },
      { name: `WaferCheckPage-${i}`, component: WaferCheckPage, title: `Wafer Check ${i + 1}` },
    ];
    screens = screens.concat(streamScreens);
  }
  return screens;
};

const getNextScreen = (currentScreenName, numberOfStreams) => {
  // Extract stream index and screen part from the current screen name
  const match = currentScreenName.match(/(\D+)-(\d+)/);
  if (!match) return 'RegulatorPage'; // Fallback to RegulatorPage

  const [, screenPart, index] = match;
  const streamIndex = parseInt(index, 10);
  const screenOrder = ['FilterPage', 'SlamshutPage', 'ActiveRegulatorPage', 'ReliefRegulatorPage', 'WaferCheckPage'];
  const currentScreenIndex = screenOrder.indexOf(screenPart);
  const nextScreenIndex = currentScreenIndex + 1;

  // Check if it's the last screen of the current stream
  if (nextScreenIndex >= screenOrder.length) {
    // If it's the last stream, navigate to RegulatorPage; otherwise, start the next stream
    return streamIndex + 1 < numberOfStreams ? `${screenOrder[0]}-${streamIndex + 1}` : 'RegulatorPage';
  } else {
    return `${screenOrder[nextScreenIndex]}-${streamIndex}`;
  }
};

 
const InstallFlowNavigator = () => {
  
  const {numberOfStreams, meterDetails = {}} = useContext(AppContext);
  // const {isMeter, isCorrector, isAmr} = meterDetails;
   
  const { isAmr = false, isCorrector = false, isMeter = false } = meterDetails || {};
 

 const determineFirstScreen = () => {
  if (isMeter) return 'MeterDetails';
  if (isCorrector) return 'CorrectorDetails';
  if (isAmr) return 'DataLoggerDetails';
 

 };
  const meterType = meterDetails?.type || "";
  const meterPressure = meterDetails?.pressure || "";
  console.log ("meterDetails", meterDetails)

  
  console.log ("loading install flow navigator with ", numberOfStreams, " streams");

 return(
 <Stack.Navigator> 
    <Stack.Screen name="AssetTypeSelectionPage" component={AssetTypeSelectionPage} initialParams={{title:'Assets being installed',nextScreen: 'InstallGatewayScreen' }} />
    <Stack.Screen name="InstallGatewayScreen" component={InstallGatewayScreen} />
    {/* meter process */}
    <Stack.Screen  name="MeterDetails" component={MeterDetailsPage}
    initialParams={{title: 'New Meter Details',nextScreen: 'NewEcvToMov'
    }}  />  
    <Stack.Screen 
        key = "NewEcvToMov"
        name="NewEcvToMov"
        component ={GenericPhotoPage} 
        initialParams={{title: 'New ECV to MOV',
         photoKey: 'NewEcvToMov',nextScreen:meter}}
    />
    
    
    <Stack.Screen 
    key = "NewMeterDataBadge"
    name ="NewMeterDataBadge" 
    component={GenericPhotoPage}
    initialParams={{
        title: 'New Meter data badge',
        photoKey: 'NewMeterDataBadge',
        nextScreen:'NewMeterIndex'}} />
   
    <Stack.Screen 
    key = "NewMeterIndex"
    name="NewMeterIndex"
     component= {MeterDetailsPage}
        initialParams={{title: 'New Meter index',photoKey: 'NewMeterIndex',nextScreen:'NewMeterPhoto'}}
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
    <Stack.Screen name ="CorrectorDetails" component={CorrectorDetailsPage} initialParams={{title: 'New Corrector installed',nextScreen:'CorrectorGateway'}} />
    <Stack.Screen name="CorrectorGateWay" component={CorrectorGateway} />
    {/* set and seal details  */}
    <Stack.Screen name="StreamsSetSealDetails" component={StreamsSetSealDetailsPage} />
      {generateScreenInstancesForStreams(numberOfStreams).map((screen, index) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{ title: screen.title }}
          initialParams={{ nextScreen: () => getNextScreen(screen.name, numberOfStreams) }}
        />
      ))}
    
    {/* regulator process */}
    <Stack.Screen name="Regulator" component={RegulatorPage} />
    <Stack.Screen name="ChatterBox" component={ChatterBoxPage} />
    <Stack.Screen name="AdditionalMaterial" component={AdditionalMaterialPage} />
  </Stack.Navigator>

);};

export default InstallFlowNavigator;