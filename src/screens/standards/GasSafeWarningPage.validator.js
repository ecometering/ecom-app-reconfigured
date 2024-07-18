import {
  validateRequiredField,
  validateBooleanField,
} from '../../utils/validation/validators';

export const validateGasSafeWarning = (standardDetails) => {
  const validations = [
    () =>
      validateRequiredField(
        'Certificate Reference',
        standardDetails?.certificateReference,
        'Please enter Certificate Reference'
      ),
    () =>
      validateRequiredField(
        'Emergency Service Provider',
        standardDetails?.emergencyService,
        'Please enter Details of gas Emergency Service Provider'
      ),
    () =>
      validateBooleanField(
        'Property Rented',
        standardDetails?.isPropertyRented,
        'Please answer if the property is rented'
      ),
    () =>
      validateBooleanField(
        'Customer Available on Site',
        standardDetails?.isCustomerAvailable,
        'Please answer if Customer was available on site'
      ),
    () =>
      standardDetails?.isCustomerAvailable && !standardDetails?.customerSign
        ? 'Please check Customer Signature'
        : null,
    () =>
      validateRequiredField(
        'Engineer Signature',
        standardDetails?.engineerSign,
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
