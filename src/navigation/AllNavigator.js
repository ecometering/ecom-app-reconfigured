import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { getItemAsync } from "expo-secure-store";
// import { AppContext } from "../context/AppContext";

// import screens from "..screens"    
import LoginPage from "../screens/LoginPage";
import HomePage from "../screens/HomePage";
import PlannedJobPage from "../screens/PlannedJobPage";
import SubmitSuccessPage from "../screens/SubmitSuccessPage";
import JobTypePage from "../screens/JobTypePage";
// calendar imports
import CalendarPage from "../screens/calendar/CalendarPage";

// maintenance pages imports
import MaintenancePage from "../screens/maintenance/MaintenanceQuestionsPage";

//import standards inport from ../screens/standards
import StandardPage from "../screens/standards/StandardPage";
import ExtraPhotoPage from "../screens/standards/ExtraPhotoPage";
import GasSafeWarningPage from "../screens/standards/GasSafeWarningPage";
import RiddorReportPage from "../screens/standards/RiddorReportPage";
import SnClientInfoPage from "../screens/standards/SnClientInfoPage";

//  jobs pages imports 

import AdditionalMaterialPage from "../screens/jobs/AdditionalMaterialPage";
import AssetTypeSelectionPage from "../screens/jobs/AssetTypeSelectionPage";
import ChatterBoxPage from "../screens/jobs/ChatterBoxPage";
import CorrectorDetailsPage from "../screens/jobs/CorrectorDetailsPage";
import DataLoggerDetailsPage from "../screens/jobs/DataLoggerDetailsPage";
import MeterDetailsPage from "../screens/jobs/MeterDetailsPage";
import RegulatorPage from "../screens/jobs/RegulatorPage";
import SiteDetailsPage from "../screens/jobs/SiteDetailsPage";
import SiteQuestionsPage from "../screens/jobs/SiteQuestionsPage";
import StreamsSetSealDetailsPage from "../screens/jobs/StreamsSetSealDetailsPage";
import ActiveRegulatorPage from "../screens/jobs/ActiveRegulatorPage";
import FilterPage from "../screens/jobs/FilterPage";
import ReliefRegulatorPage from "../screens/jobs/ReliefRegulatorPage";
import SlamshutPage from "../screens/jobs/SlamshutPage";
import WaferCheckPage from "../screens/jobs/WaferCheckPage";


// generic photo page 
import GenericPhotoPage from "../screens/jobs/GenericPhotoPage";

const Stack = createStackNavigator();

const AllNavigator = () => {

return (
    
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* {!appContext.userLogged ? (
          <Stack.Group>
            <Stack.Screen name="LogIn" component={LoginPage} />
          </Stack.Group>
        ) : ( */}
          <Stack.Group>
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="CalendarPage" component={CalendarPage} />
            <Stack.Screen name="NewJobPage" component={JobTypePage} />
            <Stack.Screen name="PlannedJobPage" component={PlannedJobPage} />
            <Stack.Screen  name="SiteDetailsPage" component={SiteDetailsPage} />
            <Stack.Screen  name="SitePhotoPage" 
        component={GenericPhotoPage} 
        initialParams={{ title: 'Site Photo', photoKey: 'sitePhoto',nextScreen:'SiteQuestionsPage', }} 
      />
      <Stack.Screen name = 'SiteQuestionsPage' component={SiteQuestionsPage}/>
      <Stack.Screen name = 'AssetTypeSelectionPage' component={AssetTypeSelectionPage}/>
        <Stack.Screen name = 'MaintenancePage' component={MaintenancePage}/>
        <Stack.Screen name = 'StreamsSetSealDetails' component={StreamsSetSealDetailsPage}/>
        <Stack.Screen name = 'RegulatorPage' component={RegulatorPage}/>
        <Stack.Screen name = 'ChatterBoxPage' component={ChatterBoxPage}/>
        <Stack.Screen name = 'AdditionalMaterialPage' component={AdditionalMaterialPage}/>
        <Stack.Screen name = 'CorrectorDetailsPage' component={CorrectorDetailsPage}/>
        <Stack.Screen name = 'MeterDetailsPage' component={MeterDetailsPage}/>
        <Stack.Screen name = 'DataLoggerDetailsPage' component={DataLoggerDetailsPage}/>
        <Stack.Screen name = 'ActiveRegulatorPage' component={ActiveRegulatorPage}/>
        <Stack.Screen name = 'FilterPage' component={FilterPage}/>
        <Stack.Screen name = 'ReliefRegulatorPage' component={ReliefRegulatorPage}/>
        <Stack.Screen name = 'WaferCheckPage' component={WaferCheckPage}/>
        <Stack.Screen name = 'SlamshutPage' component={SlamshutPage}/>
        <Stack.Screen name = 'ExtraPhotoPage' component={ExtraPhotoPage}/>
        


            <Stack.Screen name="StandardPage" component={StandardPage} />
        <Stack.Screen name="RiddorReportPage" component={RiddorReportPage} />
        <Stack.Screen name="SnClientInfoPage" component={SnClientInfoPage} />
        <Stack.Screen name="GasSafeWarningPage" component={GasSafeWarningPage} />

        <Stack.Screen name='SubmitSuccessPage' component={SubmitSuccessPage}/> 
            
             </Stack.Group>
             </Stack.Navigator>
             </NavigationContainer>
             );
   };
export default AllNavigator;