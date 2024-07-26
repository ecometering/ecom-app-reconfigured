import { ActivityIndicator, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Context
import { AppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { NavigationProvider } from '../context/ProgressiveFlowRouteProvider';

// import screens from "..screens"
import CompletedJobsPage from '../screens/CompletedJobsPage';
import HomePage from '../screens/HomePage';
import InProgressJobsPage from '../screens/InProgressJobsPage';
// import JobTypePage from '../screens/JobTypePage';
import PlannedJobPage from '../screens/PlannedJobPage';
import SubmitSuccessPage from '../screens/SubmitSuccessPage';
import RebookPage from '../screens/jobs/RebookPage';

// calendar imports
import LoginPage from '../screens/LoginPage';

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
import CorrectorDetailsPage from '../screens/jobs/CorrectorDetailsPage';
import { unitedFlowNavigators } from './flowNavigatorsUnited';

const Stack = createStackNavigator();

const MainNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { siteDetails, jobType } = useContext(AppContext);
  const { authState } = useAuth();

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
              <Stack.Screen name="RebookPage" component={RebookPage} />
              <Stack.Screen
                name="SubmitSuccessPage"
                component={SubmitSuccessPage}
              />
              {unitedFlowNavigators.map((screen) => (
                <Stack.Screen
                  key={screen.name}
                  name={screen.name}
                  component={screen.component}
                  initialParams={screen.initialParams}
                />
              ))}
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
