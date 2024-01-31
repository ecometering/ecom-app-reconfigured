import { Alert } from "react-native";

class EcomHelper {
  showInfoMessage(txt) {
    Alert.alert("Info", txt, [{ text: "Ok", onPress: () => {} }]);
  }

  showSuccessMessage(txt) {
    Alert.alert("Success", txt, [{ text: "Ok", onPress: () => {} }]);
  }

  getYears = (year) => {
    let array = [];
    for (let i = year; i <= new Date().getFullYear(); i++) {
      let json = { label: i.toString(), value: i };
      array.push(json);
    }

    const reversedArr = array.reverse();
    return reversedArr;
  };
}

const ecomHelper = new EcomHelper();
export default ecomHelper;
