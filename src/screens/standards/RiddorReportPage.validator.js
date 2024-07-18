import { validateRequiredField } from '../../utils/validation/validators';

export const validateRiddorReport = (standardDetails) => {
  const validations = [
    () =>
      validateRequiredField(
        'Image',
        standardDetails?.riddorImage,
        'Please choose an image.'
      ),
    () =>
      validateRequiredField(
        'Notes',
        standardDetails?.notes,
        'Notes are compulsory!'
      ),
    () =>
      validateRequiredField(
        'RIDDOR Reference',
        standardDetails?.riddorRef,
        'RIDDOR reference is required!'
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
