import React from "react";
import { Modal, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Camera } from "expo-camera"
import { BarCodeScanner  } from "expo-barcode-scanner";
const { width, height } = Dimensions.get('window');
const BarcodeScanner = ({
  setIsModal,
  cameraRef,
  barcodeRecognized,
}) => {

 
  return (
    <Modal transparent={true}>
      <View style={styles.container}>
      <View style={[styles.closeButtonContainer, {
          // Dynamically adjust the position based on screen size
          top: height * 0.1, // Example: Adjust top margin
          right: width * 0.1, // Example: Adjust right margin
        }]}>          
        <TouchableOpacity onPress={() => setIsModal(false)}>
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
          }]}          
          autoFocus={Camera.Constants.AutoFocus.off}
          focusDepth={0.3}
          barCodeScannerSettings={{
            barCodeTypes: [
              BarCodeScanner.Constants.BarCodeType.codabar,
              BarCodeScanner.Constants.BarCodeType.code39,
              BarCodeScanner.Constants.BarCodeType.code93,
              BarCodeScanner.Constants.BarCodeType.code128,
              BarCodeScanner.Constants.BarCodeType.ean_13,
              BarCodeScanner.Constants.BarCodeType.ean_8,
              BarCodeScanner.Constants.BarCodeType.itf14,
              BarCodeScanner.Constants.BarCodeType.upc_e,
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
