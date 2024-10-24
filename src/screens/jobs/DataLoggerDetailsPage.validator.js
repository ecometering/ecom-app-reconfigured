import {
  validateRequiredField,
  validateBooleanField,
} from '../../utils/validation/validators';

export const validateDataLoggerDetails = (dataloggerDetails, existingPhoto) => {
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
        dataloggerDetails.serialNumber,
        'Please enter serial number'
      ),
    () =>
      validateBooleanField(
        'Mounting Bracket Used',
        dataloggerDetails.isMountingBracket,
        'Please answer if mounting bracket was used'
      ),
    () =>
      validateBooleanField(
        'Adapter Used',
        dataloggerDetails.isAdapter,
        'Please answer if adapter was used'
      ),
    () =>
      validateBooleanField(
        'Pulse Splitter Used',
        dataloggerDetails.isPulseSplitter,
        'Please answer if pulse splitter was used'
      ),
    () =>
      validateRequiredField(
        'Manufacturer',
        dataloggerDetails.manufacturer,
        'Please choose manufacturer'
      ),
    () =>
      validateRequiredField(
        'Model',
        dataloggerDetails.model,
        'Please choose model'
      ),
    () =>
      validateRequiredField(
        'Logger Owner',
        dataloggerDetails.loggerOwner,
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
