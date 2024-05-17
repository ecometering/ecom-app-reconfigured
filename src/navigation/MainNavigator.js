import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getItemAsync } from 'expo-secure-store';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
// import screens from "..screens"
import CompletedJobsPage from '../screens/CompletedJobsPage';
import HomePage from '../screens/HomePage';
import InProgressJobsPage from '../screens/InProgressJobsPage';
import JobTypePage from '../screens/JobTypePage';
import PlannedJobPage from '../screens/PlannedJobPage';
import SubmitSuccessPage from '../screens/SubmitSuccessPage';
import RebookPage from '../screens/jobs/RebookPage';
import MaintenanceQuestionsPage from '../screens/maintenance/MaintenanceQuestionsPage';
// calendar imports
import CalendarPage from '../screens/calendar/CalendarPage';
import LoginPage from '../screens/LoginPage';
import DataLoggerDetailsPage from '../screens/jobs/DataLoggerDetailsPage';
import Test from '../screens/test';
import EcvPage from '../screens/survey/EcvPage';
import KioskPage from '../screens/survey/KioskPage';
// maintenance pages imports

//import standards inport from ../screens/standards
import ExtraPhotoPage from '../screens/standards/ExtraPhotoPage';
import GasSafeWarningPage from '../screens/standards/GasSafeWarningPage';
import RiddorReportPage from '../screens/standards/RiddorReportPage';
import SnClientInfoPage from '../screens/standards/SnClientInfoPage';
import StandardPage from '../screens/standards/StandardPage';
import MeterDetailsPage from '../screens/jobs/MeterDetailsPage';

//  jobs pages imports

import SiteDetailsPage from '../screens/jobs/SiteDetailsPage';
import SiteQuestionsPage from '../screens/jobs/SiteQuestionsPage';

// generic photo page
import GenericPhotoPage from '../screens/jobs/GenericPhotoPage';

// navigation stacks
import ExchangeFlowNavigator from './exchangeFlowNavigator';
import InstallFlowNavigator from './installFlowNavigator';
import MaintenanceFlowNavigator from './maintenanceFlowNavigator';
import RemovalFlowNavigator from './removalFlowNavigator';
import SurveyFlowNavigator from './surveyFlowNavigator';
import CorrectorDetailsPage from '../screens/jobs/CorrectorDetailsPage';
import StreamsSetSealDetailsPage from '../screens/jobs/StreamsSetSealDetailsPage';
import FilterPage from '../screens/jobs/FilterPage';
import SlamshutPage from '../screens/jobs/SlamshutPage';
import WaferCheckPage from '../screens/jobs/WaferCheckPage';
import ReliefRegulatorPage from '../screens/jobs/ReliefRegulatorPage';
import ActiveRegulatorPage from '../screens/jobs/ActiveRegulatorPage';
import { NavigationProvider } from '../../ExampleFlowRouteProvider';

const Stack = createStackNavigator();
const StreamsNavigator = createStackNavigator();

const MainNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { extraPhotoCount, siteDetails } = useContext(AppContext);
  const { jobType } = useContext(AppContext);
  const { authState, onLogout } = useAuth();
  const [numberOfStreams, setNumberOfStreams] = useState(0);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
      } catch (err) {
        console.log('Error checking token: ', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Additional Photos Process
  const AdditionalPhotosProcess = () => {
    let additionalPhotoScreens = [];

    for (let i = 0; i < extraPhotoCount; i++) {
      const name = i === 0 ? 'ExtraPhotoPage' : `ExtraPhotoPage_${i}`;
      const nextScreen =
        i + 1 < extraPhotoCount
          ? `ExtraPhotoPage_${i + 1}`
          : 'NextScreenAfterPhotos'; // Adjust 'NextScreenAfterPhotos' to your actual next screen

      additionalPhotoScreens.push({
        key: name,
        name: name,
        component: ExtraPhotoPage,
        initialParams: { photoNumber: i + 1, nextScreen: nextScreen },
      });
    }

    return additionalPhotoScreens;
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
      return streamIndex + 1 < numberOfStreams
        ? `${screenOrder[0]}-${streamIndex + 1}`
        : 'RegulatorPage';
    } else {
      return `${screenOrder[nextScreenIndex]}-${streamIndex}`;
    }
  };

  const RenderNavigator = () => {
    switch (jobType) {
      case 'Exchange':
        return <ExchangeFlowNavigator />;
      case 'Install':
        return <InstallFlowNavigator />;
      case 'Maintenance':
        return <MaintenanceFlowNavigator />;
      case 'Survey':
        return <SurveyFlowNavigator />;
      case 'Removal':
      case 'Warrant':
        return <RemovalFlowNavigator />;
      default:
        return null;
    }
  };

  const StreamsFlow = () => {
    return (
      <StreamsNavigator.Navigator screenOptions={{ headerShown: false }}>
        {Array.from({ length: numberOfStreams }, (_, index) => (
          <React.Fragment key={index}>
            <StreamsNavigator.Screen
              name={`FilterPage-${index}`}
              component={FilterPage}
              initialParams={{
                title: `Filter ${index + 1}`,
                nextScreen: `SlamshutPage-${index}`,
              }}
            />
            <StreamsNavigator.Screen
              name={`SlamshutPage-${index}`}
              component={SlamshutPage}
              initialParams={{
                title: `Slamshut ${index + 1}`,
                nextScreen: `SealedSlamShutPhotoPage-${index}`,
              }}
            />
            <StreamsNavigator.Screen
              name={`SealedSlamShutPhotoPage-${index}`}
              component={GenericPhotoPage}
              initialParams={{
                title: `Sealed Slam Shut Photo ${index + 1}`,
                nextScreen: `ActiveRegulatorPage-${index}`,
                photoKey: `sealedSlamShutPhoto-${index}`,
              }}
            />
            <StreamsNavigator.Screen
              name={`ActiveRegulatorPage-${index}`}
              component={ActiveRegulatorPage}
              initialParams={{
                title: `Active Regulator ${index + 1}`,
                nextScreen: `ReliefRegulatorPage-${index}`,
              }}
            />
            <StreamsNavigator.Screen
              name={`ReliefRegulatorPage-${index}`}
              component={ReliefRegulatorPage}
              initialParams={{
                title: `Relief Regulator ${index + 1}`,
                nextScreen: `WaferCheckPage-${index}`,
              }}
            />
            <StreamsNavigator.Screen
              name={`WaferCheckPage-${index}`}
              component={WaferCheckPage}
              initialParams={{
                title: `Wafer Check ${index + 1}`,
                nextScreen: getNextScreen(
                  `WaferCheckPage-${index}`,
                  numberOfStreams
                ),
              }}
            />
          </React.Fragment>
        ))}
      </StreamsNavigator.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <NavigationProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {authState?.authenticated ? (
            <Stack.Group>
              <Stack.Screen name="Home" component={HomePage} />
              <Stack.Screen
                name="Corrector Details"
                component={CorrectorDetailsPage}
              />
              <Stack.Screen name="CalendarPage" component={CalendarPage} />
              <Stack.Screen name="NewJobPage" component={JobTypePage} />
              <Stack.Screen name="PlannedJobPage" component={PlannedJobPage} />
              <Stack.Screen
                name="InProgressJobsPage"
                component={InProgressJobsPage}
              />
              <Stack.Screen
                name="CompletedJobsPage"
                component={CompletedJobsPage}
              />

              <Stack.Screen
                name="test"
                component={MeterDetailsPage}
                initialParams={{
                  title: 'DataLoggerDetailsPage',
                  nextScreen: 'EcvPage',
                }}
              />
              <Stack.Screen
                name="kioskPage"
                component={KioskPage}
                initialParams={{
                  title: 'Kiosk details',
                  nextScreen: 'EcvPage',
                }}
              />
              <Stack.Screen
                name="EcvPage"
                component={EcvPage}
                initialParams={{ title: 'ECV details', nextScreen: 'vents' }}
              />

              {/* StreamsFlow component rendered here */}
              {/* <Stack.Screen name="StreamsFlow" component={StreamsFlow} /> */}

              <Stack.Screen
                name="SiteDetailsPage"
                component={SiteDetailsPage}
                initialParams={{ progress: 1 }}
              />
              <Stack.Screen
                name="SitePhotoPage"
                component={GenericPhotoPage}
                initialParams={{
                  title: 'Site Photo',
                  photoKey: 'sitePhoto',
                  nextScreen:
                    jobType === 'Warrant' && !siteDetails.confirmWarrant
                      ? 'SubmitSuccessPage'
                      : 'SiteQuestionsPage',
                  progress: 2,
                }}
              />
              <Stack.Screen
                name="SiteQuestionsPage"
                component={SiteQuestionsPage}
                initialParams={{
                  title: 'Site Questions',
                  photoKey: 'bypassPhoto',
                }}
              />

              {/* Render the appropriate navigator based on the jobType */}
              <Stack.Screen
                name="JobTypeNavigator"
                component={RenderNavigator}
              />

              <Stack.Screen name="StandardPage" component={StandardPage} />
              <Stack.Screen
                name="RiddorReportPage"
                component={RiddorReportPage}
              />
              <Stack.Screen
                name="SnClientInfoPage"
                component={SnClientInfoPage}
              />
              <Stack.Screen
                name="GasSafeWarningPage"
                component={GasSafeWarningPage}
              />
              <Stack.Screen
                name="SiteSurveyDrawing"
                component={GenericPhotoPage}
                initialParams={{
                  title: 'Site Survey Drawing',
                  photoKey: 'siteSurveyDrawing',
                  nextScreen:
                    jobType === 'Survey'
                      ? 'ExtraPhotoPage'
                      : 'SiteQuestionsPage',
                  progress: 2,
                }}
              />

              <Stack.Screen
                key="CompositeLabelPhoto"
                name="CompositeLabelPhoto"
                component={GenericPhotoPage}
                initialParams={{
                  title: 'Composite label',
                  photoKey: 'compositeLabel',
                  nextScreen: 'DSEARLabelPhoto',
                }}
              />

              <Stack.Screen
                key="DSEARLabelPhoto"
                name="DSEARLabelPhoto"
                component={GenericPhotoPage}
                initialParams={{
                  title: 'DSEAR label',
                  photoKey: 'dsearLabel',
                  nextScreen:
                    jobType === 'Survey'
                      ? 'SiteSurveyDrawing'
                      : 'ExtraPhotoPage',
                }}
              />

              <Stack.Screen
                name="ExtraPhotoPage"
                component={ExtraPhotoPage}
                initialParams={{
                  photoNumber: 0,
                  photoKey: 'extraPhotos_0,',
                  title: 'Extra Photos ',
                }}
              />
              {AdditionalPhotosProcess().map((screen) => (
                <Stack.Screen
                  key={screen.key}
                  name={screen.name}
                  component={screen.component}
                  initialParams={screen.initialParams}
                />
              ))}
              <Stack.Screen name="RebookPage" component={RebookPage} />
              <Stack.Screen
                name="SubmitSuccessPage"
                component={SubmitSuccessPage}
              />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen name="LogIn" component={LoginPage} />
            </Stack.Group>
          )}
        </Stack.Navigator>
      </NavigationProvider>
    </NavigationContainer>
  );
};

export default MainNavigator;
