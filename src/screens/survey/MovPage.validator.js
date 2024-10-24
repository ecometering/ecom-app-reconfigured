import { validateRequiredField, validateBooleanField } from '../../utils/validation/validators';

export const validateMovDetails = (movDetails) => {
  // Check if movExists is null, undefined, or not a boolean
  if (movDetails.movExists === null || movDetails.movExists === undefined || typeof movDetails.movExists !== 'boolean') {
    return { isValid: false, message: 'Please indicate whether an MOV exists.' };
  }

  const movExistsError = validateBooleanField(
    'MOV Exists',
    movDetails.movExists,
    'Please indicate whether an MOV exists.'
  );
  if (movExistsError) {
    return { isValid: false, message: movExistsError };
  }

  // Only proceed with other validations if movExists is true
  if (movDetails.movExists === true) {
    const validations = [
      () =>
        validateRequiredField(
          'MOV Type',
          movDetails.type,
          'MOV Type is required. Please enter the MOV Type.'
        ),
      () =>
        validateRequiredField(
          'MOV Height',
          movDetails.height,
          'MOV Height is required. Please enter the MOV Height.'
        ),
      () =>
        validateRequiredField(
          'MOV Size',
          movDetails.size,
          'MOV Size is required. Please select the MOV Size.'
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
  }

  return { isValid: true, message: '' };
};