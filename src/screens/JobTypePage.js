import React, { useContext } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { height, unitH } from "../utils/constant";
import { PrimaryColors } from "../theme/colors";
import { EcomPressable as Button } from "../components/ImageButton";
import Text from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import Header from "../components/Header";

function JobTypePage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);
  
  const setJobTypeAndNavigate = (jobType) => {
    console.log(`Setting job type to: ${jobType}`);
    
    // appContext.setJobTypes(jobType); // Set the job type in the context
    
    console.log(`${jobType} button was pressed`); // Log the message
    // Assuming you have a specific screen to navigate to after setting the job type
    navigation.navigate("SiteDetailsPage"); // Replace "YourNextScreen" with your actual next screen
  };
  

  const backPressed = () => {
    console.log("Going back from JobTypePage");
    navigation.goBack();
  };
  return (
    <SafeAreaView style={styles.flex}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={false}
        centerText={""}
        leftBtnPressed={backPressed}
      />
      <ScrollView style={styles.flex}>
        <View style={styles.body}>
          <Button
            onPress={() => setJobTypeAndNavigate("Install")}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Asset Install</Text>
          </Button>
          <View style={styles.spacer} />
          <Button
            onPress={() => setJobTypeAndNavigate("Removal")}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Asset Removal</Text>
          </Button>
          <View style={styles.spacer} />
          <Button
            onPress={() => setJobTypeAndNavigate("Exchange")}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Asset Exchange</Text>
          </Button>
          <View style={styles.spacer} />
          <Button
            onPress={() => setJobTypeAndNavigate("Survey")}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Survey</Text>
          </Button>
          <View style={styles.spacer} />
          <Button
            onPress={() => setJobTypeAndNavigate("Warrant")}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Warrant</Text>
          </Button>
          <View style={styles.spacer} />
          <Button
            onPress={() => setJobTypeAndNavigate("Maintenance")}
            style={styles.button}
          >
            <Text style={styles.buttonTxt}>Maintenance / CallOut</Text>
          </Button>
          <View style={styles.spacer} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  body: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.70,
  },
  spacer: {
    height: unitH * 20,
  },
  button: {
    width: "70%",
    height: unitH * 50,
    backgroundColor: PrimaryColors.Blue,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 1,
    borderColor: "black",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.7,
    shadowRadius: 2,
    shadowOffset: {
      width: 2.5,
      height: 2.5,
    },
  },
  buttonTxt: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
  },
});

export default JobTypePage;
