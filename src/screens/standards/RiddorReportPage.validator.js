import { validateRequiredField } from '../../utils/validation/validators';

export const validateRiddorReport = (standards) => {
  const validations = [
    () =>
      validateRequiredField(
        'Image',
        standards?.riddorImage,
        'Please choose an image.'
      ),
    () =>
      validateRequiredField(
        'Notes',
        standards?.notes,
        'Notes are compulsory!'
      ),
    () =>
      validateRequiredField(
        'RIDDOR Reference',
        standards?.riddorRef,
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
