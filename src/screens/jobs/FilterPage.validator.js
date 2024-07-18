import {
  validateBooleanField,
  validateRequiredField,
} from '../../utils/validation/validators';

export const validateFilter = (streams, stream, existingPhoto) => {
  const validations = [
    () =>
      validateBooleanField(
        'Filter Exists',
        streams[`filter${stream}Exists`],
        'Please select if the filter exists'
      ),
    () =>
      streams[`filter${stream}Exists`] &&
      validateRequiredField(
        'Image',
        existingPhoto?.uri,
        'Please choose an image'
      ),
    () =>
      streams[`filter${stream}Exists`] &&
      validateRequiredField(
        'Filter Serial Number',
        streams[`filterSerialNumber${stream}`],
        'Please input the Filter Serial Number'
      ),
    () =>
      streams[`filter${stream}Exists`] &&
      validateRequiredField(
        'Filter Size',
        streams[`filterSize${stream}`],
        'Please select the Filter Size'
      ),
    () =>
      streams[`filter${stream}Exists`] &&
      validateRequiredField(
        'Filter Manufacturer',
        streams[`filterManufacturer${stream}`],
        'Please input the Filter Manufacturer'
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
