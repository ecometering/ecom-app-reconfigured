import React, { useContext } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { height, unitH } from "../utils/constant";
import { PrimaryColors } from "../theme/colors";
import { EcomPressable as Button } from "../components/ImageButton";
import Text from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import { AppContext } from "../context/AppContext";
import Header from "../components/Header";
import { addOrUpdateJobData, fetchJobDataById } from '../utils/database';

function JobTypePage() {
  const navigation = useNavigation();
  const appContext = useContext(AppContext);

  const setJobTypeAndNavigate = async (jobType) => {
    console.log(`Setting job type to: ${jobType} and navigating.`);
    
    try {
       const jobId = `JOB-${Date.now()}`;
        // await addOrUpdateJobData(jobId, { jobId: jobId });
      const jobData = {
        jobType: jobType,
        startDate: new Date().toISOString(),
        jobStatus: "in progress",
        progress: 0, // Assuming progress starts at 0
      };

      // Directly save job data to the Jobs table without checking for table existence
      // as we assume table creation is handled at app initialization level
      // await addOrUpdateJobData(jobId, jobData); // jobNumber is assumed to be unique identifier
      // const updatedJob = await fetchJobDataById(jobId);
      // console.log(`Updated job entry:`, updatedJob);
      console.log(`Job type ${jobType} saved successfully.`);
      navigation.navigate("SiteDetailsPage",{'totalPages':9,'currentPage':1,'jobId':jobId,'jobType':jobType});

    } catch (error) {
      console.error("Error setting job type and navigating:", error);
    }
  };

  return (
    <SafeAreaView style={styles.flex}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={() => navigation.goBack()}
        centerText=""
      />
      <ScrollView style={styles.flex}>
        <View style={styles.body}>
          {["Install", "Removal", "Exchange", "Survey", "Warrant", "Maintenance"].map((type, index) => (
            <View key={index} style={{ alignItems: 'center' }}>
              <Button
                onPress={() => setJobTypeAndNavigate(type)}
                style={styles.button}
              >
                <Text style={styles.buttonTxt}>{`Asset ${type}`}</Text>
              </Button>
              <View style={styles.spacer} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  body: {
    alignItems: "center",
    justifyContent: "center",
    height: height * 0.70,
  },
  spacer: { height: unitH * 20 },
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
