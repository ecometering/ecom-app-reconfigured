import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import { Modal, Portal, Provider, TextInput, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePickerButton from "../components/ImagePickerButton";

import axios from 'axios';

// Define the base URL for your API
const API = axios.create({
  baseURL: 'http://your-api-url.com/api', // Adjust this to your actual API URL
});


type Qualification = {
    id: string;
    certificateType: string | undefined;
    expiryDate: string | undefined;
    image: string | undefined
  };
  
  type ProfileData = {
    username: string;
    email: string;
    telephone: string;
    qualifications: Qualification[];
  };
  const EngineerProfileScreen: React.FC = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          const response = await API.get<ProfileData>('/profile');
          setProfile(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchProfile();
    }, []);
  
    if (isLoading) {
      return <ActivityIndicator size="large" />;
    }
  
    return (
      <Provider>
        <ScrollView style={styles.container}>
          {profile && (
            <>
              <Text>Username: {profile.username}</Text>
              <Text>Email: {profile.email}</Text>
              <Text>Telephone: {profile.telephone}</Text>
              <Button title="Edit Qualifications" onPress={() => setModalVisible(true)} />
            </>
          )}
        </ScrollView>
        {isModalVisible && (
          <QualificationsModal
            isVisible={isModalVisible}
            onClose={() => setModalVisible(false)}
            qualifications={profile ? profile.qualifications : []}
            onSave={(updatedQualifications) => {
              if (profile) {
                setProfile({ ...profile, qualifications: updatedQualifications });
              }
              setModalVisible(false);
            }}
          />
        )}
      </Provider>
    );
  };
  interface QualificationsModalProps {
    isVisible: boolean;
    onClose: () => void;
    qualifications: Qualification[];
    onSave: (qualifications: Qualification[]) => void;
  }
  
  const QualificationsModal: React.FC<QualificationsModalProps> = ({ isVisible, onClose, qualifications, onSave }) => {
    const [localQualifications, setLocalQualifications] = useState<Qualification[]>(qualifications);
  
    // Implement add, remove, update, and submit logic here based on the earlier discussion
  
    return (
      <Portal>
        <Modal visible={isVisible} onDismiss={onClose} contentContainerStyle={styles.modalContainer}>
          {/* Qualifications form elements go here */}
          <Button title="Close" onPress={onClose} />
          {/* Add more buttons for adding rows and submitting qualifications */}
        </Modal>
      </Portal>
    );
  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    modalContainer: {
      backgroundColor: 'white',
      padding: 20,
      margin: 20,
    },
    // Add more styles as needed
  });
  export default EngineerProfileScreen;
