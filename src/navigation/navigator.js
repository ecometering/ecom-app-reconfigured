import React, { useContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
/* SCREENS */
// import LogInPage from "../screens/LoginPage";
import HomePage from "../screens/HomePage";
import CalendarPage from "../screens/calendar/CalendarPage";
import JobTypePage from "../screens/JobTypePage";
import PlannedJobPage from "../screens/PlannedJobPage";
/* Install */
import SiteDetailsPage from "../screens/job/install/SiteDetailsPage";
import AssetTypeSelectionPage from "../screens/job/install/AssetTypeSelectionPage";
import SitePhotoPage from "../screens/job/install/SitePhotoPage";
import SiteQuestionsPage from "../screens/job/install/SiteQuestionsPage";
import DataLoggerDetailsPage from "../screens/job/install/DataLoggerDetailsPage";
import AmrDetailsPage from "../screens/job/install/AmrDetailsPage";
import CorrectorDetailsPage from "../screens/job/install/CorrectorDetailsPage";
import NewEcvPhotoPage from "../screens/job/install/NewEcvPhotoPage";
import MeterDetailsPage from "../screens/job/MeterDetailsPage";
import MeterIndexPhotoPage from "../screens/job/MeterIndexPhotoPage";
import MeterDataBadgePhotoPage from "../screens/job/MeterDataBadgePhotoPage";
import VentOutKioskPhotoPage from "../screens/job/VentOutKioskPhotoPage";
import SealedByPassPhotoPage from "../screens/job/SealedByPassPhotoPage";
import SealedRegulatorPhotoPage from "../screens/job/SealedRegulatorPhotoPage";
import SealedCreepReliefPhotoPage from "../screens/job/SealedCreepReliefPhotoPage";
import MeterInstallationPhotoPage from "../screens/job/MeterInstallationPhotoPage";
import ModuleDataBadgePhotoPage from "../screens/job/ModuleDataBadgePhotoPage";
import EcvPhotoPage from "../screens/job/EcvPhotoPage";
import MeterPlatePhotoPage from "../screens/job/MeterPlatePhotoPage";
import RegulatorPage from "../screens/job/exchange/RegulatorPage";
import RegulatorPhotoPage from "../screens/job/exchange/RegulatorPhotoPage";
import ChatterBoxPage from "../screens/job/exchange/ChatterBoxPage";
import AdditionalMaterialPage from "../screens/job/exchange/AdditionalMaterialPage";
import StandardPage from "../screens/job/exchange/StandardPage";
import RiddorReportPage from "../screens/job/exchange/RiddorReportPage";
import CompositeLabelPage from "../screens/job/exchange/CompositeLabelPage";
import SettingsLabelPage from "../screens/job/exchange/SettingsLabelPage";
import DsearLabelPhotoPage from "../screens/job/exchange/DsearLabelPhotoPage";
import ExtraPhotoPage from "../screens/job/exchange/ExtraPhotoPage";
import GasSafeWarningPage from "../screens/job/exchange/GasSafeWarningPage";
import SnClientInfoPage from "../screens/job/exchange/SnClientInfoPage";

import RemovedSiteDetailsPage from "../screens/job/removal/RemovedSiteDetailsPage";
import RemovedSitePhotoPage from "../screens/job/removal/RemovedSitePhotoPage";
import RemovedAssetTypeSelectionPage from "../screens/job/removal/RemovedAssetTypeSelectionPage";
import RemovedSiteQuestionsPage from "../screens/job/removal/RemovedAssetTypeSelectionPage";

import RemovedMeterDetailsPage from "../screens/job/removal/RemovedMeterDetailsPage";
import RemovedMeterIndexPhotoPage from "../screens/job/removal/RemovedMeterIndexPhotoPage";
import EcvCappedPhotoPage from "../screens/job/removal/EcvCappedPhotoPage";
import RemovedAssetPhotoPage from "../screens/job/removal/RemovedAssetPhotoPage";

import MaintenanceQuestionsPage from "../screens/job/maintenance/MaintenanceQuestionsPage";
import MaintenanceAssetTypeSelectionPage from "../screens/job/maintenance/MaintenanceAssetTypeSelectionPage";
import MaintenanceSiteDetailsPage from "../screens/job/maintenance/MaintenanceSiteDetailsPage";
import MaintenanceSitePhotoPage from "../screens/job/maintenance/MaintenanceSitePhotoPage";

import StreamsSetSealDetailsPage from "../screens/job/StreamsSetSealDetailsPage";
import SealedSlamShutPhotoPage from "../screens/job/SealedSlamShutPhotoPage";
import WarrantPage from "../screens/job/warrant/WarrantPage";
import AuditPage from "../screens/job/AuditPage";
import CallOutPage from "../screens/job/CallOutPage";
import SurveyPage from "../screens/job/SurveyPage";
import SubmitSuccessPage from "../screens/SubmitSuccessPage";
import { getItemAsync } from "expo-secure-store";
import { ActivityIndicator, View } from "react-native";
import { AppContext } from "../context/AppContext";

const Stack = createStackNavigator();

const MainNavigator = () => {
  const [isToken, setIsToken] = useState(null);

  const appContext = useContext(AppContext);

  getItemAsync("userToken")
    .then((token) => {
      if (token) {
        console.log(token);
        setIsToken(true);
        appContext.setUserLogged(true);
      } else {
        setIsToken(false);
        appContext.setUserLogged(false);
      }
    })
    .catch((err) => {
      console.log(err);
    });

  if (isToken === null)
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="dodgerblue" size={"large"} />
      </View>
    );

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
       {/*{!appContext.userLogged ? (
          <Stack.Group>
            <Stack.Screen name="LogIn" component={LogInPage} />
          </Stack.Group>
        ) :
        (*/} 
          <Stack.Group>
            <Stack.Screen name="Home" component={HomePage} />

            <Stack.Screen name="CalendarPage" component={CalendarPage} />
            <Stack.Screen name="NewJobPage" component={JobTypePage} />
            <Stack.Screen name="PlannedJobPage" component={PlannedJobPage} />

            <Stack.Screen name="SiteDetailsPage" component={SiteDetailsPage} />
            <Stack.Screen
              name="AssetTypeSelectionPage"
              component={AssetTypeSelectionPage}
            />
            <Stack.Screen name="SitePhotoPage" component={SitePhotoPage} />
            <Stack.Screen
              name="SiteQuestionsPage"
              component={SiteQuestionsPage}
            />
            <Stack.Screen
              name="DataLoggerDetailsPage"
              component={DataLoggerDetailsPage}
            />
            <Stack.Screen
              name="CorrectorDetailsPage"
              component={CorrectorDetailsPage}
            />
            <Stack.Screen name="AmrDetailsPage" component={AmrDetailsPage} />
            <Stack.Screen name="NewEcvPhotoPage" component={NewEcvPhotoPage} />
            <Stack.Screen
              name="MeterDetailsPage"
              component={MeterDetailsPage}
            />
            <Stack.Screen
              name="MeterIndexPhotoPage"
              component={MeterIndexPhotoPage}
            />
            <Stack.Screen
              name="MeterDataBadgePhotoPage"
              component={MeterDataBadgePhotoPage}
            />
            <Stack.Screen
              name="VentOutKioskPhotoPage"
              component={VentOutKioskPhotoPage}
            />

            <Stack.Screen
              name="SealedRegulatorPhotoPage"
              component={SealedRegulatorPhotoPage}
            />
            <Stack.Screen
              name="SealedCreepReliefPhotoPage"
              component={SealedCreepReliefPhotoPage}
            />
            <Stack.Screen
              name="SealedByPassPhotoPage"
              component={SealedByPassPhotoPage}
            />
            <Stack.Screen
              name="MeterInstallationPhotoPage"
              component={MeterInstallationPhotoPage}
            />
            <Stack.Screen
              name="ModuleDataBadgePhotoPage"
              component={ModuleDataBadgePhotoPage}
            />
            <Stack.Screen name="EcvPhotoPage" component={EcvPhotoPage} />
            <Stack.Screen
              name="MeterPlatePhotoPage"
              component={MeterPlatePhotoPage}
            />

            <Stack.Screen name="RegulatorPage" component={RegulatorPage} />
            <Stack.Screen
              name="RegulatorPhotoPage"
              component={RegulatorPhotoPage}
            />
            <Stack.Screen name="ChatterBoxPage" component={ChatterBoxPage} />
            <Stack.Screen
              name="AdditionalMaterialPage"
              component={AdditionalMaterialPage}
            />
            <Stack.Screen name="StandardPage" component={StandardPage} />
            <Stack.Screen
              name="RiddorReportPage"
              component={RiddorReportPage}
            />
            <Stack.Screen
              name="CompositeLabelPage"
              component={CompositeLabelPage}
            />
            <Stack.Screen
              name="SettingsLabelPage"
              component={SettingsLabelPage}
            />
            <Stack.Screen
              name="DsearLabelPhotoPage"
              component={DsearLabelPhotoPage}
            />
            <Stack.Screen name="ExtraPhotoPage" component={ExtraPhotoPage} />
            <Stack.Screen
              name="GasSafeWarningPage"
              component={GasSafeWarningPage}
            />
            <Stack.Screen
              name="SnClientInfoPage"
              component={SnClientInfoPage}
            />

            <Stack.Screen
              name="RemovedSiteDetailsPage"
              component={RemovedSiteDetailsPage}
            />
            <Stack.Screen
              name="RemovedSitePhotoPage"
              component={RemovedSitePhotoPage}
            />
            <Stack.Screen
              name="RemovedAssetTypeSelectionPage"
              component={RemovedAssetTypeSelectionPage}
            />
            <Stack.Screen
              name="RemovedSiteQuestionsPage"
              component={RemovedSiteQuestionsPage}
            />
            <Stack.Screen
              name="RemovedMeterDetailsPage"
              component={RemovedMeterDetailsPage}
            />
            <Stack.Screen
              name="RemovedMeterIndexPhotoPage"
              component={RemovedMeterIndexPhotoPage}
            />
            <Stack.Screen
              name="EcvCappedPhotoPage"
              component={EcvCappedPhotoPage}
            />
            <Stack.Screen
              name="RemovedAssetPhotoPage"
              component={RemovedAssetPhotoPage}
            />

            <Stack.Screen
              name="MaintenanceQuestionsPage"
              component={MaintenanceQuestionsPage}
            />
            <Stack.Screen
              name="MaintenanceSiteDetailsPage"
              component={MaintenanceSiteDetailsPage}
            />
            <Stack.Screen
              name="MaintenanceSitePhotoPage"
              component={MaintenanceSitePhotoPage}
            />
            <Stack.Screen
              name="MaintenanceAssetTypeSelectionPage"
              component={MaintenanceAssetTypeSelectionPage}
            />

            <Stack.Screen
              name="StreamsSetSealDetailsPage"
              component={StreamsSetSealDetailsPage}
            />
            <Stack.Screen
              name="SealedSlamShutPhotoPage"
              component={SealedSlamShutPhotoPage}
            />

            <Stack.Screen name="WarrantPage" component={WarrantPage} />
            <Stack.Screen name="AuditPage" component={AuditPage} />
            <Stack.Screen name="CallOutPage" component={CallOutPage} />
            <Stack.Screen name="SurveyPage" component={SurveyPage} />

            <Stack.Screen
              name="SubmitSuccessPage"
              component={SubmitSuccessPage}
            />
          </Stack.Group>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
