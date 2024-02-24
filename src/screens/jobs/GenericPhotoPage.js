import React, { useContext, useState, useEffect } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";
import Header from "../../components/Header";
import Text from "../../components/Text";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppContext } from "../../context/AppContext";
import ImagePickerButton from "../../components/ImagePickerButton"; // Assuming it's correctly imported
import EcomHelper from "../../utils/ecomHelper";

const { width, height } = Dimensions.get('window');

function GenericPhotoPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const appContext = useContext(AppContext);

  const { title, onPhotoSelected, photoKey, nextScreen } = route.params;
  const existingPhoto = appContext[photoKey];
  const [selectedImage, setSelectedImage] = useState(existingPhoto);

  useEffect(() => {
    // Assuming permissions are handled within ImagePickerButton or elsewhere as needed
  }, []);

  const backPressed = () => {
    navigation.goBack();
  };

  const nextPressed = () => {
    if (!selectedImage) {
      EcomHelper.showInfoMessage("Please choose an image");
      return;
    }

    onPhotoSelected && onPhotoSelected(selectedImage, appContext);
    navigation.navigate(nextScreen, { jobType: appContext.jobType, jobId: appContext.jobId });
  };

  const updateSelectedImage = (uri) => {
    setSelectedImage(uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={backPressed}
        centerText={title}
        hasRightBtn={true}
        rightBtnPressed={nextPressed}
      />
      <ScrollView style={styles.flex}>
        <View style={styles.body}>
          <Text type="caption" style={styles.text}>{title}</Text>
          <ImagePickerButton
            onImageSelected={updateSelectedImage}
            currentImage={selectedImage}
          />
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.image} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  body: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
  },
  image: {
    width: width * 0.8, // Adjust width as needed
    height: height * 0.4, // Adjust height as needed
    marginTop: 20,
    resizeMode: 'contain', // Ensure the entire image fits within the container
  },
});

export default GenericPhotoPage;
