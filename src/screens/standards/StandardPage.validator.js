import {
  validateRequiredField,
  validateBooleanField,
} from '../../utils/validation/validators';

export const validateStandardDetails = (
  standardDetails,
  meterDetails,
  jobType
) => {
  const validations = [
    () =>
      validateBooleanField(
        'Network service/ECV conform to standards',
        standardDetails?.conformStandard,
        'Please answer if the network service/ECV conform to standards'
      ),
    () =>
      validateRequiredField(
        'Inlet Pressure',
        standardDetails?.pressure,
        'Please set inlet pressure'
      ),
    () =>
      validateRequiredField(
        'Signature',
        standardDetails?.signature,
        'Please enter signature'
      ),
    () =>
      validateBooleanField(
        'RIDDOR reportable',
        standardDetails?.riddorReportable,
        'Please answer if RIDDOR reportable'
      ),
    ...(meterDetails?.isMeter &&
    (jobType === 'Install' || jobType === 'Exchange')
      ? [
          () =>
            validateBooleanField(
              'Tightness test passed',
              standardDetails?.testPassed,
              'Please answer if tightness test passed'
            ),
          () =>
            validateBooleanField(
              'Outlet kit is used',
              standardDetails?.useOutlet,
              'Please answer if Outlet kit is used'
            ),
        ]
      : []),
  ];

  for (const validate of validations) {
    const error = validate();
    if (error) {
      return { isValid: false, message: error };
    }
  }

  return { isValid: true, message: '' };
};
