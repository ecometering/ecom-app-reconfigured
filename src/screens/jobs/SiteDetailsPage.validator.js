import {
  validateEmail,
  validateLength,
  validatePostCode,
  validateSelected,
  validatePhoneNumber,
  validateBooleanField,
  validateRequiredField,
} from '../../utils/validation/validators';

export const validateSiteDetails = (siteDetails, jobType) => {
  const validations = [
    () => validateRequiredField('MPRN', siteDetails.mprn, 'Please input MPRN'),
    () =>
      validateLength(
        'MPRN',
        siteDetails.mprn,
        5,
        15,
        'MPRN should be between 5 and 15 digits'
      ),
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
    () =>
      validatePostCode(
        'Post Code',
        siteDetails.postCode,
        'Invalid UK post code'
      ),
    () =>
      siteDetails?.number1 &&
      validatePhoneNumber(
        'phone number1',
        siteDetails.number1,
        'Invalid phone number: phone number1'
      ),
    () =>
      siteDetails.number2 &&
      validatePhoneNumber(
        'phone number2',
        siteDetails.number2,
        'Invalid phone number: phone number2'
      ),
    () =>
      siteDetails.email1 &&
      validateEmail('email1', siteDetails.email1, 'Invalid email: email1'),
    () =>
      siteDetails.email2 &&
      validateEmail('email2', siteDetails.email2, 'Invalid email: email2'),

    () => {
      validateBooleanField(
        'the warrant went ahead',
        siteDetails?.confirmWarrant,
        jobType === 'Warrant'
          ? 'Please confirm if the warrant went ahead'
          : null
      );
    },
  ];

  for (const validate of validations) {
    const error = validate();
    if (error) {
      return { isValid: false, message: error };
    }
  }

  return { isValid: true, message: '' };
};
