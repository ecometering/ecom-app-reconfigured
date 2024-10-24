import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Contexts
import { AppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { NavigationProvider } from '../context/ProgressiveFlowRouteProvider';

// Import screens
import HomePage from '../screens/HomePage';
import HelpGuidesPage from '../screens/HelpGuidesPage';
import LoginPage from '../screens/LoginPage';
import CompletedJobsPage from '../screens/CompletedJobsPage';
import InProgressJobsPage from '../screens/InProgressJobsPage';
import PlannedJobPage from '../screens/PlannedJobPage';
import SubmitSuccessPage from '../screens/SubmitSuccessPage';
import AbortPage from '../screens/jobs/AbortPage';
import MeterDetailsPage from '../screens/jobs/MeterDetailsPage';
import SiteDetailsPage from '../screens/jobs/SiteDetailsPage';
import SiteQuestionsPage from '../screens/jobs/SiteQuestionsPage';
import GenericPhotoPage from '../screens/jobs/GenericPhotoPage';
import StandardPage from '../screens/standards/StandardPage';
import RiddorReportPage from '../screens/standards/RiddorReportPage';
import SnClientInfoPage from '../screens/standards/SnClientInfoPage';
import GasSafeWarningPage from '../screens/standards/GasSafeWarningPage';
import ExtraPhotoPage from '../screens/standards/ExtraPhotoPage';
import CorrectorDetailsPage from '../screens/jobs/CorrectorDetailsPage';
import PdfViewerPage from '../screens/PdfViewerPage';
import { unitedFlowNavigators } from './flowNavigatorsUnited';

// Assets
import fileIcon from '../../assets/images/folder.png';
import homeIcon from '../../assets/images/home.png';

// Navigation stacks
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator with Home and Help Guides
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconSource;

          if (route.name === 'Home') {
            iconSource = homeIcon;
          } else if (route.name === 'Help Guides') {
            iconSource = fileIcon;
          }

          // Return the icon component
          return (
            <Image
              source={iconSource}
              style={{
                width: 24,
                height: 24,
                tintColor: focused ? '#007AFF' : '#8e8e8f',
              }}
              resizeMode="contain"
            />
          );
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e8f',
        tabBarShowLabel: false, // Disable labels globally
      })}
    >
      <Tab.Screen
        options={{
          tabBarLabel: () => null, // Hide the label for Home
          headerShown: false, // Hide the header title for Home
        }}
        name="Home"
        component={HomePage}
      />
      <Tab.Screen
        options={{
          tabBarLabel: () => null, // Hide the label for Home
          headerShown: false, // Hide the header title for Home
        }}
        name="Help Guides"
        component={HelpGuidesPage}
      />
    </Tab.Navigator>
  );
};

// Main Navigator Component
const MainNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { siteDetails, jobType } = useContext(AppContext);
  const { authState } = useAuth();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Your login check logic here (e.g., check for token)
      } catch (err) {
        console.log('Error checking token: ', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
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
            <>
              <Stack.Screen name="Main" component={BottomTabNavigator} />
              <Stack.Screen
                name="CompletedJobsPage"
                component={CompletedJobsPage}
              />
              <Stack.Screen
                name="InProgressJobsPage"
                component={InProgressJobsPage}
              />
              <Stack.Screen name="PlannedJobPage" component={PlannedJobPage} />
              <Stack.Screen
                name="SubmitSuccessPage"
                component={SubmitSuccessPage}
              />
              <Stack.Screen name="AbortPage" component={AbortPage} />
              <Stack.Screen
                name="MeterDetailsPage"
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
                name="ExtraPhotoPage"
                component={ExtraPhotoPage}
                initialParams={{
                  photoNumber: 0,
                  photoKey: 'extraPhotos_0,',
                  title: 'Extra Photos ',
                }}
              />
              <Stack.Screen
                name="CorrectorDetailsPage"
                component={CorrectorDetailsPage}
              />
              <Stack.Screen name="PdfViewerPage" component={PdfViewerPage} />
              {unitedFlowNavigators.map((screen) => (
                <Stack.Screen
                  key={screen.name}
                  name={screen.name}
                  component={screen.component}
                  initialParams={screen.initialParams}
                />
              ))}
            </>
          ) : (
            <Stack.Screen name="LogIn" component={LoginPage} />
          )}
        </Stack.Navigator>
      </NavigationProvider>
    </NavigationContainer>
  );
};

export default MainNavigator;
