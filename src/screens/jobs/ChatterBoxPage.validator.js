import { validateRequiredField } from '../../utils/validation/validators';

export const validateChatterBox = (chatterBoxDetails, existingPhoto) => {
  const validations = [
    () =>
      validateRequiredField(
        'Chatter box Serial Number',
        chatterBoxDetails.serialNumber,
        'Please enter serial number'
      ),
    () =>
      validateRequiredField(
        'Manufacturer',
        chatterBoxDetails.manufacturer,
        'Please choose manufacturer'
      ),
    () =>
      validateRequiredField(
        'Model',
        chatterBoxDetails.model,
        'Please choose model'
      ),
    () =>
      validateRequiredField(
        'Logger Owner',
        chatterBoxDetails.loggerOwner,
        'Please choose Logger owner'
      ),
    () =>
      validateRequiredField('Photo', existingPhoto?.uri, 'Please choose image'),
  ];

  for (const validate of validations) {
    const error = validate();
    if (error) {
      return { isValid: false, message: error };
    }
  }

  return { isValid: true, message: '' };
};
