import {
  validateBooleanField,
  validateRequiredField,
} from '../../utils/validation/validators';

export const validateSlamShut = (streams, stream, existingPhoto) => {
  const validations = [
    () =>
      validateBooleanField(
        'Slam Shut Exists',
        streams[`slamShut${stream}Exists`],
        'Please select if the Slam Shut exists'
      ),
    () =>
      streams[`slamShut${stream}Exists`] &&
      validateRequiredField(
        'Image',
        existingPhoto?.uri,
        'Please choose an image'
      ),
    () =>
      streams[`slamShut${stream}Exists`] &&
      validateRequiredField(
        'Slam Shut Serial Number',
        streams[`slamShutSerialNumber${stream}`],
        'Please input the Slam Shut Serial Number'
      ),
    () =>
      streams[`slamShut${stream}Exists`] &&
      validateRequiredField(
        'Slam Shut Size',
        streams[`slamShutSize${stream}`],
        'Please select the Slam Shut Size'
      ),
    () =>
      streams[`slamShut${stream}Exists`] &&
      validateRequiredField(
        'Slam Shut Manufacturer',
        streams[`slamShutManufacturer${stream}`],
        'Please input the Slam Shut Manufacturer'
      ),
  ];

  for (const validate of validations) {
    const error = validate();
    if (error) {
      return { isValid: false, message: error };
    }
  }

  return { isValid: true, message: '' };
};
