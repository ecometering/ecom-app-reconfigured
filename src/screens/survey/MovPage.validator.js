import { validateRequiredField } from '../../utils/validation/validators';

export const validateMovDetails = (movDetails) => {
  const validations = [
    () =>
      validateRequiredField(
        'Mov Type',
        movDetails.type,
        'Mov Type is required. Please enter the Mov Type.'
      ),
    () =>
      validateRequiredField(
        'Mov Height',
        movDetails.height,
        'Mov Height is required. Please enter the Mov Height.'
      ),
    () =>
      validateRequiredField(
        'Mov Size',
        movDetails.size,
        'Mov Size is required. Please enter the Mov Size.'
      ),
    () =>
      validateRequiredField(
        'Distance from Kiosk Wall',
        movDetails.dfkw,
        'Distance from Kiosk Wall is required. Please enter the Distance from Kiosk Wall.'
      ),
    () =>
      validateRequiredField(
        'Distance from Rear Kiosk Wall',
        movDetails.dfrkw,
        'Distance from Rear Kiosk Wall is required. Please enter the Distance from Rear Kiosk Wall.'
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
