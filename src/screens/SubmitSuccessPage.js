import { View, Text, Button } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const SubmitSuccessPage = () => {
  const navigation = useNavigation();

  return (
    <View style={{ padding: 20 }}>
      <Text>SubmitSuccessPage</Text>
      <Button
        title="OK"
        onPress={() => {
          navigation.navigate("Home");
        }}
      />
    </View>
  );
};

export default SubmitSuccessPage;
