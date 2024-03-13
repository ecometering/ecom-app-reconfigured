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
import React, { useState, useEffect, useContext } from "react";
// gateways 
import AssetSelectGatewayScreen from "../screens/gateways/AssetSelectGateWay";
import CorrectorGateway from "../screens/gateways/CorrectorGateWay";
import MeterGatewayScreen from "../screens/gateways/MeterGateWay";
import DataLoggerGatewayScreen from "../screens/gateways/DataloggerGateWay";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const assetSelection = ({ meter, corrector, datalogger }, callType) => {
  if (callType === 'Removal') {
    if (meter) return 'ExistingMeterDetails';
    if (corrector) return 'ExistingCorrectorDetails';
    if (datalogger) return 'ExistingDataLoggerDetails';
  } else if (callType === 'Install') {
    if (meter) return 'InstalledMeterDetails';
    if (corrector) return 'InstalledCorrectorDetails';
    if (datalogger) return 'InstalledDataLoggerDetails';
  }
  throw new Error('At least one asset must be selected.');
};

const nextAfterMeterRemoval = ({ meter, corrector, datalogger }) => {
  if (corrector) return 'ExistingCorrectorDetails';
  if (datalogger) return 'ExistingDataLoggerDetails';

  // Fallback to Install callType if both corrector and datalogger are false
  return assetSelection({ meter, corrector, datalogger }, 'Install');
};

const nextAfterCorrectorRemoval = ({ meter, corrector, datalogger }) => {
  if (datalogger) {
    return 'ExistingDataLoggerDetails';
  } else {
    // Utilize Install callType if datalogger is false
    return assetSelection({ meter, corrector, datalogger }, 'Install');
  }
};

const setAndSeal = (meterType, meterPressure) => {
  if (meterType === 'Diaphragm' && meterPressure === 'Medium') return 'StreamsSetSealDetails';
  return meterType === 'Diaphragm' ? 'Regulator' : 'StreamsSetSealDetails';
};

const nextAfterMeterInstallation = ({ corrector, datalogger, meterType, meterPressure }) => {
  if (corrector && datalogger) return 'CorrectorDetails';
  if (corrector) return 'CorrectorDetails';
  if (datalogger) return 'DataLoggerDetails';
  return setAndSeal(meterType, meterPressure); 
};

const nextAfterCorrectorInstallation = ({ datalogger, meterType, meterPressure }) => {
  if (datalogger) {
    return 'DataLoggerDetails';
  } else {
    return setAndSeal(meterType, meterPressure); 
};
};
const nextAfterDataLoggerInstallation = ({ meterType, meterPressure }) => {
  if (meter) {
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

const getNextScreen = (currentScreenName) => {
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

const ExistingmeterBadge = (meterType) => meterType === 'Diaphragm' ? 'ExistingMeterIndex' : 'ExistingMeterDataBadge';
const InstalledmeterBadge = (meterType) => meterType === 'Diaphragm' ? 'InstalledMeterIndex' : 'InstalledMeterDataBadge';

const ExchangeFlowNavigator = () => {
  
  const {numberOfStreams, meterDetails = {}} = useContext(AppContext);
  // const {type, pressure} = meterDetails
  
  const meterType = meterDetails?.type;
  const meterPressure = meterDetails?.pressure; 


  return(
  <Stack.Navigator >
  <Stack.Screen name="AssetTypeSelectionPage" component={AssetTypeSelectionPage} initialParams={{title:'Assets being Exchanged',nextScreen:"AssetSelectGatewayScreenIntial"}} />
  <Stack.Screen name="AssetSelectGatewayScreenIntitial" component={AssetSelectGatewayScreen}initialParams={{pageRoute:1}} />
  <Stack.Screen name="ExistingMeterDetails" component={MeterDetailsPage} initialParams={{title:' Existing Meter Details',nextScreen: "ExistingMeterGatewayScreen1"}} />
  <Stack.Screen name="ExistingMeterGatewayScreen1" component={MeterGatewayScreen} initialParams={{pageRoute:1,pageflow:1}}/>
  <Stack.Screen name ="ExistingMeterDataBadge" component={GenericPhotoPage} initialParams={{title: 'Existing Meter data badge',photoKey: 'ExistingMeterDataBadge',nextScreen:'ExistingMeterIndex'}} />
  <Stack.Screen name="ExistingMeterIndex" component= {GenericPhotoPage} initialParams={{title: 'Existing Meter index',photoKey: 'ExistingMeterIndex',nextScreen:'ExistingMeterPhoto'}} />
  <Stack.Screen name="ExistingMeterPhoto" component={GenericPhotoPage} initialParams={{title: 'Existing Meter Photo',photoKey: 'ExistingMeterPhoto',nextScreen:'EcvPhoto' }} />
  <Stack.Screen name = "EcvPhoto" component = {GenericPhotoPage} initialParams={{title: 'Ecv Photo',photoKey: 'EcvPhoto',nextScreen:'ExistingCorrectorGatewaySreen'}} />
  <Stack.Screen name ="ExistingMeterGatewayScreen2" component={MeterGatewayScreen} initialParams={{pageRoute:1,pageflow:2}}/>
  <Stack.Screen name="ExistingCorrectorDetails" component={CorrectorDetailsPage} initialParams={{title: 'Existing Corrector Details',nextScreen:()=>nextAfterCorrectorRemoval({ meter, corrector, datalogger })}} />
  <Stack.screen name="ExistingCorrectorGatewaySreen" component={CorrectorGateway} initialParams={{pageRoute:1}} />
  <Stack.Screen name="ExistingDataLoggerDetails" component={DataLoggerDetailsPage} initialParams={{title: 'Existing DataLogger Details',nextScreen:'AssetSelectGatewayScreenFinal'}} />
  <Stack.Screen name="AssetSelectGatewayScreenFinal" component={AssetSelectGatewayScreen} initialParams={{pageRoute:2}} />
  
  <Stack.Screen name="InstalledMeterDetails" component={MeterDetailsPage} initialParams={{title: 'Installed Meter Details',nextScreen:'EcvToMovphoto'}} />
  <Stack.Screen name="EcvToMovPhoto" component={GenericPhotoPage} initialParams={{title: 'ECV to MOV Photo',photoKey: 'EcvToMovPhoto',nextScreen:'MeterGatewayScreen1'}} />
  <Stack.Screen name="MeterGatewayScreen1" component={MeterGatewayScreen} initialParams={{pageRoute:2,pageflow:1}}/>
  <Stack.Screen name="InstalledMeterDataBadge" component={GenericPhotoPage} initialParams={{title: 'Installed Meter data badge',photoKey: 'InstalledMeterDataBadge',nextScreen:'InstalledMeterIndex'}} />
  <Stack.Screen name="InstalledMeterIndex" component={GenericPhotoPage} initialParams={{title: 'Installed Meter index',photoKey: 'InstalledMeterIndex',nextScreen:'InstalledMeterPhoto'}} />
  <Stack.Screen name="InstalledMeterPhoto" component={GenericPhotoPage} initialParams={{title: 'Installed Meter Photo',photoKey: 'InstalledMeterPhoto',nextScreen:'MeterGatewayScreen2'}} />
  <Stack.Screen name="MeterGatewayScreen2" component={MeterGatewayScreen} initialParams={{pageRoute:2,pageflow:2}}/>
  <Stack.Screen name="InstalledCorrectorDetails" component={CorrectorDetailsPage} initialParams={{title: 'Installed Corrector Details',nextScreen:'CorrectorGatewayScreen'}} />
  <Stack.screen name="CorrectorGatewaySreen" component={CorrectorGateway} initialParams={{pageRoute:2}} />

  <Stack.Screen name="InstalledDataLoggerDetails" component={DataLoggerDetailsPage} initialParams={{title: 'Installed DataLogger Details',nextScreen:'DataLoggerGatewayScreen'}} />
  <Stack.Screen name="DataLoggerGatewayScreen" component={DataLoggerGatewayScreen}  />

  <Stack.Screen name="StreamsSetSealDetails" component={StreamsSetSealDetailsPage} />
      {generateScreenInstancesForStreams(numberOfStreams).map((screen, index) => (
        <Stack.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{ title: screen.title }}
          initialParams={{ nextScreen: () => getNextScreen(screen.name) }}
        />
      ))}
    
    {/* regulator process */}
    <Stack.Screen name="Regulator" component={RegulatorPage} />
    <Stack.Screen name="ChatterBox" component={ChatterBoxPage} />
    <Stack.Screen name="AdditionalMaterial" component={AdditionalMaterialPage} />


</Stack.Navigator>
);};

export default ExchangeFlowNavigator;

