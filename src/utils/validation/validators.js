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

export const validateRegex = (field, value, regex, message) => {
  if (!regex.test(value)) {
    return message || `Invalid ${field}`;
  }
  return null;
};

export const validateLength = (field, value, min, max, message) => {
  if (value.length < min || value.length > max) {
    return message || `${field} should be between ${min} and ${max} characters`;
  }
  return null;
};

export const validateEmail = (field, value, message) => {
  return validateRegex(
    field,
    value,
    emailRegex,
    message || `Invalid email: ${field}`
  );
};

export const validatePhoneNumber = (field, value, message) => {
  return validateRegex(
    field,
    value,
    phoneNumberRegex,
    message || `Invalid phone number: ${field}`
  );
};

export const validatePostCode = (field, value, message) => {
  return validateRegex(
    field,
    value,
    ukPostCodeRegex,
    message || `Invalid post code: ${field}`
  );
};

export const validateBooleanField = (field, value, message) => {
  if (value == null) {
    return message || `Please answer if ${field}`;
  }
  return null;
};
