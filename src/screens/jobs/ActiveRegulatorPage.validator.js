import {
  validateBooleanField,
  validateRequiredField,
} from '../../utils/validation/validators';

export const validateActiveRegulator = (streams, stream, existingPhoto) => {
  const validations = [
    () =>
      validateBooleanField(
        'Active Regulator Exists',
        streams[`activeRegulator${stream}Exists`],
        'Please select if the active Regulator exists'
      ),
    () =>
      streams[`activeRegulator${stream}Exists`] &&
      validateRequiredField(
        'Image',
        existingPhoto?.uri,
        'Please choose an image'
      ),
    () =>
      streams[`activeRegulator${stream}Exists`] &&
      validateRequiredField(
        'Active Regulator Serial Number',
        streams[`activeRegulatorSerialNumber${stream}`],
        'Please input the active Regulator Serial Number'
      ),
    () =>
      streams[`activeRegulator${stream}Exists`] &&
      validateRequiredField(
        'Active Regulator Size',
        streams[`activeRegulatorSize${stream}`],
        'Please select the active Regulator Size'
      ),
    () =>
      streams[`activeRegulator${stream}Exists`] &&
      validateRequiredField(
        'Active Regulator Manufacturer',
        streams[`activeRegulatorManufacturer${stream}`],
        'Please input the active Regulator Manufacturer'
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
