import GenericPhotoPage from "../screens/jobs/GenericPhotoPage";
import CorrectorDetailsPage from "../screens/jobs/CorrectorDetailsPage";
import DataLoggerDetailsPage from "../screens/jobs/DataLoggerDetailsPage";
import MeterDetailsPage from "../screens/jobs/MeterDetailsPage";
import StreamsSetSealDetailsPage from "../screens/jobs/StreamsSetSealDetailsPage";
import RegulatorPage from "../screens/jobs/RegulatorPage";
import ChatterBoxPage from "../screens/jobs/ChatterBoxPage";
import AdditionalMaterialPage from "../screens/jobs/AdditionalMaterialPage";
import AssetTypeSelectionPage from "../screens/jobs/AssetTypeSelectionPage";
import MaintenanceQuestionsPage from "../screens/maintenance/MaintenanceQuestionsPage";
import SlamshutPage from "../screens/jobs/SlamshutPage";
import WaferCheckPage from "../screens/jobs/WaferCheckPage";
import ReliefRegulatorPage from "../screens/jobs/ReliefRegulatorPage";
import ActiveRegulatorPage from "../screens/jobs/ActiveRegulatorPage";
import FilterPage from "../screens/jobs/FilterPage";
import { AppContext } from "../context/AppContext";
import React, { useState, useEffect,useContext } from "react";


// gateways
import AssetSelectGatewayScreen from "../screens/gateways/AssetSelectGateWay";
import CorrectorGateway from "../screens/gateways/CorrectorGateWay";
import MeterGatewayScreen from "../screens/gateways/MeterGateWay";
import DataloggerGatewayScreen from "../screens/gateways/DataloggerGateWay";


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
  return meterType === 'Diaphragm' ? 'MaintenanceQuestions' : 'StreamsSetSealDetails';
};

const nextAfterMeterPhoto = ({ corrector, datalogger, meterType, meterPressure }) => {
  if (corrector && datalogger) return 'ExistingCorrectorDetails';
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
    return 'MaintenanceQuestions'; // Fallback to maintenance questions 
  }
};

// Function to determine the next page from DataLoggerDetails
const nextAfterDataLogger = ({ meter, meterType, meterPressure }) => {
  if (meter) {
    return setAndSeal(meterType, meterPressure); // Use setAndSeal logic if meter is present
  } else {
    return 'MaintenanceQuestions'; // Fallback to Maintenance questions
  }
};


// const { numberOfStreams, currentStreamIndex, updateCurrentStreamIndex } = useContext(AppContext);


// const getDynamicScreenTitle = (baseTitle, index) => `${baseTitle} ${index + 1}`;

// const getNextScreenName = (currentScreen) => {
//   const streamScreens = ['FilterPage', 'SlamshutPage', 'ActiveRegulatorPage', 'ReliefRegulatorPage', 'WaferCheckPage'];
//   const currentIndex = streamScreens.indexOf(currentScreen);
//   const nextIndex = (currentIndex + 1) % streamScreens.length;
//   const nextScreen = streamScreens[nextIndex];
  
//   // If we are at the last screen of a stream cycle and all streams have been processed
//   if (nextScreen === 'FilterPage' && currentStreamIndex + 1 >= numberOfStreams) {
//     return 'MaintenanceQuestions'; // Go to RegulatorPage after the last stream
//   }
  
//   // If looping back to FilterPage, increment the stream index
//   if (nextScreen === 'FilterPage') {
//     updateCurrentStreamIndex(currentStreamIndex + 1);
//   }

//   return nextScreen;
// };

const MaintenanceFlowNavigator = () => {
  const { numberOfStreams = 0, meterDetails, currentStreamIndex = 0, updateCurrentStreamIndex  = 0} = useContext(AppContext);
  
  const meterType = meterDetails?.type;
  const meterPressure = meterDetails?.pressure; 
  
  return(
  <Stack.Navigator > 
    <Stack.Screen name="AssetTypeSelectionPage" component={AssetTypeSelectionPage} initialParams={{title:'Existing Assets',nextScreen:'AssetSelectGateway'}} />
    <Stack.Screen name="AssetSelectGateway" component={AssetSelectGatewayScreen} />
    {/* meter process */}
    <Stack.Screen name="ExistingMeterDetails" component={MeterDetailsPage}
    initialParams={{title: 'Existing Meter Details',nextScreen: ExistingEcvToMov
    }}  />  
    <Stack.Screen 
        key = "ExistingEcvToMov"
        name="ExistingEcvToMov"
        component ={GenericPhotoPage} 
        initialParams={{title: 'New ECV to MOV',
         photoKey: 'ExistingEcvToMov',nextScreen:'MeterGateway'}}
    />
    <Stack.Screen name="MeterGateway1" component={MeterGatewayScreen} initialParams={{pageflow:1}}/>
    
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
     component= {GenericPhotoPage}
        initialParams={{title: 'Existing Meter index',photoKey: 'ExistingMeterIndex',nextScreen:'ExistingMeterPhoto'}}
         />

    <Stack.Screen
    key = "ExistingMeterPhoto"
    name="ExistingMeterPhoto"
    component={GenericPhotoPage}
    initialParams={{title: 'Existing Meter photo',photoKey: 'ExistingMeterPhoto',nextScreen:'MeterGateway2'}} 
    
    />
        <Stack.Screen name="MeterGateway2" component={MeterGatewayScreen} initialParams={{pageflow:2}}/>
    {/*  Corrector Process */}
    <Stack.Screen name ="ExistingCorrectorDetails" component={CorrectorDetailsPage} initialParams={{title: 'Existing Corrector installed',nextScreen:'CorrectorGateway'}} />
    <Stack.Screen name="CorrectorGateway" component={CorrectorGateway} />
    {/* DataLogger process */}
    <Stack.Screen name="ExistingDataLoggerDetails" component={DataLoggerDetailsPage} initialParams={{title:'Existing AMR installed',nextScreen:'DataLoggerGateway'}}/>
    <Stack.Screen name="DataLoggerGateway" component={DataloggerGatewayScreen} />
    
   
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
            nextScreen: index % 5 === 4 ? (index / 5 + 1 < numberOfStreams ? `FilterPage-${Math.floor(index / 5) + 1}` : 'MaintenanceQuestions') : undefined,
          }}
        />
      ))}
    <Stack.Screen name="MaintenanceQuestions" component={MaintenanceQuestionsPage} />
    {/* regulator process */}
    <Stack.Screen name="ExistingRegulator" component={RegulatorPage} />
    <Stack.Screen name="ExistingChatterBox" component={ChatterBoxPage} />
    <Stack.Screen name="AdditionalMaterial" component={AdditionalMaterialPage} />
  </Stack.Navigator>

)};

export default MaintenanceFlowNavigator;