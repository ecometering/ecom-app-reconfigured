import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { useScreenDimensions } from "../utils/constant";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera"
import { BarCodeScanner as ExpoBarCodeScanner } from "expo-barcode-scanner";

const BarcodeScanner = ({
  setIsModal,
  cameraRef,
  barcodeRecognized,
}) => {
  const { width, height } = useScreenDimensions();

 
  return (
    <Modal transparent={true}>
      <View style={styles.container}>
      <View style={[styles.closeButtonContainer, {
          // Dynamically adjust the position based on screen size
          top: height * 0.1, // Example: Adjust top margin
          right: width * 0.1, // Example: Adjust right margin
        }]}>          <TouchableOpacity onPress={() => setIsModal(false)}>
            <MaterialCommunityIcons
              name="close-thick"
              size={30}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Camera
          ref={cameraRef}
          onBarCodeScanned={barcodeRecognized}
          style={[styles.camera, {
            // Dynamically adjust the camera size
            width: width * 0.8, // Example: 80% of screen width
            height: height * 0.5, // Example: 50% of screen height
          }]}          barCodeScannerSettings={{
            barCodeTypes: [
              ExpoBarCodeScanner.Constants.BarCodeType.codabar,
              ExpoBarCodeScanner.Constants.BarCodeType.code93,
              ExpoBarCodeScanner.Constants.BarCodeType.
              ExpoBarCodeScanner.Constants.BarCodeType.code39,
              ExpoBarCodeScanner.Constants.BarCodeType.code128,
              ExpoBarCodeScanner.Constants.BarCodeType.ean_13,
              ExpoBarCodeScanner.Constants.BarCodeType.ean_8,
              ExpoBarCodeScanner.Constants.BarCodeType.itf14,
              ExpoBarCodeScanner.Constants.BarCodeType.upc_e,
            ]
          }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "rgba(64, 64, 64, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  closeButtonContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonIcon: {
    width: 30,
    height: 30,
    alignSelf: "center",
  },
  camera: {
    alignSelf: "center",
  },
});

export default BarcodeScanner;
