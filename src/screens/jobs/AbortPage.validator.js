import { validateRequiredField } from '../../utils/validation/validators';

export const validateAbortPage = (siteQuestions,selectedImage) => {
  const validations = [
    () =>
      validateRequiredField(
        'Image',
        selectedImage?.uri,
        'Please choose an image'
      ),
    () =>
      validateRequiredField(
        'abort Notes',
        siteQuestions?.abortNotes,
        'Notes are compulsory!'
      ),
    () =>
      validateRequiredField(
        'Abort Reason',
        siteQuestions?.abortReason,
        'Abort Reason is required!'
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
