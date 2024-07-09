const ukPostCodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
const phoneNumberRegex =
  /^(?:(0\d{4})\s?\d{3}\s?\d{3}|(07\d{3})\s?\d{3}\s?\d{3}|(01\d{1,2})\s?\d{3}\s?\d{3,4}|(02\d{1,2})\s?\d{3}\s?\d{4})$/;
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const validateRequiredField = (field, value, message) => {
  if (!value || value.trim() === '') {
    return message || `${field} is required`;
  }
  return null;
};

export const validatePostCode = (value) => {
  if (!ukPostCodeRegex.test(value)) {
    return 'Not a valid UK post code';
  }
  return null;
};

export const validatePhoneNumber = (field, value) => {
  if (value && !phoneNumberRegex.test(value)) {
    return `Not a valid phone number: ${field}`;
  }
  return null;
};

export const validateEmail = (field, value) => {
  if (value && !emailRegex.test(value)) {
    return `Not a valid email: ${field}`;
  }
  return null;
};

export const validateMprn = (value) => {
  if (!value) {
    return 'Please input MPRN';
  }
  if (value.length < 5 || value.length > 15) {
    return 'MPRN should be 5 ~ 15 digits';
  }
  return null;
};

export const validateContactConfirmation = (value) => {
  if (!value) {
    return 'Please make sure if all contact is correct';
  }
  return null;
};

export const validateWarrantConfirmation = (jobType, value) => {
  if (jobType === 'Warrant' && value == null) {
    return 'Please confirm if the warrant went ahead';
  }
  return null;
};
