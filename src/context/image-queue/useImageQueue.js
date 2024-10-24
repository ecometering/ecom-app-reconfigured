import { useContext } from 'react';
import ImageQueueContext from './ImageQueueContext';

const useImageQueue = () => {
  const context = useContext(ImageQueueContext);

  if (!context) {
    throw new Error('useImageQueue must be used within an ImageQueueProvider');
  }

  return context;
};

export default useImageQueue;
