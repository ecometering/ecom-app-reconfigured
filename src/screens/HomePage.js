import React, { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { width, height, unitH } from "../utils/constant";
import { PrimaryColors } from "../theme/colors";
import { EcomPressable as Button } from "../components/ImageButton";
import Text from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import { Button as RnButton } from "react-native";
import { deleteItemAsync } from "expo-secure-store";
import { AppContext } from "../context/AppContext";

function HomePage() {
  const navigation = useNavigation();

  const appContext = useContext(AppContext)

  const navigationToPage = ({ navigationName }) => {
    navigation.navigate(navigationName);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.body}>
        <Button
          onPress={() => {
            navigationToPage({ navigationName: "CalendarPage" });
          }}
          style={styles.button}
        >
          <Text style={styles.buttonTxt}>Engineers Calendar</Text>
        </Button>
        <Button
          onPress={() => {
            navigationToPage({ navigationName: "NewJobPage" });
          }}
          style={styles.button}
        >
          <Text style={styles.buttonTxt}>New Job</Text>
        </Button>
        <Button
          onPress={() => {
            navigationToPage({ navigationName: "PlannedJobPage" });
          }}
          style={styles.button}
        >
          <Text style={styles.buttonTxt}>Planned Job</Text>
        </Button>
      </View>
      <RnButton title="Logout" onPress={() => {
        deleteItemAsync("userToken").then(() => {
          appContext.setUserLogged(false)
        })
      }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    width: width,
    height: height,
  },
  body: {
    flex: 1,
    width: width,
    height: height,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingVertical: height * 0.2,
  },
  spacer: {
    height: unitH * 30,
  },
  button: {
    width: "80%",
    height: unitH * 150,
    backgroundColor: PrimaryColors.White,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: PrimaryColors.Black,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 1,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  buttonTxt: {
    color: "black",
    fontSize: 20,
    fontWeight: "500",
  },
});

export default HomePage;
