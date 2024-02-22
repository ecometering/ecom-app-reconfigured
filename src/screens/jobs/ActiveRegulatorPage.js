
import useState from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import TextInputWithTitle, { InputRowWithTitle } from '../../components/TextInput'; // Adjust path as needed
import EcomDropDown from '../../components/DropDown'
import ImagePickerButton from '../../components/ImagePickerButton';
import { PrimaryColors } from '../../theme/colors'; // Adjust path as needed
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";
import { openDatabase,addOrUpdateJobData } from '../../utils/database';


const ActiveRegulatorPage = () => {
  const [manufacturer, setManufacturer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [size, setSize] = useState('');
  const [imageUri, setImageUri] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  // Dummy sizes for the dropdown
  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];
  const details = {
    manufacturer,
    serialNumber,
    size,
  };
  
  const imageData = {
    imageUri,
  };
  
  const backPressed = () => {
    console.log("Back button pressed");


    navigation.goBack();
  };

  const nextPressed = async () => {
    console.log("Next button pressed");

    try {
      // Save the data using the route title as an identifier
      await saveStreamData(route.params.title, streamData);
      console.log("Data saved successfully. Navigating to next screen.");
    } catch (error) {
      console.error("Failed to save data:", error);
      // Optionally handle the error, e.g., show an alert to the user
    }
  
    // Proceed to navigate after saving
  
    console.log("Navigating to next screen:", nextScreen);
    navigation.navigate(nextScreen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
      <Header
          hasLeftBtn={true}
          hasCenterText={true}
          hasRightBtn={true}
          centerText={title}
          leftBtnPressed={backPressed}
          rightBtnPressed={nextPressed}
        />
       <View style={styles.card}>
          <TextInputWithTitle
            title="Manufacturer"
            value={manufacturer}
            onChangeText={setManufacturer}
            placeholder="Enter manufacturer"
          />
          <TextInputWithTitle
            title="Serial Number"
            value={serialNumber}
            onChangeText={setSerialNumber}
            placeholder="Enter serial number"
          />
          <EcomDropDown
            value={size}
            valueList={sizeOptions}
            placeholder="Select Size"
            onChange={(selectedItem) => setSize(selectedItem.value)}
          />
        </View>
        <ImagePickerButton
          onImageSelected={setImageUri}
        />
        {/* Additional content can be added here */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  card: {
    padding: 16,
    backgroundColor: PrimaryColors.White,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    marginBottom: 20, // Space between card and ImagePickerButton
  },
});

export default ActiveRegulatorPage;
