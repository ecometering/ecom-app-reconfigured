import {
  validateRequiredField,
  validateBooleanField,
} from '../../utils/validation/validators';

export const validateGasSafeWarning = (standards) => {
  const validations = [
    () =>
      validateRequiredField(
        'Certificate Reference',
        standards?.certificateReference,
        'Please enter Certificate Reference'
      ),
    () =>
      validateRequiredField(
        'Emergency Service Provider',
        standards?.emergencyService,
        'Please enter Details of gas Emergency Service Provider'
      ),
    () =>
      validateBooleanField(
        'Property Rented',
        standards?.isPropertyRented,
        'Please answer if the property is rented'
      ),
    () =>
      validateBooleanField(
        'Customer Available on Site',
        standards?.isCustomerAvailable,
        'Please answer if Customer was available on site'
      ),
    () =>
      standards?.isCustomerAvailable && !standards?.customerSign
        ? 'Please check Customer Signature'
        : null,
    () =>
      validateRequiredField(
        'Engineer Signature',
        standards?.engineerSign,
        'Please check Engineer Signature'
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
