import { validateRequiredField } from '../../utils/validation/validators';

export const validateEcvDetails = (ecvDetails) => {
  const validations = [
    () =>
      validateRequiredField(
        'ECV Type',
        ecvDetails.type,
        'ECV Type is required. Please enter the ECV Type.'
      ),
    () =>
      validateRequiredField(
        'ECV Height',
        ecvDetails.height,
        'ECV Height is required. Please enter the ECV Height.'
      ),
    () =>
      validateRequiredField(
        'ECV Size',
        ecvDetails.size,
        'ECV Size is required. Please enter the ECV Size.'
      ),
    () =>
      validateRequiredField(
        'Distance from Kiosk Wall',
        ecvDetails.dfkw,
        'Distance from Kiosk Wall is required. Please enter the Distance from Kiosk Wall.'
      ),
    () =>
      validateRequiredField(
        'Distance from Rear Kiosk Wall',
        ecvDetails.dfrkw,
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
