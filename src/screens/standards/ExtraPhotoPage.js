import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

// Components
import Header from '../../components/Header';
import ImagePickerButton from '../../components/ImagePickerButton';

// Context & Utils
import { useFormStateContext } from '../../context/AppContext';
import { useProgressNavigation } from '../../context/ProgressiveFlowRouteProvider';

const ExtraPhotoPage = () => {
  const { state, setState } = useFormStateContext();

  const { goToNextStep, goToPreviousStep } = useProgressNavigation();
  const existingPhotos =
    state?.standards?.extraPhotos &&
    state.standards.extraPhotos.map((photo) => ({
      uri: photo.extraPhoto,
      extraComment: photo.extraComment,
    }));
  const [photos, setPhotos] = useState(existingPhotos || []);
  const [activeSections, setActiveSections] = useState([]);

  const handleImageSelected = (newPhoto) => {
    const updatedPhotos = [...photos, { uri: newPhoto }];
    setPhotos(updatedPhotos);
    setActiveSections([updatedPhotos.length - 1]);
  };

  const handleRemovePhoto = (index) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    setPhotos(updatedPhotos);
    setActiveSections([]);
  };

  const toggleSection = (index) => {
    setActiveSections((prevActiveSections) =>
      prevActiveSections.includes(index) ? [] : [index]
    );
  };

  const handleDbUpdate = async () => {
    const extraPhotos = photos.map((photo, index) => {
      return {
        photoNumber: index + 1,
        extraPhoto: photo.uri,
        extraComment: photo.extraComment,
      };
    });

    setState({
      ...state,
      standards: {
        ...state.standards,
        extraPhotos,
      },
    });
  };

  const handleSubmit = async () => {
    handleDbUpdate();
    goToNextStep();
  };

  const handleGoBack = async () => {
    handleDbUpdate();
    goToPreviousStep();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <Header
        hasLeftBtn={true}
        hasCenterText={true}
        hasRightBtn={true}
        centerText={'Extra Photos'}
        leftBtnPressed={handleGoBack}
        rightBtnPressed={handleSubmit}
      />

      <ScrollView>
        <View style={styles.container}>
          {photos.map((photo, index) => (
            <View key={index}>
              <TouchableOpacity onPress={() => toggleSection(index)}>
                <View style={styles.header}>
                  <Text style={styles.headerText}>
                    {activeSections.includes(index) ? '▲' : '▼'} Photo{' '}
                    {index + 1}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemovePhoto(index)}>
                    <Text style={styles.removeText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              {activeSections.includes(index) && (
                <View style={styles.content}>
                  <Image source={{ uri: photo.uri }} style={styles.image} />
                  <TextInput
                    style={styles.textInput}
                    onChange={(event) => {
                      const text = event.nativeEvent
                        ? event.nativeEvent.text
                        : event.target.value;
                      setPhotos((prevPhotos) => {
                        const updatedPhotos = [...prevPhotos];
                        updatedPhotos[index].extraComment = text;
                        return updatedPhotos;
                      });
                    }}
                    value={photos[index].extraComment}
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Comment"
                  />
                </View>
              )}
            </View>
          ))}
          <Text style={styles.textLabel}>Any more extra photos?</Text>
          <Text style={styles.textLabel}>
            (Add them below if none click next)
          </Text>
          <ImagePickerButton onImageSelected={handleImageSelected} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerText: {
    flex: 1,
    fontSize: 16,
  },
  removeText: {
    color: 'red',
  },
  content: {
    padding: 10,
    backgroundColor: '#f1f1f1',
  },
  image: {
    width: '100%',
    height: 200,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    minHeight: 100,
    borderRadius: 5,
  },
  textLabel: {
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ExtraPhotoPage;
