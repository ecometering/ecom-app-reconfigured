import React, { createContext, useReducer, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';
import * as FileSystem from 'expo-file-system';
import { useSQLiteContext } from 'expo-sqlite/next'; // Importing the SQLite context from expo-sqlite/next

// Create the context
const ImageQueueContext = createContext();

const initialState = {
  queue: [],
  isConnectedToInternet: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_QUEUE':
      return { ...state, queue: [...state.queue, action.payload] };
    case 'REMOVE_FROM_QUEUE':
      return {
        ...state,
        queue: state.queue.filter((item) => item.id !== action.payload),
      };
    case 'SET_CONNECTION':
      return { ...state, isConnectedToInternet: action.payload };
    default:
      return state;
  }
};

const uploadImage = async (imageUri) => {
  try {
    const response = await FileSystem.uploadAsync(
      'https://test.ecomdata.co.uk/api/upload-photos/',
      imageUri,
      {
        fieldName: 'file',
        httpMethod: 'POST',
      }
    );
    return response.status === 200 ? response : null;
  } catch (error) {
    console.log('Image upload failed', error);
    return null;
  }
};

export const ImageQueueProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const db = useSQLiteContext();

  // new table for image queue
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS image_queue (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            imageUri TEXT,
            status TEXT, 
            recordId INTEGER
          );
        `);
        console.log('Image queue table created or already exists.');
      } catch (error) {
        console.error('Error setting up database:', error);
      }
    };
    setupDatabase();
  }, [db]);

  // monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch({
        type: 'SET_CONNECTION',
        payload: state.isConnectedToInternet,
      });
    });
    return () => unsubscribe();
  }, []);

  // processes queue when connection is available
  useEffect(() => {
    const processQueue = async () => {
      if (state.isConnectedToInternet && db) {
        try {
          const result = await db.getAllAsync(`
            SELECT * FROM image_queue WHERE status = 'pending';
          `);
          result.forEach(async (record) => {
            // TODO: see recordId will be needed to update the record in the database
            const { id, imageUri, recordId } = record;
            const uploadResponse = await uploadImage(imageUri);
            if (uploadResponse) {
              await db.execAsync('DELETE FROM image_queue WHERE id = ?', [id]);
            }
          });
        } catch (error) {
          console.error('Error processing queue:', error);
        }
      }
    };
    processQueue();
  }, [state.isConnectedToInternet, db]);

  /*
   * Add an image to the queue
   * @param {string} imageUri - URI of the image to be uploaded
   * @param {string} recordId - ID of the record in the database
   */
  const addToQueue = async (imageUri, recordId) => {
    const imageName = imageUri.split('/').pop();
    // This is the URL where the image will be uploaded and be accessible from
    const imageUrl = `https://your-server.com/uploads/${imageName}`;

    try {
      await db.execAsync(
        'UPDATE your_records_table SET imageUrl = ? WHERE id = ?',
        [imageUrl, recordId]
      );
      console.log('Record updated with image URL');
      dispatch({ type: 'ADD_TO_QUEUE', payload: { imageUri, recordId } });
      await db.execAsync(
        'INSERT INTO image_queue (imageUri, status, recordId) VALUES (?, ?, ?)',
        [imageUri, 'pending', recordId]
      );
    } catch (error) {
      console.error('Error adding to queue or updating record:', error);
    }
  };

  return (
    <ImageQueueContext.Provider value={{ state, addToQueue }}>
      {children}
    </ImageQueueContext.Provider>
  );
};

export default ImageQueueContext;
