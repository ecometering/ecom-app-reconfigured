import React, { useContext, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Dimensions,
} from 'react-native';
import Text from '../../components/Text';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import TextInput from '../../components/TextInput';
import EcomHelper from '../../utils/ecomHelper';
import { AppContext } from '../../context/AppContext';
import BarcodeScanner from '../../components/BarcodeScanner';
import ImagePickerButton from '../../components/ImagePickerButton';
import { makeFontSmallerAsTextGrows } from '../../utils/styles';
import { useProgressNavigation } from '../../context/ExampleFlowRouteProvider';
const { width, height } = Dimensions.get('window');
const alphanumericRegex = /^[a-zA-Z0-9]+$/;

function ChatterBoxPage() {
  const navigation = useNavigation();
  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const appContext = useContext(AppContext);
  const jobType = appContext.jobType;
  const title = jobType === 'Install' ? 'New Meter Details' : jobType;
  const regulatorDetails = appContext.regulatorDetails;
  const camera = useRef(null);
  const [isModal, setIsModal] = useState(false);
  const [serialNumber, setSerialNumber] = useState(
    regulatorDetails?.chatterSerialNumber
  );
  const [manufacturer, setManufacturer] = useState(
    regulatorDetails?.chatterManufacturer
  );
  const [chatterBoxImage, setchatterBoxImage] = useState(
    regulatorDetails?.chatterImage
  );
  const [model, setModel] = useState(regulatorDetails?.chatterModel);

  const updateChatterBoxDetails = async () => {
    // Open the database connection
    const db = await openDatabase();
    // Assuming jobId is available in your component's state or context
    const jobId = appContext.jobId;

    // Serialize the photo details if you're storing images as part of the chatter box details
    const photoDetails = {
      title: 'ChatterBox Image',
      uri: chatterBoxImage,
      photoKey: 'chatterBoxImage',
    };
    const photoDetailsJSON = JSON.stringify(photoDetails);

    // Fetch existing photos JSON from the database, append new photo details, and update
    const existingPhotosJSON = await fetchPhotosJSON(db, jobId);
    const updatedPhotosJSON = appendPhotoDetail(
      existingPhotosJSON,
      photoDetailsJSON
    );

    // Serialize all chatter box details into a JSON string
    const chatterBoxDetailsJSON = JSON.stringify({
      manufacturer,
      model,
      serialNumber,
      imageUri: chatterBoxImage,
    });

    // Execute the SQL transaction to update the chatter box details and photos for the given jobId
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE Jobs SET chatterBoxDetails = ?, photos = ? WHERE id = ?',
        [chatterBoxDetailsJSON, updatedPhotosJSON, jobId],
        (_, result) => {
          console.log('Chatter box details updated successfully');
          // Optionally, navigate away or update UI to reflect the changes
          navigation.navigate('standardPage'); // Adjust navigation as needed
        },
        (_, error) => {
          console.error(
            'Error updating chatter box details in database:',
            error
          );
        }
      );
    });
  };

  const nextPressed = async () => {
    if (!chatterBoxImage) {
      EcomHelper.showInfoMessage('Please choose image');
      return;
    }

    try {
      const response = await fetch(chatterBoxImage);
      const blob = await response.blob();
      appContext.setBlobs((prev) => [...prev, blob]);
    } catch (err) {
      console.log(err);
    }
    if (!manufacturer) {
      EcomHelper.showInfoMessage('Please choose manufacturer');
      return;
    }
    if (!serialNumber) {
      EcomHelper.showInfoMessage('Please choose serial number');
      return;
    }
    if (!model) {
      EcomHelper.showInfoMessage('Please choose model');
      return;
    }

    appContext.setRegulatorDetails({
      ...regulatorDetails,
      chatterManufacturer: manufacturer,
      chatterSerialNumber: serialNumber,
      chatterModel: model,
      chatterImage: chatterBoxImage,
    });

    goToNextStep();
  };
  const backPressed = () => {
    appContext.setRegulatorDetails({
      ...regulatorDetails,
      chatterManufacturer: manufacturer,
      chatterSerialNumber: serialNumber,
      chatterModel: model,
      chatterImage: chatterBoxImage,
    });
    goToPreviousStep();
  };

  const scanBarcode = () => {
    setIsModal(true);
  };

  const readSerialNumber = (codes) => {
    EcomHelper.showInfoMessage(codes.data);
    console.log(codes);
    setIsModal(false);
    setSerialNumber(codes.data);
  };

  return (
    <SafeAreaView style={styles.content}>
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={title}
        leftBtnPressed={backPressed}
        rightBtnPressed={nextPressed}
      />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        <ScrollView style={styles.content}>
          <View style={styles.body}>
            <View style={styles.row}>
              <View style={{ width: width * 0.4 }}>
                <View style={styles.spacer2} />
                <Text>Chatterbox Manufacturer</Text>
                <View style={styles.spacer2} />
                <TextInput
                  value={manufacturer}
                  onChangeText={(txt) => {
                    if (alphanumericRegex.test(txt)) setManufacturer(txt);
                  }}
                  style={styles.input}
                />
              </View>
              <View style={{ width: width * 0.4, alignItems: 'flex-start' }}>
                <Text>Chatterbox model</Text>
                <View style={styles.spacer2} />
                <TextInput
                  value={model}
                  onChangeText={(txt) => {
                    if (alphanumericRegex.test(txt)) setModel(txt);
                  }}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.spacer} />
            <View style={styles.row}>
              <View
                style={{
                  width: width * 0.45,
                  alignSelf: 'flex-end',
                }}
              >
                <Text>ChatterBox serial Number</Text>
                <View style={styles.spacer2} />
                <View style={{ ...styles.row, width: width * 0.35 }}>
                  <TextInput
                    onChangeText={(txt) => {
                      if (alphanumericRegex.test(txt)) setSerialNumber(txt);
                    }}
                    style={{
                      width: width * 0.25,
                      // as serial number can be long, we can adjust the font size
                      fontSize: makeFontSmallerAsTextGrows(serialNumber),
                      alignSelf: 'flex-end',
                    }}
                    value={serialNumber}
                  />
                  <Button title="📷" onPress={scanBarcode} />
                </View>
              </View>
            </View>
            <View style={styles.spacer} />
            <View style={styles.spacer} />
            <View style={styles.spacer} />

            <Text>{'Chatter Box Image'}</Text>
            <View style={styles.spacer} />
            {chatterBoxImage && (
              <Image
                source={{ uri: chatterBoxImage }}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            <View style={styles.row}>
              <ImagePickerButton
                onImageSelected={(uri) => setchatterBoxImage(uri)}
              />
            </View>
            <View style={styles.spacer} />
          </View>
          {isModal && (
            <BarcodeScanner
              setIsModal={setIsModal}
              cameraRef={camera}
              barcodeRecognized={readSerialNumber}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  body: {
    marginHorizontal: width * 0.05,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  input: {
    width: width * 0.35, // Example adjustment
  },
  optionContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  spacer: {
    height: height * 0.02, // Example adjustment based on height
  },
  spacer2: {
    height: height * 0.01, // Example adjustment based on height
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonIcon: {
    width: 20,
    height: 20,
  },
  image: {
    height: height * 0.25, // Adjusted to use height for responsiveness
  },
});

export default ChatterBoxPage;
