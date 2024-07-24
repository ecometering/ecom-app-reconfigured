import {
  validateRequiredField,
  validateBooleanField,
} from '../../utils/validation/validators';

export const validateCorrectorDetails = (correctorDetails, selectedImage) => {
  const validations = [
    () =>
      validateRequiredField(
        'Image',
        selectedImage?.uri,
        'Please choose an image'
      ),
    () =>
      validateRequiredField(
        'Serial Number',
        correctorDetails.serialNumber,
        'Please enter serial number'
      ),
    () =>
      validateBooleanField(
        'Mounting bracket used',
        correctorDetails.isMountingBracket,
        'Please answer if mounting bracket was used'
      ),
    () =>
      validateRequiredField(
        'Manufacturer',
        correctorDetails.manufacturer,
        'Please choose manufacturer'
      ),
    () =>
      validateRequiredField(
        'Model',
        correctorDetails.model,
        'Please choose model'
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
