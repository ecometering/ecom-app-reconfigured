import {
  validateBooleanField,
  validateRequiredField,
} from '../../utils/validation/validators';

export const validateWaferCheck = (streams, stream, existingPhoto) => {
  const validations = [
    () =>
      validateBooleanField(
        'Wafer Check Exists',
        streams[`waferCheck${stream}Exists`],
        'Please select if the wafer Check exists'
      ),
    () =>
      streams[`waferCheck${stream}Exists`] &&
      validateRequiredField(
        'Image',
        existingPhoto?.uri,
        'Please choose an image'
      ),
    () =>
      streams[`waferCheck${stream}Exists`] &&
      validateRequiredField(
        'Wafer Check Serial Number',
        streams[`waferCheckSerialNumber${stream}`],
        'Please input the wafer Check Serial Number'
      ),
    () =>
      streams[`waferCheck${stream}Exists`] &&
      validateRequiredField(
        'Wafer Check Size',
        streams[`waferCheckSize${stream}`],
        'Please select the wafer Check Size'
      ),
    () =>
      streams[`waferCheck${stream}Exists`] &&
      validateRequiredField(
        'Wafer Check Manufacturer',
        streams[`waferCheckManufacturer${stream}`],
        'Please input the wafer Check Manufacturer'
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
