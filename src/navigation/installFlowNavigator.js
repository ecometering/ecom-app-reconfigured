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
import React, { useContext } from "react";

import AssetSelectGatewayScreen from "../screens/gateways/AssetSelectGateWay";
import CorrectorGateway from "../screens/gateways/CorrectorGateWay";
import MeterGatewayScreen from "../screens/gateways/MeterGateWay";
import DataloggerGatewayScreen from "../screens/gateways/DataloggerGateWay";

import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const generateScreenInstancesForStreams = (numberOfStreams) => {
  let screens = [];
  for (let i = 0; i < numberOfStreams; i++) {
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
  const match = currentScreenName.match(/(\D+)-(\d+)/);
  if (!match) return 'RegulatorPage';

  const [, screenPart, index] = match;
  const streamIndex = parseInt(index, 10);
  const screenOrder = ['FilterPage', 'SlamshutPage', 'ActiveRegulatorPage', 'ReliefRegulatorPage', 'WaferCheckPage'];
  const currentScreenIndex = screenOrder.indexOf(screenPart);
  const nextScreenIndex = currentScreenIndex + 1;

  if (nextScreenIndex >= screenOrder.length) {
    return streamIndex + 1 < numberOfStreams ? `${screenOrder[0]}-${streamIndex + 1}` : 'RegulatorPage';
  } else {
    return `${screenOrder[nextScreenIndex]}-${streamIndex}`;
  }
};

const InstallFlowNavigator = () => {
  const { numberOfStreams, meterDetails  } = useContext(AppContext);
  


  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AssetTypeSelectionPage"
        component={AssetTypeSelectionPage}
        initialParams={{ title: 'Assets being installed', nextScreen: "AssetSelectGateway" }}
      />
  <Stack.Screen name="AssetSelectGateway" component={AssetSelectGatewayScreen} initialParams={{pageFlow:1}} />
      {/* meter process */}
      <Stack.Screen name="MeterDetails" component={MeterDetailsPage} initialParams={{ title: 'New Meter Details', nextScreen: 'NewEcvToMov' }} />
      <Stack.Screen key="NewEcvToMov" name="NewEcvToMov" component={GenericPhotoPage} initialParams={{ title: 'New ECV to MOV', photoKey: 'NewEcvToMov', nextScreen: 'MeterGatewayScreen1' }} />
      <Stack.Screen name="MeterGatewayScreen1" component={MeterGatewayScreen} initialParams={{ pageflow: 1 }} />
      <Stack.Screen key="MeterDataBadge" name="MeterDataBadge" component={GenericPhotoPage} initialParams={{ title: 'New Meter data badge', photoKey: 'MeterDataBadge', nextScreen: 'MeterIndex' }} />
      <Stack.Screen key="MeterIndex" name="MeterIndex" component={GenericPhotoPage} initialParams={{ title: 'New Meter index', photoKey: 'MeterIndex', nextScreen: 'NewMeterPhoto' }} />
      <Stack.Screen key="NewMeterPhoto" name="NewMeterPhoto" component={GenericPhotoPage} initialParams={{ title: 'New Meter photo', photoKey: 'NewMeterPhoto', nextScreen: 'MeterGatewayScreen2' }} />
      <Stack.Screen name="MeterGatewayScreen2" component={MeterGatewayScreen} initialParams={{ pageflow: 2 }} />

      {/* Corrector Process */}
      <Stack.Screen name="CorrectorDetails" component={CorrectorDetailsPage} initialParams={{ title: 'New Corrector installed', nextScreen: 'CorrectorGateway',photoKey:'installedCorrector' }} />
      <Stack.Screen name="CorrectorGateway" component={CorrectorGateway} />
      {/* DataLogger process */}
      <Stack.Screen name="DataLoggerDetails" component={DataLoggerDetailsPage} initialParams={{ title: 'New AMR installed', nextScreen: 'DataLoggerGateway',photoKey:'installedAMR' }} />
      <Stack.Screen name="DataLoggerGateway" component={DataloggerGatewayScreen} />

      {/* set and seal details */}
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
  );
};

export default InstallFlowNavigator;