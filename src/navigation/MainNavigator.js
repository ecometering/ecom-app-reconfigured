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

   const getPhotoPageParams = (photoType,jobType) => {
    let title = '';
    let photoKey = '';
  
    switch (photoType) {
        
        case 'meterPhoto':
            if (jobType === 'Install') {
                title = 'New Meter Photo';
                photoKey = 'NewMeterPhoto';
            } else if (jobType === 'Maintenance') {
                title = 'Existing Meter Photo';
                photoKey = 'ExistingMeterPhoto';
            } else if (jobType === 'Removal') {
                title = ' Existing Meter Photo';
                photoKey = 'ExistingMeterPhoto';
            }
            if (jobType === 'Warrant'){
                title = 'Existing Meter Photo';
                photoKey = 'ExistingMeterPhoto';
            }
            if (jobType === 'Survey'){
                title = 'Existing Meter Photo';
                photoKey = 'ExistingMeterPhoto';
            }
            break;
        
        case 'meterIndex':
            if (jobType === 'Install') {
            title = 'New Meter Index';
            photoKey = 'NewMeterIndex';
            } else if (jobType === 'Maintenance') {
            title = 'Existing Meter Index';
            photoKey = 'ExistingMeterIndex';
            } else if (jobType === 'Removal') {
            title = ' Existing Meter Index';
            photoKey = 'ExistingMeterIndex';
            }
            if (jobType === 'Warrant'){
            title = 'Existing Meter Index';
            photoKey = 'ExistingMeterIndex';
            }
            if (jobType === 'Survey'){
            title = 'Existing Meter Index';
            photoKey = 'ExistingMeterIndex';
            }
            break;

        case 'meterDataBadge':
            if (jobType === 'Install') {
            title = 'New Meter Data Badge';
            photoKey = 'NewMeterDataBadge';
            } else if (jobType === 'Maintenance') {
            title = 'Existing Meter Data Badge';
            photoKey = 'ExistingMeterDataBadge';
            } else if (jobType === 'Removal') {
            title = ' Existing Meter Data Badge';
            photoKey = 'ExistingMeterDataBadge';
            }
            if (jobType === 'Warrant'){
            title = 'Existing Meter Data Badge';
            photoKey = 'ExistingMeterDataBadge';
            }
            if (jobType === 'Survey'){
            title = 'Existing Meter Data Badge';
            photoKey = 'ExistingMeterDataBadge';
            }
            break;
        
        case 'ecvToMov':
            if (jobType === 'Install') {
            title = 'New ECV to MOV';
            photoKey = 'NewEcvToMov';
            nextScreen = 'MeterDetailsPage'
            }
             
            else if (jobType === 'Maintenance') {
            title = 'Existing ECV to MOV';
            photoKey = 'ExistingEcvToMov';
            } else if (jobType === 'Removal') {
            title = ' Existing ECV to MOV';
            photoKey = 'ExistingEcvToMov';
            }
            if (jobType === 'Warrant'){
            title = 'Existing ECV to MOV';
            photoKey = 'ExistingEcvToMov';
            }
            if (jobType === 'Survey'){
            title = 'Existing ECV to MOV';
            photoKey = 'ExistingEcvToMov';
            }
            break;
    }
    console.log("getPhotoPageParams called with:", photoType, jobType, { title, photoKey });
    return { title, photoKey };
};
      




// Site Details Process

  // Site Questions Process
  
    
  
  // Meter Process
const MeterProcess = () => {
    return [


      //New ecv to mov
        <Stack.Screen key="GenericPhotoPageEcvToMovPhoto"
          name={`GenericPhotoPageEcvToMov-${jobType}`} 
          component={GenericPhotoPage} 
          initialParams={getPhotoPageParams('ecvToMov',jobType)} 
      />,

        
      // Meter data badge
        
        <Stack.Screen 
        key = "GenericPhotoPageMeterDataBadgePhoto"
        name={`GenericPhotoPageMeterDataBadgePhoto-${jobType}`} 
        component={GenericPhotoPage} 
        initialParams={getPhotoPageParams('meterDataBadge',jobType)}  
      />,
        //Meter index photo
      
        <Stack.Screen 
        key = "GenericPhotoPageMeterIndexPhoto"
        name={`GenericPhotoPageMeterIndexPhoto-${jobType}`}
        component={GenericPhotoPage} 
        initialParams={getPhotoPageParams('meterIndex',jobType)}  
      />,
        //Meter photo
        <Stack.Screen 
          key = "GenericPhotoPageMeterPhoto"
          name={`GenericPhotoPageMeterPhoto-${jobType}`} 
          component={GenericPhotoPage} 
          initialParams={getPhotoPageParams('meterPhoto',jobType)} 
        />      
        
    ];
  };
// Corrector Process
const CorrectorProcess = () => {
    return [
      
        
        //corrector photo
      
    ];

  }
  // Data Logger Process
const DataLoggerProcess = () => {
    return [
      
        
      
    ];
  }
  // Set and Seal Process
  const SetAndSealProcess = () => {
    const { numberOfStreams } = useContext(AppContext);
    let setAndSealScreens = [];
  
    // Add the initial screen for setting seal details
    setAndSealScreens.push(
      <Stack.Screen 
        key="StreamsSetSealDetailsPage"
        name="StreamsSetSealDetailsPage" 
        component={StreamsSetSealDetailsPage} 
      />
    );
  
    // Dynamically generate screens for each stream
    for (let i = 0; i < numberOfStreams; i++) {
      setAndSealScreens.push(
        <Stack.Screen 
          key={`SlamShutPhoto_${i}`}
          name={`GenericPhotoPage_SlamShut_${i}`} 
          component={GenericPhotoPage} 
          initialParams={{ title: `Sealed Slam Shut Photo - Stream ${i + 1}`, photoKey: `slamShutPhoto_${i}` }} 
        />,
        <Stack.Screen 
          key={`CreepReliefPhoto_${i}`}
          name={`GenericPhotoPage_CreepRelief_${i}`} 
          component={GenericPhotoPage} 
          initialParams={{ title: `Sealed Creep Relief Photo - Stream ${i + 1}`, photoKey: `creepReliefPhoto_${i}` }} 
        />,
        <Stack.Screen 
          key={`RegulatorPhoto_${i}`}
          name={`GenericPhotoPage_Regulator_${i}`} 
          component={GenericPhotoPage} 
          initialParams={{ title: `Sealed Regulator Photo - Stream ${i + 1}`, photoKey: `regulatorPhoto_${i}` }} 
        />
      );
    }
  
    // Add final screens after the loop for Vent Out Kiosk and Module Data Badge photos
    setAndSealScreens.push(
      <Stack.Screen 
        key="VentOutKioskPhoto"
        name="GenericPhotoPage_VentOutKiosk" 
        component={GenericPhotoPage} 
        initialParams={{ title: 'Vent Out Kiosk Photo', photoKey: 'ventOutKioskPhoto' }} 
      />,
      <Stack.Screen 
        key="ModuleDataBadgePhoto"
        name="GenericPhotoPage_ModuleDataBadge" 
        component={GenericPhotoPage} 
        initialParams={{ title: 'Module Data Badge Photo', photoKey: 'moduleDataBadgePhoto' }} 
      />
    );
  
    return setAndSealScreens;
  };  
  // Regulator Process
  const RegulatorProcess = () => {
    return [
      
        <Stack.Screen name="RegulatorPage" component={RegulatorPage} />,
        //regulator photo
        <Stack.Screen 
        key="GenericPhotoPageRegulatorPhoto"
        name="GenericPhotoPageRegulatorPhoto" 
        component={GenericPhotoPage} 
        initialParams={{ title: 'Photo of regulator', photoKey: 'regulator' }} 
      />,
        <Stack.Screen name="ChatterBoxPage" component={ChatterBoxPage} />,
        <Stack.Screen name="AdditionalMaterialPage" component={AdditionalMaterialPage} />
      
    ];
  };
  // Standards Process
  const StandardsProcess = () => {
    return [
      
        
      
    ];
  };
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
  const renderJobTypeScreens = () => {
    console.log("renderJobTypeScreens called, appContext:", appContext);
    if (!appContext || !appContext.jobType) {
      // Handle the case where jobType is not yet available
      console.log("jobType is not available in the context");
      return null;
    }
    switch (appContext.jobType) {
      case 'Install':
        return [
      
          ...MeterProcess(appContext.jobType),
          ...CorrectorProcess(),
          ...DataLoggerProcess(),
          // ... Add other process functions as needed
        ];
      // Add cases for other job types...
      default:
        return null;
    }
  };
  
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
      <Stack.Screen name = 'SiteQuestionsPage' component={SiteQuestionsPage}/>
      <Stack.Screen name="AssetTypeSelectionPage" component={AssetTypeSelectionPage} />
      <Stack.Screen key="GenericPhotoPageEcvToMovPhoto"
        name="EcvToMovExisting" 
        component={GenericPhotoPage} 
        initialParams={{title:'Existing Ecv To Mov Photo', photoKey: 'ExistingECV', nextScreen:'RemovedMeterDetailsPage'}} 
      />
        <Stack.Screen name="DataLoggerDetailsPage" component={DataLoggerDetailsPage} />
        
     

        <Stack.Screen name="RemovedMeterDetailsPage" component={MeterDetailsPage} />
      
        
        <Stack.Screen 
        key = "RemovedMeterDataBadgePhoto"
        name='RemovedMeterDataBadge '
        component={GenericPhotoPage} 
        initialParams={{title: 'Removed Meter data badge',photoKey: 'RemovedMeterDataBadge',nextScreen:'RemovedMeterIndex'}}
      />
       
      
        <Stack.Screen 
        key = "GenericPhotoPageMeterIndexPhoto"
        name='RemovedMeterIndex'
        component={GenericPhotoPage} 
        initialParams={{title: 'Removed Meter index photo',photoKey: 'RemovedMeterIndex',nextScreen:'RemovedMeterPhoto'}}
      />
        
        <Stack.Screen 
        key = "removedMeterPhoto"
            name='RemovedMeterPhoto'
            component={GenericPhotoPage} 
            initialParams={{title: 'Removed Meter photo',photoKey: 'RemovedMeterPhoto',nextScreen:'RemovedCorrector'}}
        />  
        <Stack.Screen name="RemovedCorrectorDetailsPage" component={CorrectorDetailsPage} />
        <Stack.Screen name="NewMeterDetailsPage" component={MeterDetailsPage} />
        <Stack.Screen key="EcvToMovPhoto"
        name={`EcvToMov`} 
        component={GenericPhotoPage} 
        initialParams={{title: 'ECV to MOV Photo',photoKey: 'EcvToMov',nextScreen:'MeterDataBadge'}}
      />        
        <Stack.Screen 
        key = "MeterDataBadgePhoto"
        name={`GenericPhotoPageMeterDataBadgePhoto-${jobType}`} 
        component={GenericPhotoPage} 
        initialParams={{title: 'MeterDataBadgePhoto',photoKey: 'MeterDataBadge',nextScreen:'MeterIndexPhoto'} }
      />
      
        <Stack.Screen 
        key = "MeterIndexPhoto"
        name='MeterIndexPhoto'
        component={GenericPhotoPage} 
        initialParams={{title: 'Meter index photo',photoKey: 'MeterIndex',nextScreen:'MeterPhoto'}}  
      />
        <Stack.Screen 
        key = "MeterPhoto"
            name='MeterPhoto'
            component={GenericPhotoPage} 
            initialParams={{title: 'Meter photo',photoKey: 'MeterPhoto',nextScreen:'CorrectorDetailsPage'}} 
        />
        <Stack.Screen name="CorrectorDetailsPage" component={CorrectorDetailsPage} />
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
    
        <Stack.Screen 
        key = "GenericPhotoPageSettingsLabelPhoto"
            name="SettingsLabelPhoto" 
            component={GenericPhotoPage} 
            initialParams={{ title: 'Settings label', photoKey: 'settingsLabel',nextScreen: 'SubmitSuccessPage'}}
        />
          <Stack.Screen name='SubmitSuccessPage' component={SubmitSuccessPage}/>  
{renderJobTypeScreens()}
          </Stack.Group>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

  export default MainNavigator;