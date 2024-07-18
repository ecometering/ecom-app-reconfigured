import {
  validateRequiredField,
  validateBooleanField,
} from '../../utils/validation/validators';

export const validateDataLoggerDetails = (dataLoggerDetails, existingPhoto) => {
  const validations = [
    () =>
      validateRequiredField(
        'Image',
        existingPhoto?.uri,
        'Please choose an image'
      ),
    () =>
      validateRequiredField(
        'Serial Number',
        dataLoggerDetails.serialNumber,
        'Please enter serial number'
      ),
    () =>
      validateBooleanField(
        'Mounting Bracket Used',
        dataLoggerDetails.isMountingBracket,
        'Please answer if mounting bracket was used'
      ),
    () =>
      validateBooleanField(
        'Adapter Used',
        dataLoggerDetails.isAdapter,
        'Please answer if adapter was used'
      ),
    () =>
      validateBooleanField(
        'Pulse Splitter Used',
        dataLoggerDetails.isPulseSplitter,
        'Please answer if pulse splitter was used'
      ),
    () =>
      validateRequiredField(
        'Manufacturer',
        dataLoggerDetails.manufacturer,
        'Please choose manufacturer'
      ),
    () =>
      validateRequiredField(
        'Model',
        dataLoggerDetails.model,
        'Please choose model'
      ),
    () =>
      validateRequiredField(
        'Logger Owner',
        dataLoggerDetails.loggerOwner,
        'Please choose Logger owner'
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
