import {
  validateEmail,
  validateMprn,
  validatePostCode,
  validatePhoneNumber,
  validateRequiredField,
  validateWarrantConfirmation,
  validateContactConfirmation,
} from '../../utils/validation/validators';

export const validateSiteDetails = (siteDetails, jobType) => {
  const validations = [
    () => validateMprn(siteDetails.mprn),
    () =>
      validateRequiredField(
        'Building Name',
        siteDetails.buildingName,
        'Please input Building Name'
      ),
    () =>
      validateRequiredField(
        'Address1',
        siteDetails.address1,
        'Please input Address1'
      ),
    () =>
      validateRequiredField(
        'Town/City',
        siteDetails.town,
        'Please input Town/City'
      ),
    () =>
      validateRequiredField(
        'County',
        siteDetails.county,
        'Please input County'
      ),
    () =>
      validateRequiredField(
        'Post Code',
        siteDetails.postCode,
        'Please input Post Code'
      ),
    () => validatePostCode(siteDetails.postCode),
    () => validatePhoneNumber('phone number1', siteDetails.number1),
    () => validatePhoneNumber('phone number2', siteDetails.number2),
    () => validateEmail('email1', siteDetails.email1),
    () => validateEmail('email2', siteDetails.email2),
    () => validateContactConfirmation(siteDetails.confirmContact),

    () => validateWarrantConfirmation(jobType, siteDetails.confirmWarrant),
  ];

  for (const validate of validations) {
    const error = validate();
    if (error) {
      return { isValid: false, message: error };
    }
  }

  return { isValid: true, message: '' };
};
