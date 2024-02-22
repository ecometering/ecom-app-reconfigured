import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { getItemAsync } from "expo-secure-store";
import React,{ useContext,useEffect,useState } from "react";
import { ActivityIndicator,View } from "react-native";
import { AppContext } from "../context/AppContext";

// import screens from "..screens"
import CompletedJobsPage from "../screens/CompletedJobsPage";
import HomePage from "../screens/HomePage";
import InProgressJobsPage from "../screens/InProgressJobsPage";
import JobTypePage from "../screens/JobTypePage";
import PlannedJobPage from "../screens/PlannedJobPage";
import SubmitSuccessPage from "../screens/SubmitSuccessPage";
// calendar imports
import CalendarPage from "../screens/calendar/CalendarPage";

// maintenance pages imports

//import standards inport from ../screens/standards
import ExtraPhotoPage from "../screens/standards/ExtraPhotoPage";
import GasSafeWarningPage from "../screens/standards/GasSafeWarningPage";
import RiddorReportPage from "../screens/standards/RiddorReportPage";
import SnClientInfoPage from "../screens/standards/SnClientInfoPage";
import StandardPage from "../screens/standards/StandardPage";

//  jobs pages imports

import SiteDetailsPage from "../screens/jobs/SiteDetailsPage";
import SiteQuestionsPage from "../screens/jobs/SiteQuestionsPage";

// generic photo page
import GenericPhotoPage from "../screens/jobs/GenericPhotoPage";

// navigation stacks
import ExchangeFlowNavigator from "./exchangeFlowNavigator";
import InstallFlowNavigator from "./installFlowNavigator";
import MaintenanceFlowNavigator from "./maintenanceFlowNavigator";
import RemovalFlowNavigator from "./removalFlowNavigator";
import SurveyFlowNavigator from "./surveyFlowNavigator";

const Stack = createStackNavigator();

const MainNavigator = () => {
	const [isToken, setIsToken] = useState(null);
	const { extraPhotoCount, setUserLogged, userLogged } = useContext(AppContext);
	const { jobType } = useContext(AppContext);

	useEffect(() => {
		getItemAsync("userToken")
			.then((token) => {
				setIsToken(token ? true : false);
				setUserLogged(!!token);
			})
			.catch((err) => {
				setIsToken(false);
			});
	}, []);

	if (isToken === null) {
		return (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	// Additional Photos Process
	const AdditionalPhotosProcess = () => {
		let additionalPhotoScreens = [];

		for (let i = 0; i < extraPhotoCount; i++) {
			const name = i === 0 ? "ExtraPhotoPage" : `ExtraPhotoPage_${i}`;
			const nextScreen = i + 1 < extraPhotoCount ? `ExtraPhotoPage_${i + 1}` : "NextScreenAfterPhotos"; // Adjust 'NextScreenAfterPhotos' to your actual next screen

			additionalPhotoScreens.push({
				key: name,
				name: name,
				component: ExtraPhotoPage,
				initialParams: { photoNumber: i + 1, nextScreen: nextScreen }
			});
		}

		return additionalPhotoScreens;
	};

	// ...

	const RenderNavigator = () => {
		switch (jobType) {
			case "Exchange":
				return "exchange";
			case "Install":
				return "install";
			case "Maintenance":
				return "maintenance";
			case "Survey":
				return "survey";
			case "Removal":
				return "removal";
			case "Warrant":
				return "removal";
			default:
				return null;
		}
	};
	return (
		<NavigationContainer>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Group>
					<Stack.Screen name="Home" component={HomePage} />
					<Stack.Screen name="CalendarPage" component={CalendarPage} />
					<Stack.Screen name="NewJobPage" component={JobTypePage} />
					<Stack.Screen name="PlannedJobPage" component={PlannedJobPage} />
					<Stack.Screen name="InProgressJobsPage" component={InProgressJobsPage} />
					<Stack.Screen name="CompletedJobsPage" component={CompletedJobsPage} />
					<Stack.Screen name="SiteDetailsPage" component={SiteDetailsPage} />
					<Stack.Screen name="SitePhotoPage" component={GenericPhotoPage} initialParams={{ title: "Site Photo", photoKey: "sitePhoto", nextScreen: "SiteQuestionsPage" }} />
					<Stack.Screen name="SiteQuestionsPage" component={SiteQuestionsPage} />
					<Stack.Screen name="install" component={InstallFlowNavigator} />
					<Stack.Screen name="exchange" component={ExchangeFlowNavigator} />
					<Stack.Screen name="maintenance" component={MaintenanceFlowNavigator} />
					<Stack.Screen name="survey" component={SurveyFlowNavigator} />
					<Stack.Screen name="removal" component={RemovalFlowNavigator} />

					<Stack.Screen name="StandardPage" component={StandardPage} />
					<Stack.Screen name="RiddorReportPage" component={RiddorReportPage} />
					<Stack.Screen name="SnClientInfoPage" component={SnClientInfoPage} />
					<Stack.Screen name="GasSafeWarningPage" component={GasSafeWarningPage} />

					<Stack.Screen
						key="CompositeLabelPhoto"
						name="CompositeLabelPhoto"
						component={GenericPhotoPage}
						initialParams={{ title: "Composite label", photoKey: "compositeLabel", nextScreen: "DSEARLabelPhoto" }}
					/>

					<Stack.Screen
						key="DSEARLabelPhoto"
						name="DSEARLabelPhoto"
						component={GenericPhotoPage}
						initialParams={{ title: "DSEAR label", photoKey: "dsearLabel", nextScreen: "SettingsLabelPhoto" }}
					/>

					<Stack.Screen
						name="SettingsLabelPhoto"
						component={GenericPhotoPage}
						initialParams={{ title: "Settings label", photoKey: "settingsLabel", nextScreen: "ExtraPhotoPage" }} // Adjusted to navigate to the first extra photo page correctly
					/>
					<Stack.Screen name="ExtraPhotoPage" component={ExtraPhotoPage} initialParams={{ photoNumber: 0, photoKey: "extraPhotos_0,", title: "Extra Photos " }} />
					{AdditionalPhotosProcess().map((screen) => (
						<Stack.Screen key={screen.key} name={screen.name} component={screen.component} initialParams={screen.initialParams} />
					))}

					<Stack.Screen name="SubmitSuccessPage" component={SubmitSuccessPage} />
				</Stack.Group>
				{/* )}
				 */}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default MainNavigator;
