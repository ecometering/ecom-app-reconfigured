import {
  validateBooleanField,
  validateRequiredField,
} from '../../utils/validation/validators';

export const validateReliefRegulator = (streams, stream, existingPhoto) => {
  const validations = [
    () =>
      validateBooleanField(
        'Relief Regulator Exists',
        streams[`reliefRegulator${stream}Exists`],
        'Please select if the relief Regulator exists'
      ),
    () =>
      streams[`reliefRegulator${stream}Exists`] &&
      validateRequiredField(
        'Image',
        existingPhoto?.uri,
        'Please choose an image'
      ),
    () =>
      streams[`reliefRegulator${stream}Exists`] &&
      validateRequiredField(
        'Relief Regulator Serial Number',
        streams[`reliefRegulatorSerialNumber${stream}`],
        'Please input the relief Regulator Serial Number'
      ),
    () =>
      streams[`reliefRegulator${stream}Exists`] &&
      validateRequiredField(
        'Relief Regulator Size',
        streams[`reliefRegulatorSize${stream}`],
        'Please select the relief Regulator Size'
      ),
    () =>
      streams[`reliefRegulator${stream}Exists`] &&
      validateRequiredField(
        'Relief Regulator Manufacturer',
        streams[`reliefRegulatorManufacturer${stream}`],
        'Please input the relief Regulator Manufacturer'
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
