import GenericPhotoPage from "../screens/jobs/GenericPhotoPage";
import CorrectorDetailsPage from "../screens/jobs/CorrectorDetailsPage";
import DataLoggerDetailsPage from "../screens/jobs/DataLoggerDetailsPage";
import MeterDetailsPage from "../screens/jobs/MeterDetailsPage";
import StreamsSetSealDetailsPage from "../screens/jobs/StreamsSetSealDetailsPage";
import RegulatorPage from "../screens/jobs/RegulatorPage";
import ChatterBoxPage from "../screens/jobs/ChatterBoxPage";
import AdditionalMaterialPage from "../screens/jobs/AdditionalMaterialPage";
import AssetTypeSelectionPage from "../screens/jobs/AssetTypeSelectionPage";
import EcvPage from "../screens/survey/EcvPage";
import SlamshutPage from "../screens/jobs/SlamshutPage";
import WaferCheckPage from "../screens/jobs/WaferCheckPage";
import ReliefRegulatorPage from "../screens/jobs/ReliefRegulatorPage";
import ActiveRegulatorPage from "../screens/jobs/ActiveRegulatorPage";
import FilterPage from "../screens/jobs/FilterPage";
import { AppContext } from "../context/AppContext";
import React, { useState, useEffect,useContext } from "react";

// Gateways 
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
const generateScreenInstancesForStreams = (numberOfStreams) => {
  let screens = [];
  for (let i = 0; i < numberOfStreams; i++) {
    // Dynamically generate screen names with stream index
    const streamScreens = [
      { name: `FilterPage-${i}`, component: FilterPage, title: `Filter ${i + 1}` },
      { name: `SlamshutPage-${i}`, component: SlamshutPage, title: `Slamshut ${i + 1}` },
      { name: `SealedSlamShutPhotoPage-${i}`, component: GenericPhotoPage, title: `Sealed Slam Shut Photo ${i + 1}`, photoKey: `sealedSlamShutPhoto-${i}` },
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
  const screenOrder = [
    'FilterPage',
    'SlamshutPage',
    'SealedSlamShutPhotoPage',
    'ActiveRegulatorPage',
    'ReliefRegulatorPage',
    'WaferCheckPage',
  ];
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
const SurveyFlowNavigator = () => {
  const { numberOfStreams = 0, meterDetails = {}} = useContext(AppContext);
  const meterType = meterDetails?.type;
  const meterPressure = meterDetails?.pressure; 
  
  return (
  <Stack.Navigator > 
    <Stack.Screen name="AssetTypeSelectionPage" component={AssetTypeSelectionPage} initialParams={{title:'Existing Assets',nextScreen:'AssetSelectGateway'}} />
    <Stack.Screen name="AssetSelectGateway" component={AssetSelectGatewayScreen} />
    {/* meter process */}
    <Stack.Screen name="ExistingMeterDetails" component={MeterDetailsPage}
    initialParams={{title: 'Existing Meter Details',nextScreen: 'ExistingEcvToMov'
    }}  />  
    <Stack.Screen 
        key = "ExistingEcvToMov"
        name="ExistingEcvToMov"
        component ={GenericPhotoPage} 
        initialParams={{title: 'Existing ECV to MOV',
         photoKey: 'ExistingEcvToMov',nextScreen:'MeterGatewayScreen1'}}
    />
    <Stack.Screen name ="MeterGatewayScreen1" component={MeterGatewayScreen} initialParams={{pageflow:1}} />
    
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
    initialParams={{title: 'Existing Meter photo',photoKey: 'ExistingMeterPhoto',nextScreen:'MeterGatewayScreen2'}} 
    
    />
    <Stack.Screen name ="MeterGatewayScreen2" component={MeterGatewayScreen} initialParams={{pageflow:2}} />
    {/*  Corrector Process */}
    <Stack.Screen name ="ExistingCorrectorDetails" component={CorrectorDetailsPage} initialParams={{title: 'Existing Corrector installed',nextScreen:'CorrectorGateway'}} />
    <Stack.Screen name="CorrectorGateway" component={CorrectorGateway} />  
    {/* DataLogger process */}
    <Stack.Screen name="ExistingDataLoggerDetails" component={DataLoggerDetailsPage} initialParams={{title:'Existing AMR installed',nextScreen:'DataLoggerGateway'}}/>
    <Stack.Screen name="DataLoggerGateway" component={DataloggerGatewayScreen} />
    {/* set and seal details  */}
    <Stack.Screen name="StreamsSetSealDetails" component={StreamsSetSealDetailsPage} initialParams={{title:'Existing Streams'}} />
    {generateScreenInstancesForStreams(numberOfStreams).map((screen, index) => (
      <Stack.Screen
        key={screen.name}
        name={screen.name}
        component={screen.component}
        options={{ title: screen.title }}
        initialParams={{
          nextScreen: () => getNextScreen(screen.name, numberOfStreams),
          photoKey: screen.photoKey // Pass the photoKey as an initial param
        }}
      />
    ))}
    {/* regulator process */}
    <Stack.Screen name="ExistingRegulator" component={RegulatorPage} />
    <Stack.Screen name="ExistingChatterBox" component={ChatterBoxPage} />
    <Stack.Screen name="AdditionalMaterial" component={AdditionalMaterialPage} />
    <Stack.Screen
              name="EcvPage"
              component={EcvPage}
              initialParams={{ title: 'ECV details', nextScreen: 'vents' }}
            />
  </Stack.Navigator>

);};

export default SurveyFlowNavigator;