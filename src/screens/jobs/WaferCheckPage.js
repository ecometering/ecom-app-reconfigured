
import useState from 'react';
import { View, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import TextInputWithTitle, { InputRowWithTitle } from '../../components/TextInput'; // Adjust path as needed
import EcomDropDown from '../../components/DropDown'
import ImagePickerButton from '../../components/ImagePickerButton';
import { PrimaryColors } from '../../theme/colors'; // Adjust path as needed
import Header from "../../components/Header";
import { useNavigation, useRoute } from "@react-navigation/native";

const WaferCheckPage = () => {
  const [manufacturer, setManufacturer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [size, setSize] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [StreamOutletValveType , setStreamOutletValveType] = useState(''); // Add this line
  const [StreamOutletValveSize , setStreamOutletValveSize] = useState(''); // Add this line
  const [StreamOutletValveManufacturer , setStreamOutletValveManufacturer] = useState(''); // Add this line
  const [StreamOutletValveModel, setStreamOutletValveModel] = useState(''); // Add this line
  const navigation = useNavigation();
  const route = useRoute();
  // Dummy sizes for the dropdown
  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];
  const backPressed = () => {
    console.log("Back button pressed");
    navigation.goBack();
  };

  const nextPressed = async () => {
    console.log("Next button pressed");
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
          
          <EcomDropDown
            value={size}
            valueList={sizeOptions}
            placeholder="Select Size"
            onChange={(selectedItem) => setSize(selectedItem.value)}
          />
          <TextInputWithTitle
            title="Stream outlet Valve manufacturer
            "
            value={StreamOutletValveManufacturer}
            onChangeText={text => setStreamOutletValveManufacturer(text)}
            
            placeholder="Enter manufacturer"
          />
          <TextInputWithTitle
            title="Stream outlet Valve model
            "
            value={StreamOutletValveModel}
            onChangeText={text => setStreamOutletValveModel(text)}
            placeholder="Enter model"/>
          
          <EcomDropDown
            value={StreamOutletValveType}
            valueList={valveType}
            placeholder="Select type"
            onChange={(selectedItem) => setStreamOutletValveType(selectedItem.value)}
          />
          <EcomDropDown
            value={StreamOutletValveSize}
            valueList={valveSize}
            placeholder="Select Size"
            onChange={(selectedItem) => setStreamOutletValveSize(selectedItem.value)}
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

export default WaferCheckPage;
