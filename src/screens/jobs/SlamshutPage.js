import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import Header from '../../components/Header';
import EcomDropDown from '../../components/DropDown';
import TextInputWithTitle from '../../components/TextInput';
import ImagePickerButton from '../../components/ImagePickerButton';

import { PrimaryColors } from '../../theme/colors';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';

const SlamshutPage = () => {
  const [manufacturer, setManufacturer] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [size, setSize] = useState('');
  const [imageUri, setImageUri] = useState('');

  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const route = useRoute();
  const { title } = route.params;

  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];

  const backPressed = () => {
    goToPreviousStep();
  };

  const nextPressed = async () => {
    goToNextStep();
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

        <ImagePickerButton onImageSelected={setImageUri} />

        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
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
    marginBottom: 20,
  },
  image: {
    height: 200,
    marginTop: 16,
  },
});

export default SlamshutPage;
