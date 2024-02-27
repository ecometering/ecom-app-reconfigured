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
import ImagePickerButton from "../../components/ImagePickerButton";
import EcomHelper from "../../utils/ecomHelper";
import { openDatabase } from "../../utils/database";

const { width, height } = Dimensions.get('window');

function GenericPhotoPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const appContext = useContext(AppContext);
  const { title, onPhotoSelected, photoKey, nextScreen, jobId } = route.params;
  const existingPhoto = appContext[photoKey];
  const [selectedImage, setSelectedImage] = useState(existingPhoto);

  // Correctly handle database operations
  const updateJobPhotos = async (jobId, photosJSON) => {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE Jobs SET photos = ? WHERE id = ?',
          [photosJSON, jobId],
          (_, result) => {
            console.log('Photos updated successfully');
            resolve(result);
          },
          (_, error) => {
            console.log('Error updating job photos in database:', error);
            reject(error);
          }
        );
      });
    });
  };

  const nextPressed = async () => {
    if (!selectedImage) {
      EcomHelper.showInfoMessage("Please choose an image");
      return;
    }

    // Assuming onPhotoSelected updates the context or performs some other action
    onPhotoSelected && onPhotoSelected(selectedImage, appContext);

    // Fetch existing photos JSON, update it, and save back to the database
    try {
      const db = await openDatabase();
      db.transaction(tx => {
        tx.executeSql(
          'SELECT photos FROM Jobs WHERE id = ?',
          [jobId],
          async (_, { rows }) => {
            const existingPhotosJSON = rows.length > 0 ? rows._array[0].photos : JSON.stringify([]);
            const photos = JSON.parse(existingPhotosJSON);
            photos.push({ title, photoKey, uri: selectedImage });
            const updatedPhotosJSON = JSON.stringify(photos);
            await updateJobPhotos(jobId, updatedPhotosJSON);
            navigation.navigate(nextScreen, { jobId });
          },
          (_, error) => {
            console.log('Error fetching photos from database:', error);
          }
        );
      });
    } catch (error) {
      console.error("Failed to update photos:", error);
    }
  };

  const updateSelectedImage = (uri) => {
    setSelectedImage(uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        hasLeftBtn={true}
        leftBtnPressed={() => navigation.goBack()}
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
    width: width * 0.8,
    height: height * 0.4,
    marginTop: 20,
    resizeMode: 'contain',
  },
});

export default GenericPhotoPage;
