import React, { useContext } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import ImageQueueContext from '../../context/image-queue/ImageQueueContext';
import { PrimaryColors } from '../../theme/colors';

const ImageQueueInfo = () => {
  const { queueLength, processingQueue, processQueue } =
    useContext(ImageQueueContext);

  if (queueLength === 0) {
    return null;
  }

  return (
    <View
      style={{
        alignItems: 'flex-start',
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 12 }}>
        There are{' '}
        <Text
          style={{
            fontWeight: 'bold',
          }}
        >
          {queueLength}
        </Text>{' '}
        images in failed to be uploaded
      </Text>
      {processingQueue ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <TouchableOpacity
          onPress={processQueue}
          style={{
            backgroundColor: PrimaryColors.Blue,

            padding: 5,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: PrimaryColors.White }}>Continue uploading</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageQueueInfo;
