import {
  validateRequiredField,
  validateBooleanField,
  validateOptionalField,
} from '../../utils/validation/validators';

export const validateRegulator = (regulatorDetails) => {
  const validations = [
    () =>
      validateBooleanField(
        'Serial number exists',
        regulatorDetails.serialNoExist,
        'Please answer if serial number exists'
      ),
    () =>
      regulatorDetails.serialNoExist &&
      validateRequiredField(
        'Serial Number',
        regulatorDetails.serialNumber,
        'Please enter or scan regulator Serial number'
      ),
    () =>
      validateBooleanField(
        'Regulator Sealed',
        regulatorDetails.isSealedRegulator,
        'Please answer if regulator was sealed'
      ),
    () =>
      validateBooleanField(
        'New meter, customer appliances and pipe work purged',
        regulatorDetails.isPurged,
        'Please answer if new meter, customer appliances and pipe work been purged and relit satisfactorily including a visual inspection'
      ),
    () =>
      validateBooleanField(
        'Installation correctly labelled',
        regulatorDetails.isLabelled,
        'Please answer if installation was correctly labelled'
      ),
    () =>
      validateBooleanField(
        'Purpose made ventilation',
        regulatorDetails.isVentilation,
        'Please answer if there is a purpose made ventilation'
      ),
    () =>
      validateOptionalField(
        'Connection Type',
        regulatorDetails.ConnectionType,
        'Please answer if regulator is threaded or flanged'
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
