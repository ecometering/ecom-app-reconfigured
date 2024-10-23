import React, { createContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useSQLiteContext } from 'expo-sqlite/next';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const ImageQueueContext = createContext();

const uploadImage = async (photo) => {
  if (!photo.uri) {
    return null;
  }

  // check if the uri file exists
  const fileExists = await FileSystem.getInfoAsync(photo.uri);
  if (!fileExists.exists) {
    return null;
  }

  const formData = new FormData();
  formData.append('photo_type', photo.photoKey);
  formData.append('job_id', photo.recordId);
  formData.append('description', photo.description);
  formData.append('photo', {
    uri: photo.uri.replace('file://', ''),
    type: 'image/jpeg',
    name: `${photo.photoKey}.jpg`,
  });

  // log the formData as json string
  try {
    const response = await axios.post(
      'https://test.ecomdata.co.uk/api/upload-photos/',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    // log the response as json
    return response.status === 201 ? response : null;
  } catch (error) {
    return null;
  }
};

export const ImageQueueProvider = ({ children }) => {
  const [internetOnline, setInternetOnline] = useState(false);
  const db = useSQLiteContext();
  const [queueLength, setQueueLength] = useState(0);
  const [processingQueue, setProcessingQueue] = useState(false);

  const getQueueLength = async () => {
    try {
      const result = await db.getAllAsync(
        'SELECT COUNT(*) AS count FROM image_queue'
      );
      setQueueLength(result?.[0]?.count || 0);
    } catch (error) {
      console.error('Error getting queue length:', error);
    }
  };

  useEffect(() => {
    const setupDatabase = async () => {
      try {
        // drop table for testing
        // await db.execAsync('DROP TABLE IF EXISTS image_queue;');
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS image_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            uri TEXT,
            photoKey TEXT,
            status TEXT, 
            recordId INTEGER,
            description TEXT
          );
        `);
      } catch (error) {
        console.error('Error setting up database:', error);
      }
    };
    setupDatabase();
  }, [db]);

  useEffect(() => {
    getQueueLength();
    const unsubscribe = NetInfo.addEventListener((state) => {
      setInternetOnline(state.isInternetReachable);
    });
    return () => unsubscribe();
  }, []);
  const processQueue = async () => {
    setProcessingQueue(true);
    if (internetOnline) {
      try {
        const result = await db.getAllAsync('SELECT * FROM image_queue;');
        for (const record of result) {
          const { id, photoKey, recordId, description, uri } = record;
          const uploadResponse = await uploadImage({
            uri,
            photoKey,
            recordId,
            description,
          });
          if (uploadResponse) {
            await db.execAsync('DELETE FROM image_queue WHERE id = ?', [id]);
            getQueueLength();
          }
        }
        setProcessingQueue(false);
      } catch (error) {
        console.error('Error processing queue:', error);
        setProcessingQueue(false);
      }
    }
  };

  useEffect(() => {
    processQueue();
  }, [internetOnline]);

  const addToQueue = async ({ uri, photoKey, recordId, description }) => {
    try {
      await db.runAsync(
        'INSERT INTO image_queue (uri, photoKey, status, recordId, description) VALUES (?, ?, ?, ?, ?)',
        [uri, photoKey, 'pending', recordId, description]
      );
      getQueueLength();
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  };

  const uploadImageOrAddToQueueIfOfflineOrFails = async ({
    uri,
    photoKey,
    recordId,
    description,
  }) => {
    setProcessingQueue(true);
    if (internetOnline) {
      const uploadResponse = await uploadImage({
        uri,
        photoKey,
        recordId,
        description,
      });
      setProcessingQueue(false);
      if (uploadResponse?.status === 201) {
        return uploadResponse;
      }
    }
    setProcessingQueue(false);
    await addToQueue({ uri, photoKey, recordId, description });
  };

  return (
    <ImageQueueContext.Provider
      value={{
        processingQueue,
        queueLength,
        processQueue,
        addToQueue,
        uploadImageOrAddToQueueIfOfflineOrFails,
      }}
    >
      {children}
    </ImageQueueContext.Provider>
  );
};

export default ImageQueueContext;
