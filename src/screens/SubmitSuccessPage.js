import { View, Text, Button } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const SubmitSuccessPage = () => {
  const navigation = useNavigation();
  async function fetchAndUploadJobData() {
    try {
      const db = await openDatabase();
       // Make sure this is the correct way to get your db instance
       console.log("DB: ", db);
      console.log ("[fetchAndUploadJobData] Fetching job data from local database.");

       const allJobData = await fetchAllJobData(db);
      console.log("[fetchAndUploadJobData] Job data fetched successfully.");
      console.log("[fetchAndUploadJobData] converting to large  JSON string...");
      const jsonData = JSON.stringify(allJobData);
console.log("[fetchAndUploadJobData] Uploading job data to server...");
      await uploadData(jsonData);
      console.log("[fetchAndUploadJobData] Job data uploaded successfully.");
    } catch (error) {
      console.error("[fetchAndUploadJobData] Error:", error);
    }
  }
  return (
    <View style={{ padding: 20 }}>
      <Text>Submit Job</Text>
      <Button
        title="Yes"
        onPress={() => {
          fetchAndUploadJobData();
          navigation.navigate("Home");
        }}
      />
    </View>
  );
};

export default SubmitSuccessPage;
