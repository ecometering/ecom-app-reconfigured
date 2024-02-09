import React, { useContext, useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { getItemAsync } from "expo-secure-store";
import { AppContext } from "../context/AppContext";

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

// generic photo page 
import GenericPhotoPage from "../screens/jobs/GenericPhotoPage";


// navigation stacks 
import ExchangeFlowNavigator from "./exchangeFlowNavigator";
import InstallFlowNavigator from "./installFlowNavigator";
import MaintenanceFlowNavigator from "./maintenanceFlowNavigator";
import SurveyFlowNavigator from "./surveyFlowNavigator";
import RemovalFlowNavigator from "./removalFlowNavigator";




const Stack = createStackNavigator();

const MainNavigator = () => {
  const [isToken, setIsToken] = useState(null);
  const appContext = useContext(AppContext);
  const { jobType } = useContext(AppContext);
  console.log("appContext in MainNavigator:", appContext); // Check the entire context
  console.log("jobType in MainNavigator:", appContext.jobType);
  useEffect(() => {
    getItemAsync("userToken")
      .then((token) => {
        console.log("Token retrieved:", token);
        setIsToken(token ? true : false);
        appContext.setUserLogged(!!token);
      })
      .catch((err) => {
        console.error("Error retrieving token:", err);
        setIsToken(false);
      });
  }, []);
  console.log("isToken state:", isToken);
  if (isToken === null) {
    console.log("Loading spinner displayed");
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

 



  // Additional Photos Process
  const AdditionalPhotosProcess = () => {
    const { extraPhotoCount } = useContext(AppContext);
    let additionalPhotoScreens = [];
  
    for (let i = 0; i < extraPhotoCount; i++) {
      additionalPhotoScreens.push(
        <Stack.Screen 
          key={`ExtraPhotoPage_${i}`}
          name={`ExtraPhotoPage_${i}`}
          component={ExtraPhotoPage}
          initialParams={{ photoNumber: i + 1 }}
        />
      );
    }
  
    return additionalPhotoScreens;
  };
  // ...

  const RenderNavigator = () => {
    switch (jobType) {
      case "Exchange":
        return <ExchangeFlowNavigator />;
      case "Install":
        return <InstallFlowNavigator />;
      case "Maintenance":
        return <MaintenanceFlowNavigator />;
      case "Survey":
        return <SurveyFlowNavigator />;
      case "Removal":
        return <RemovalFlowNavigator />;
        case "Warrant":
          return <RemovalFlowNavigator/>; 
      default:
        return null ; 

    } }
      
  
  console.log("Main Navigator rendered")
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
      <Stack.Screen name = 'SiteQuestionsPage' component={SiteQuestionsPage} initialParams={{nextScreen: RenderNavigator}}/>
      


            <Stack.Screen name="StandardPage" component={StandardPage} />
        <Stack.Screen name="RiddorReportPage" component={RiddorReportPage} />
        <Stack.Screen name="SnClientInfoPage" component={SnClientInfoPage} />
        <Stack.Screen name="GasSafeWarningPage" component={GasSafeWarningPage} />
        
        <Stack.Screen 
        key="CompositeLabelPhoto"
        name="CompositeLabelPhoto"  
        component={GenericPhotoPage} 
        initialParams={{ title: 'Composite label', photoKey: 'compositeLabel', nextScreen: 'DSEARLabelPhoto'}} 
      />
      
        <Stack.Screen 
        key = "DSEARLabelPhoto"
            name="DSEARLabelPhoto"
            component={GenericPhotoPage} 
            initialParams={{ title: 'DSEAR label', photoKey: 'dsearLabel', nextScreen: 'SettingsLabelPhoto'}}
        />
    
       
      <Stack.Screen name="SettingsLabelPhoto" component={GenericPhotoPage} initialParams={{ title: 'Settings label', photoKey: 'settingsLabel',nextScreen: 'ExtraPhotoPage_0'}} />
{/* Dynamically generated additional photo screens */}
{AdditionalPhotosProcess().map(({ name, component, key, initialParams }) => (
  <Stack.Screen key={key} name={name} component={component} initialParams={initialParams} />
))}

          <Stack.Screen name='SubmitSuccessPage' component={SubmitSuccessPage}/>  

          </Stack.Group>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

  export default MainNavigator;