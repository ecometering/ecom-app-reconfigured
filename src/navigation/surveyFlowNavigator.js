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
import React, { useState, useEffect,useContext } from "react";

import { createStackNavigator } from "@react-navigation/stack";


const Stack = createStackNavigator();

const assetSelection = ({ meter, corrector, datalogger }) => {
  if (meter) return 'ExistingMeterDetails';
  if (corrector) return 'ExistingCorrectorDetails';
  if (datalogger) return 'ExistingDataLoggerDetails';
  throw new Error('At least one asset must be selected.');
};

// Simplified meter badge logic
const meterBadge = (meterType) => meterType === 'Diaphragm' ? 'ExistingMeterIndex' : 'ExistingMeterDataBadge';

// Refactored Set and Seal logic based on meterType and meterPressure
const setAndSeal = (meterType, meterPressure) => {
  if (meterType === 'Diaphragm' && meterPressure === 'Medium') return 'StreamsSetSealDetails';
  return meterType === 'Diaphragm' ? 'ExistingRegulator' : 'StreamsSetSealDetails';
};

const nextAfterMeterPhoto = ({ corrector, datalogger, meterType, meterPressure }) => {
  if (corrector && datalogger) return 'CorrectorDetails';
  if (corrector) return 'ExistingCorrectorDetails';
  if (datalogger) return 'ExistingDataLoggerDetails';
  return setAndSeal(meterType, meterPressure);
};

// Determine next after CorrectorDetails
const nextAfterCorrector = ({ datalogger, meter, meterType, meterPressure }) => {
  if (datalogger) {
    return 'ExistingDataLoggerDetails'; // Navigate to DataLogger if true
  } else if (meter) {
    return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
  } else {
    return 'StandardPage'; // Fallback to StandardsNavigation
  }
};

// Function to determine the next page from DataLoggerDetails
const nextAfterDataLogger = ({ meter, meterType, meterPressure }) => {
  if (meter) {
    return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
  } else {
    return 'StandardPage'; // Fallback to StandardsNavigation
  }
};


// const getDynamicScreenTitle = (baseTitle, index) => `${baseTitle} ${index + 1}`;

// const getNextScreenName = (currentScreen) => {
//   const streamScreens = ['FilterPage', 'SlamshutPage', 'ActiveRegulatorPage', 'ReliefRegulatorPage', 'WaferCheckPage'];
//   const currentIndex = streamScreens.indexOf(currentScreen);
//   const nextIndex = (currentIndex + 1) % streamScreens.length;
//   const nextScreen = streamScreens[nextIndex];
  
//   // If we are at the last screen of a stream cycle and all streams have been processed
//   if (nextScreen === 'FilterPage' && currentStreamIndex + 1 >= numberOfStreams) {
//     return 'ExistingRegulator'; // Go to RegulatorPage after the last stream
//   }
  
//   // If looping back to FilterPage, increment the stream index
//   if (nextScreen === 'FilterPage') {
//     updateCurrentStreamIndex(currentStreamIndex + 1);
//   }

//   return nextScreen;
// };
const SurveyFlowNavigator = () => {
  const { numberOfStreams = 0, meterDetails = {}} = useContext(AppContext);
  const meterType = meterDetails?.type;
  const meterPressure = meterDetails?.pressure; 
  <Stack.Navigator > 
    <Stack.Screen name="AssetTypeSelectionPage" component={AssetTypeSelectionPage} initialParams={{title:'Existing Assets',nextScreen: ()=>assetSelection(meter,corrector,datalogger)}} />
    
    {/* meter process */}
    <Stack.Screen name="MeterDetails" component={MeterDetailsPage}
    initialParams={{title: 'Existing Meter Details',nextScreen: ExistingEcvToMov
    }}  />  
    <Stack.Screen 
        key = "ExistingEcvToMov"
        name="ExistingEcvToMov"
        component ={GenericPhotoPage} 
        initialParams={{title: 'New ECV to MOV',
         photoKey: 'ExistingEcvToMov',nextScreen:()=>meterBadge(meterType)}}
    />
    
    
    <Stack.Screen 
    key = "ExistingMeterDataBadge"
    name ="ExistingMeterDataBadge" 
    component={GenericPhotoPage}
    initialParams={{
        title: 'Existing Meter data badge',
        photoKey: 'ExistingMeterDataBadge',
        nextScreen:'ExistingMeterIndex'}} />
   
    <Stack.Screen 
    key = "ExistingMeterIndex"
    name="ExistingMeterIndex"
     component= {MeterDetailsPage}
        initialParams={{title: 'Existing Meter index',photoKey: 'ExistingMeterIndex',nextScreen:'ExistingMeterPhoto'}}
         />

    <Stack.Screen
    key = "ExistingMeterPhoto"
    name="ExistingMeterPhoto"
    component={GenericPhotoPage}
    initialParams={{title: 'Existing Meter photo',photoKey: 'ExistingMeterPhoto',nextScreen:()=>nextAfterMeterPhoto(corrector,datalogger,meterType,meterPressure)}} 
    
    />
    {/* DataLogger process */}
    <Stack.Screen name="ExistingDataLoggerDetails" component={DataLoggerDetailsPage} initialParams={{title:'Existing AMR installed',nextScreen:()=> nextAfterDataLogger}}/>
    {/*  Corrector Process */}
    <Stack.Screen name ="ExistingCorrectorDetails" component={CorrectorDetailsPage} initialParams={{title: 'Existing Corrector installed',nextScreen:()=>nextAfterCorrector}} />
    
    {/* set and seal details  */}
    <Stack.Screen
        name="StreamsSetSealDetails"
        component={StreamsSetSealDetailsPage}
        initialParams={{ nextScreen: `FilterPage-0` }}
      />

      {generateStreamScreens().map((screen, index) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{ title: screen.title }}
          initialParams={{
            nextScreen: index % 5 === 4 ? (index / 5 + 1 < numberOfStreams ? `FilterPage-${Math.floor(index / 5) + 1}` : 'ExistingRegulator') : undefined,
          }}
        />
      ))}
    {/* regulator process */}
    <Stack.Screen name="ExistingRegulator" component={RegulatorPage} />
    <Stack.Screen name="ExistingChatterBox" component={ChatterBoxPage} />
    <Stack.Screen name="AdditionalMaterial" component={AdditionalMaterialPage} />
  </Stack.Navigator>

};

export default SurveyFlowNavigator;